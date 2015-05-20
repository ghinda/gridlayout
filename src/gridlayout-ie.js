/* GridLayout support for IE8+
 * 
 * IE8 does not pass the correct cell height to grids 
 * nested inside table-rows.
 * IE9+ does not pass the correct cell height to child elements.
 */

(function() {
  'use strict';
    
  /* add width and height to getBoundingClientRect in IE8
   */

  var cloneObject = function(obj) {
    var newObj = {};
    for(var i in obj) {
      if (obj[i] && typeof obj[i] === 'object') {
        newObj[i] = obj[i].clone();
      } else {
        newObj[i] = obj[i];
      }
    }
    return newObj;
  };

  var getBoundingClientRect = (function() {
    
    if(!('TextRectangle' in window)) {
      return window.Element.prototype.getBoundingClientRect;
    }
    
    return function() {
      
      var clientRect = cloneObject(this.getBoundingClientRect());
      
      clientRect.width = clientRect.right - clientRect.left;
      clientRect.height = clientRect.bottom - clientRect.top;
      
      return clientRect;
    };
    
  })();

  /* addEventListener for IE8
   * 
   */

  var addEventListener = (function() {
    
    if('addEventListener' in window.Element.prototype) {
      return window.Element.prototype.addEventListener;
    }
    
    return function(type, listener) {
      this.attachEvent('on' + type, listener);
    };
    
  })();

  // set the correct grid and scrollview sizes
  var setGridSizes = function() {
  
    var $grids = document.querySelectorAll('.gl, .gl-scrollview, .gl-scrollview-content');
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
      
      // instead of checking for IE 9+ by user agent,
      // check if the parent is a table-cell,
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
    
    // attach events only if we had broken dimensions
    if(setGridSizes()) {
      
      addEventListener.call(window, 'resize', setGridSizes);
      
      // dom changes
      addEventListener.call(document.body, 'DOMSubtreeModified', setGridSizes);
      
      // IE8 dom changes
      addEventListener.call(document.body, 'propertychange', setGridSizes);
    }
    
  };
  
  // instead of DOMContentLoaded, for IE8 support
  addEventListener.call(document, 'readystatechange', domReady);
  
}());