var serverURL = "https://8473b6b3.ngrok.io";

function addCustomSearchResult(jNode) {
  if(needFiltering(jNode)) {
    var reportDiv = document.createElement('div');
    var blockedDiv = document.createElement('div');
    var blocked = 0;

    $(reportDiv)
      .css("position", "absolute")
      .css("top", "0")
      .css("left", "0")
      .css("height", "20")
      .css("width", "20")
      .css("cursor", "pointer")
      .css("background-image", "url(https://pbs.twimg.com/media/CUPMT7-U8AACwrZ.png)")
      .css("background-size", "100% 100%")
      .css("z-index", "99")
      .on('click', function () {
        $(jNode).parent().click(function (e) {
          e.preventDefault();
          e.stopPropagation();
        });

        $(reportDiv).hide();
        $(jNode).hide();
        $(blockedDiv).insertAfter(jNode);

        blockImage(jNode.attr("src"));
      });
    $(blockedDiv)
      .attr("class", jNode.attr("class"))
      .css("position", "relative")
      .css("top", "0")
      .css("left", "0")
      .css("cursor", "default")
      .css("height", jNode.height())
      .css("width", jNode.width())
      .css("background-color", "black")
      .html(
        ($(jNode).height() < "100" || $(jNode).width() < "100")? '<a class = "green" style="cursor: pointer;border: none;"> Allow </a><br /><a class="yellow" style="cursor: pointer; border: none;">Preview</a>' : '<br/><h1 class="derpTitle"> This photo has been reported </h1> <a class = "derp green"> Allow </a><a class="derp yellow">Preview</a>'
      ).on('click', '.yellow', function () {
        password = prompt('Please enter your password to preview the image', '');

        if(password == "pass") {
          $(blockedDiv).hide();
          $(jNode).show();
          $(jNode).css("filter", "blur(2px)");
          setTimeout(function () {
            $(blockedDiv).show();
            $(jNode).hide();
            $(jNode).css("filter", "blur(0px)");
          }, 3000);
        }
      }).on('click', '.green', function () {
        password = prompt('Please enter your password to preview the image', '');

        if(password == "pass") {
          $(blockedDiv).hide();
          $(jNode).show();
          $(reportDiv).insertAfter(jNode);

          //REQUEST
          unblockImage(jNode.attr("src"));
        }
      });

    $(jNode).hide();
    isBlocked($(jNode).attr("src"), function (data) {
      $(jNode).show();
      if(!data) {
        $(reportDiv).insertAfter(jNode);
      } else {
        $(jNode).parent().click(function (e) {
          e.preventDefault();
          e.stopPropagation();
        });
        $(blockedDiv).insertAfter(jNode);
        $(jNode).hide();
      }
    });
  }
}

function needFiltering(node, callback) {
  var css_height = parseInt(node.css('height').slice(0, -2));
  var css_width = parseInt(node.css('width').slice(0, -2));
  return css_width > 60 && css_height > 60;
}

function isBlocked(url, fun) {
  $.ajax({
      type: 'POST',
      url: serverURL + "/url/check",
      data: {
        'url': url
      }
    })
    .done(function (data) {
      fun(data.blocked);
    });
}

function blockImage(url) {
  $.post(serverURL + "/url/block", {
      'url': url
    })
    .done(function (data) {
      return true;
    });
}

function unblockImage(url) {
  $.post(serverURL + "/url/unblock", {
      'url': url
    })
    .done(function (data) {
      return true;
    });
}

waitForKeyElements("img", addCustomSearchResult);

$('head').append(
  "<style type=\"text/css\">        /* Google Fonts */ @import url(http://fonts.googleapis.com/css?family=Open+Sans);  /* set global font to Open Sans */ body {   font-family: 'Open Sans', 'sans-serif';   background-image: url(http://benague.ca/files/pw_pattern.png); }  /* css for title */ .derpTitle {   text-decoration:none; margin-left:10px; color: white;   text-align: left; font-size:1em}  .link {   border-bottom: 2px dotted #55acee;   text-decoration: none;   color: #55acee;   transition: .3s;   -webkit-transition: .3s;   -moz-transition: .3s;   -o-transition: .3s; }  .link:hover {   color: #2ecc71;   border-bottom: 2px dotted #2ecc71; }  /* css for the shiny buttons */ .derp {   cursor: pointer;   margin: 10px;   border-radius: 5px;   text-decoration: none;   padding: 10px;   font-size: 12px;   transition: .3s;   -webkit-transition: .3s;   -moz-transition: .3s;   -o-transition: .3s;   display: inline-block; }  .btn:hover {   cursor: url(http://cur.cursors-4u.net/symbols/sym-1/sym46.cur), auto; } .blue {   color: #55acee;   border: 2px #55acee solid; }  .blue:hover {   background-color: #55acee;   color: #fff }  .green {   color: #2ecc71;   border: 2px #2ecc71 solid; }  .green:hover {   color: #fff;   background-color: #2ecc71; text-decoration:none;}  .red {   color: #e74c3c;   border: 2px #e74c3c solid; }  .red:hover {   color: #fff;   background-color: #e74c3c; }  .purple {   color: #9b59b6;   border: 2px #9b59b6 solid; }  .purple:hover {   color: #fff;   background-color: #9b59b6; }  .orange {   color: #e67e22;   border: 2px #e67e22 solid; }  .orange:hover {   color: #fff;   background-color: #e67e22; }  .yellow {   color: #f1c40f;   border: 2px #f1c40f solid; }  .yellow:hover {   color: #fff;   background-color: #f1c40f; text-decoration:none;}  .buttons {   padding-top: 30px;   text-align: center; }  /* copyright stuffs.. */ p {   text-align: center;   color: #55acee;   padding-top: 20px; }     </style>"
);

waitForKeyElements ("img", addCustomSearchResult);
