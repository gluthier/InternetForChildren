/* use strict */
var self = require("sdk/self");
var md5 = require("./md5.js");
var Request = require("sdk/request").Request;
var EL = require("./EmptyListener.js");
let {
  Cc, Ci, Cu
} = require("chrome");
var wm = Cc["@mozilla.org/appshell/window-mediator;1"]
  .getService(Ci.nsIWindowMediator);
Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/NetUtil.jsm");

var httpRequestObserver = {
  observe: function (subject, topic, data) {
    if(topic == "http-on-examine-response") {
      subject.QueryInterface(Ci.nsIHttpChannel); // DO NOT REMOVE
      var channel = subject.QueryInterface(Ci.nsITraceableChannel);
//      if(/.*\.(png|jpg|jpeg)$/.test(channel.URI.spec)) {

      if(/.*learnmore.*$/.test(channel.URI.spec)) {
        // Request to backserver
        // Async or sync
        console.log("Intercepting " + channel.requestMethod + " " + channel.URI.spec);
          var newListener = new EL.EmptyListener();
        newListener.originalListener = subject.setNewListener(newListener); 
        /*NetUtil.asyncFetch(channel.URI.spec, function (inputStream, status) {
          // The file data is contained within inputStream.
          // You can read it into a string with
          var data = NetUtil.readInputStreamToString(inputStream, inputStream.available());
          Request({
            url: "http://9580fbb4.ngrok.io/test",
            content: {
              md5: md5.md5(data)
            },
          onComplete: function (response) {
          //  console.log(response.text);
            }
          }).post();
        });*/
      }
    }
  },

  get observerService() {
    return Cc["@mozilla.org/observer-service;1"]
      .getService(Ci.nsIObserverService);
  },

  register: function () {
    this.observerService.addObserver(this, "http-on-examine-response", false);
  },

  unregister: function () {
    this.observerService.removeObserver(this, "http-on-examine-response");
  }
};

httpRequestObserver.register();
