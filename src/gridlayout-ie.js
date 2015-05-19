/* GridLayout support for IE8+
 * 
 * IE8 does not pass the correct cell height to grids 
 * nested inside table-rows.
 * IE9+ does not pass the correct cell height to child elements.
 */

(function() {
  'use strict';
  
  var setGridSizes = function() {
  
    var $grids = document.querySelectorAll('.gl, .gl-scrollview, .gl-scrollview-content');
    var i;
    var $parent;
    var grid;
    var parent;
    
    console.log('set sizes');
    
    var dimensions = [];
    
    // elements had wrong sizes
    var isBroken = false;

    for(i = 0; i < $grids.length; i++) {
      
      grid = $grids[i].getBoundingClientRect();
      $parent = $grids[i].parentNode;
      parent = $parent.getBoundingClientRect();
      
      var parentDisplay = window.getComputedStyle($parent).display;
      
      var isTableCell = (parentDisplay === 'table-cell' || parentDisplay === 'table-row');
      
      // instead of checking for IE 9+ by user agent,
      // check if the parent is a table-cell,
      // and the size is wrong.
      if(isTableCell && (grid.height !== parent.height)) {
        
        // at least one element had wrong sizes,
        // must be IE 9+.
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
  
  var domReady = function() {
    
    // attach events only if we had broken dimensions
    if(setGridSizes()) {
      window.addEventListener('resize', setGridSizes);
      document.body.addEventListener('DOMSubtreeModified', setGridSizes);
      
      // IE8
      document.body.addEventListener('propertychange', setGridSizes);
    }
    
  };
  
  // instead of DOMContentLoaded, for IE8 support
  document.addEventListener('readystatechange', domReady);
  
}());