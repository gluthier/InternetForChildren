function addCustomSearchResult (jNode) {
  if(needFiltering(jNode)) {
    var tmp = jNode;

    var div = document.createElement('div');
    /* Waiting div, to block all images */
    $(div)
      .css("height", jNode.height())
      .css("width", jNode.width())
      .css("background-color", "red")
      .attr("class", tmp.attr("class"));

    jNode.replaceWith(div);
    /* We are requesting the server to know if we need to block it */
    $.get("https://dd324678.ngrok.io/test", function(data) {
      var img = document.createElement('img');
      var subDiv = document.createElement('div');
      var blocked = false;

      $(subDiv).append(tmp);
      $(subDiv).append($(img));

      $(img)
        .attr('src', "http://www.alpost810.org/icons_buttons/stop-sign.png")
        .css('position', 'relative')
        .css('width', '12px')
        .css('height', '12px')
        .click(function(e) {
          blocked = true;
          blockImage(subDiv);
          console.log("On click to block");
          e.preventDefault();
        });
      $(div).replaceWith($(subDiv)); // Replace waiting screen by image + block button
    });
  }
}

function needFiltering(node, callback) {
  var css_height = parseInt(node.css('height').slice(0,-2));
  var css_width = parseInt(node.css('width').slice(0, -2));
  return css_width > 40 && css_height > 40;
}

function blockImage(node) { 
  $.post("http://server.com/block/url", { url: $($(node).children()[0]).attr('src') })
    .done(function(data) {
      console.log(data);
    });
  blockCSS(node);
}

function unblockImage(node, old) {
  $.post("http://server.com/unblock/url", { url: $($(old).children()[0]).attr('src') })
    .done(function(data) {
      console.log(data);
    });
  $(old).children().last().remove(); // Hack, do not remove ! 
  $(node).replaceWith($(old));
}

function blockCSS(node) {
  var div = document.createElement('div');
  var tmp = node;
  $(div)
    .css("height", $($(node).children()[0]).height())
    .css("width", $($(node).children()[0]).width())
    .css("background-color", "black")
    .attr("class", $($(tmp).children()[0]).attr("class"))
    .click(function(e) {
      unblockImage(div, tmp);
      console.log("Allow image");
      e.preventDefault();
    });
    $(node).replaceWith(div);
}


waitForKeyElements ("img", addCustomSearchResult);
