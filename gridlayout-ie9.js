/* GridLayout support for IE 9+
 * 
 * IE 9+ does not pass the correct cell height to child elements.
 */

(function() {
  'use strict';
  
  // exclude IE8
  if(!window.addEventListener) {
    return;
  }
  
  var setScrollviewSizes = function() {
  
    var $scrollviews = document.querySelectorAll('.gl, .gl-scrollview, .gl-scrollview-content');
    var i;
    var $parent;
    var scrollview;
    var parent;
    
    var dimensions = [];
    
    // elements had wrong sizes
    var isBroken = false;

    for(i = 0; i < $scrollviews.length; i++) {
      
      scrollview = $scrollviews[i].getBoundingClientRect();
      $parent = $scrollviews[i].parentNode;
      parent = $parent.getBoundingClientRect();
      
      var parentDisplay = window.getComputedStyle($parent).display;
      
      // instead of checking for IE 9+ by user agent,
      // check if the size is wrong,
      // and the parent is a table-cell.
      if(parentDisplay === 'table-cell' && (scrollview.height !== parent.height || scrollview.width !== parent.width)) {
        
        // at least one element had wrong sizes,
        // must be IE 9+.
        isBroken = true;  

        // we can't separate property read/write into separate loops,
        // for performance with reflows, because we need to have the 
        // corrent dimensions set on a scrollview parent, once we reach a child.
        $scrollviews[i].style.height = parent.height + 'px';
        $scrollviews[i].style.width = parent.width + 'px';
        
      }
      
    }
    
    return isBroken;
    
  };
  
  document.addEventListener('DOMContentLoaded', function() {
    
    // attach events only if we had broken dimensions
    if(setScrollviewSizes()) {
      window.addEventListener('resize', setScrollviewSizes);
      document.body.addEventListener('DOMSubtreeModified', setScrollviewSizes);
    }
    
  });
  

}());