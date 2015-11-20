#include <v8.h>
#include <node.h>
#include <nan.h>
#include <pHash.h>
#include <sstream>
#include <fstream>
#include <iomanip>
using namespace node;

template < typename T >
std::string int_to_hex( T i ) {
  std::stringstream stream;
  stream << "0x"
         << std::setfill ('0') << std::setw(sizeof(T)*2)
         << std::hex << i;
  return stream.str();
}

bool fileExists(const char* filename) {
    ifstream file(filename);
    return !!file;
}

template <typename T>
string NumberToString ( T Number ) {
    ostringstream ss;
    ss << Number;
    return ss.str();
}

string uint_to_hex(uint8_t* input, int len)
{
    static const char* const lut = "0123456789ABCDEF";

    std::stringstream stream;
    stream << "0x";
    for (int i = 0; i < len; ++i)
    {
        const unsigned char c = input[i];
        stream << lut[c >> 4] << lut[c & 15];
    }

    return stream.str();
}

// https://gist.github.com/rvagg/bb08a8bd2b6cbc264056#file-phash-cpp
class PhashRequest : public Nan::AsyncWorker {
 public:
  PhashRequest(Nan::Callback *callback, string file)
    : Nan::AsyncWorker(callback), error(false), file(file), hash(""), bigint("") {}
  ~PhashRequest() {}

  void Execute () {
    // prevent segfault on an empty file, see https://github.com/aaronm67/node-phash/issues/8
    const char* _file = file.c_str();
    if (!fileExists(_file)) {
        error = true;
        return;
    }

    try {
        ulong64 _hash = 0;
        ph_dct_imagehash(_file, _hash);
        hash = int_to_hex(_hash);
        bigint = NumberToString(_hash);
    }
    catch(...) {
        error = true;
        // something went wrong with hashing
        // probably a CImg or ImageMagick IO Problem
    }
  }

  void HandleOKCallback () {
    Nan::HandleScope scope;

    v8::Local<v8::Value> argv[3];

    if (error) {
        argv[0] = Nan::Error("Error getting image phash.");
    }
    else {
        argv[0] = Nan::Null();
    }

    argv[1] = Nan::New<v8::String>(hash).ToLocalChecked();
    argv[2] = Nan::New<v8::String>(bigint).ToLocalChecked();

    callback->Call(3, argv);
  }

 private:
    bool error;
    string file;
    string hash;
    string bigint;
};

NAN_METHOD(ImageHashAsync) {
    v8::String::Utf8Value str(info[0]);
    Nan::Callback *callback = new Nan::Callback(info[1].As<v8::Function>());
    Nan::AsyncQueueWorker(new PhashRequest(callback, string(*str)));
    return;
}

// https://gist.github.com/rvagg/bb08a8bd2b6cbc264056#file-phash-cpp
class MHPhashRequest : public Nan::AsyncWorker {
 public:
  MHPhashRequest(Nan::Callback *callback, string file)
    : Nan::AsyncWorker(callback), error(false), file(file), hash("") {}
  ~MHPhashRequest() {}

  void Execute () {
    // prevent segfault on an empty file, see https://github.com/aaronm67/node-phash/issues/8
    const char* _file = file.c_str();
    if (!fileExists(_file)) {
        error = true;
        return;
    }

    try {
        int hashlen = 0;
        int alpha = 2;
        int level = 1;
        uint8_t* _hash = ph_mh_imagehash(_file, hashlen, alpha, level);
        hash = uint_to_hex(_hash, hashlen);
    }
    catch(...) {
        error = true;
        // something went wrong with hashing
        // probably a CImg or ImageMagick IO Problem
    }
  }

  void HandleOKCallback () {
    Nan::HandleScope scope;

    v8::Local<v8::Value> argv[2];

    if (error) {
        argv[0] = Nan::Error("Error getting image phash.");
    }
    else {
        argv[0] = Nan::Null();
    }

    argv[1] = Nan::New<v8::String>(hash).ToLocalChecked();

    callback->Call(2, argv);

  }

 private:
    bool error;
    string file;
    string hash;
};

NAN_METHOD(MHImageHashAsync) {
    v8::String::Utf8Value str(info[0]);
    Nan::Callback *callback = new Nan::Callback(info[1].As<v8::Function>());
    Nan::AsyncQueueWorker(new MHPhashRequest(callback, string(*str)));
    return;
}

void RegisterModule(v8::Local<v8::Object> target) {
  Nan::SetMethod(target, "imageHash", ImageHashAsync);
  Nan::SetMethod(target, "imageHashMH", MHImageHashAsync);
}

NODE_MODULE(pHash, RegisterModule);
