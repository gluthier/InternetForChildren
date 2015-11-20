function addCustomSearchResult (jNode) {
  if(needFiltering(jNode)) {
    var tmp = jNode;

    var div = document.createElement('div');
    $(div)
      .css("height", jNode.height())
      .css("width", jNode.width())
      .css("background-color", "red")
      .attr("class", tmp.attr("class"));

    jNode.replaceWith(div);
    $.get("https://dd324678.ngrok.io/test", function(data) {
      var img = document.createElement('img');
      var subDiv = document.createElement('div');
      var blocked = false;
      $(img)
        .attr('src', "http://www.alpost810.org/icons_buttons/stop-sign.png")
        .css('position', 'relative')
        //.css('top', '2px')
        .css('width', '12px')
        .css('height', '12px')
       //.css('right', '2px')
        .click(function(e) {
          blocked = true;
          console.log("On click to block");
          e.preventDefault();
        });
      $(subDiv).append(tmp);
      $(subDiv).append($(img));

      $(div).replaceWith($(subDiv)); 
    });
  }
}

function needFiltering(node, callback) {
  var css_height = parseInt(node.css('height').slice(0,-2));
  var css_width = parseInt(node.css('width').slice(0, -2));
  return css_width > 40 && css_height > 40;
}

waitForKeyElements ("img", addCustomSearchResult);
