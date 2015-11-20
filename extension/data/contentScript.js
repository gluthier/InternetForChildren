function addCustomSearchResult (jNode) {
  jNode.replaceWith('<div data="' + jNode + '" style="top:0; left:0; position: relative; height:' + jNode.height() + 'px; width:' + jNode.width() + 'px; background-color: black;">Test</div>');
  jNode.replaceWith(jNode.data);
}
waitForKeyElements ("img", addCustomSearchResult);
