var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");
pageMod.PageMod({
    include: "*",
    contentScriptWhen: 'ready',
    contentScriptFile: [data.url("jquery.js"),
                        data.url("wfk.js"),
                        data.url("md5.js"),
                        data.url("contentScript.js")]
});
