var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");

pageMod.PageMod({
    include: "*",
    contentScriptWhen: 'ready',
    contentScriptFile: [data.url("jquery.js"),
                        data.url("wfk.js"),
                        data.url("md5.js"),
//                        data.url("zlib.js"),
//                        data.url("hash.js"),
                        data.url("contentScript.js")]
});

var { ToggleButton } = require("sdk/ui/button/toggle");

var button = ToggleButton({
  id: "my-button",
  label: "my button",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onChange: function(state) {
    console.log(state.label + " checked state: " + state.checked);
  }
});
