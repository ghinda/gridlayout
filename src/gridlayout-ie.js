/* GridLayout support for IE8+
 *
 * IE8 does not pass the correct cell height to grids
 * nested inside table-rows.
 * IE9+ does not pass the correct cell height to child elements.
 */

(function() {
  'use strict';

  // getBoundingClientRect width/height with IE8 support
  var getBoundingClientRect = (function() {

    if(!('TextRectangle' in window)) {
      return window.Element.prototype.getBoundingClientRect;
    }

    return function() {

      var clientRect = this.getBoundingClientRect();
      var dimensions = {};

      dimensions.width = clientRect.right - clientRect.left;
      dimensions.height = clientRect.bottom - clientRect.top;

      return dimensions;
    };

  })();

  // addEventListener with IE8 support
  var addEventListener = (function() {

    if('addEventListener' in window.Element.prototype) {
      return function(type, listener) {
        this.addEventListener(type, listener, false);
      };
    }

    return function(type, listener) {
      this.attachEvent('on' + type, listener);
    };

  })();

  // set the correct grid and scrollview sizes
  var setGridSizes = function() {

    var $grids = document.querySelectorAll('.gl-vertical, .gl-fill, .gl-scrollview, .gl-scrollview-content');
    var i;
    var $parent;
    var grid;
    var parent;

    // elements had wrong sizes
    var isBroken = false;

    for(i = 0; i < $grids.length; i++) {

      grid = getBoundingClientRect.call($grids[i]);
      $parent = $grids[i].parentNode;
      parent = getBoundingClientRect.call($parent);

      var parentDisplay;
      if($parent.currentStyle) {
        parentDisplay = $parent.currentStyle.display;
      } else {
        parentDisplay = getComputedStyle($parent).display;
      }

      var isTableCell = (parentDisplay === 'table-cell' || parentDisplay === 'table-row');

      // instead of checking for IE by user agent, check if
      // the parent is a table cell,
      // the grid should be of 100% height,
      // and the size is wrong.
      if(isTableCell && (grid.height !== parent.height)) {

        // at least one element had wrong sizes,
        // must be IE.
        isBroken = true;

        // we can't separate property read/write into separate loops,
        // for performance with reflows, because we need to have the
        // corrent dimensions set on a grid parent, once we reach a child.
        $grids[i].style.height = parent.height + 'px';

        // rows without dimensions set take up more space than needed.
        if(parentDisplay === 'table-row') {
          $parent.style.height = parent.height + 'px';
        }

      }

    }

    return isBroken;

  };

  var domReady = function(e) {

    setGridSizes();

    // page resize
    addEventListener.call(window, 'resize', setGridSizes);

    // dom changes
    addEventListener.call(document.body, 'DOMSubtreeModified', setGridSizes);

    // IE8 dom changes
    addEventListener.call(document.body, 'propertychange', setGridSizes);

  };

  // in case the dom is already ready
  if(document.readyState === 'interactive' || document.readyState === 'complete') {
    domReady();
  } else {
    // DOMContentLoaded with IE8 support
    addEventListener.call(document, 'readystatechange', domReady);
  }

})();
