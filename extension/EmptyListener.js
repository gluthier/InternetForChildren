let {
  Cc, Ci, Cu
} = require("chrome");
Cu.import("resource://gre/modules/FileUtils.jsm");
function EmptyListener() {
  this.originalListener = null;
}

EmptyListener.prototype = 
{
  onDataAvailable: function(request, context, inputStream, offset, count) { 
    console.log("On data available") 
  },
  onStartRequest: function(request, context) {},
  onStopRequest: function(request, ctx, stat) {
        //var newPage = this.data.join('');
        var converter = Cc["@mozilla.org/intl/scriptableunicodeconverter"]
                          .createInstance(Ci.nsIScriptableUnicodeConverter);
converter.charset = /* The charset you want to use. Using UTF-8 in this example */ "UTF-8";
        var newPage = "<html><body><h1>TEST!</h1></body></html>";
        var stream = converter.convertToInputStream(newPage);
        var count = {};
        converter.convertToByteArray(newPage, count);
        this.originalListener.onDataAvailable(request, ctx,
            stream, 0, count.value);

        this.originalListener.onStopRequest(request, ctx, stat);
  },
  QueryInterface: function(aIID) {
    if (aIID.equals(Ci.nsIStreamListener) ||
        aIID.equals(Ci.nsISupports)) {
        return this;
    }
    throw Components.results.NS_NOINTERFACE;
  }

}

exports.EmptyListener = EmptyListener;
