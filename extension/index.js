/* use strict */ 
var self = require("sdk/self");

let {
    Cc, Ci, Cu
} = require("chrome");
var wm = Cc["@mozilla.org/appshell/window-mediator;1"]
    .getService(Ci.nsIWindowMediator);
Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");

var httpRequestObserver =
{
  observe: function(subject, topic, data)
  {
    if (topic == "http-on-examine-response") {
      subject.QueryInterface(Ci.nsIHttpChannel); // DO NOT REMOVE
      var channel = subject.QueryInterface(Ci.nsITraceableChannel);
    if( /.*\.(png|jpg|jpeg)$/.test(channel.URI.spec)) {
      // Request to backserver
      // Async or sync
      console.log("Intercepting " + channel.requestMethod + " " +  channel.URI.spec);
     }
    }
  },

  get observerService() {
    return Cc["@mozilla.org/observer-service;1"]
                     .getService(Ci.nsIObserverService);
  },

  register: function()
  {
    this.observerService.addObserver(this, "http-on-examine-response", false);
  },                                                                                                    

  unregister: function()
  {
    this.observerService.removeObserver(this, "http-on-examine-response");
  }
};

httpRequestObserver.register();
