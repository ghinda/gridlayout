(function() {
  "use strict";
  var getBoundingClientRect = function() {
    if (!("TextRectangle" in window)) {
      return window.Element.prototype.getBoundingClientRect;
    }
    return function() {
      var clientRect = this.getBoundingClientRect();
      var dimensions = {};
      dimensions.width = clientRect.right - clientRect.left;
      dimensions.height = clientRect.bottom - clientRect.top;
      return dimensions;
    };
  }();
  var addEventListener = function() {
    if ("addEventListener" in window.Element.prototype) {
      return function(type, listener) {
        this.addEventListener(type, listener, false);
      };
    }
    return function(type, listener) {
      this.attachEvent("on" + type, listener);
    };
  }();
  var setGridSizes = function() {
    var $grids = document.querySelectorAll(".gl, .gl-scrollview, .gl-scrollview-content");
    var i;
    var $parent;
    var grid;
    var parent;
    var isBroken = false;
    for (i = 0; i < $grids.length; i++) {
      grid = getBoundingClientRect.call($grids[i]);
      $parent = $grids[i].parentNode;
      parent = getBoundingClientRect.call($parent);
      var parentDisplay;
      if ($parent.currentStyle) {
        parentDisplay = $parent.currentStyle.display;
      } else {
        parentDisplay = getComputedStyle($parent).display;
      }
      var isTableCell = parentDisplay === "table-cell" || parentDisplay === "table-row";
      if (isTableCell && grid.height !== parent.height) {
        isBroken = true;
        $grids[i].style.height = parent.height + "px";
        if (parentDisplay === "table-row") {
          $parent.style.height = parent.height + "px";
        }
      }
    }
    return isBroken;
  };
  var domReady = function(e) {
    setGridSizes();
    addEventListener.call(window, "resize", setGridSizes);
    addEventListener.call(document.body, "DOMSubtreeModified", setGridSizes);
    addEventListener.call(document.body, "propertychange", setGridSizes);
  };
  if (document.readyState === "interactive" || document.readyState === "complete") {
    domReady();
  } else {
    addEventListener.call(document, "readystatechange", domReady);
  }
})();