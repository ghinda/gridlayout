/* GridLayout support for IE 9+
 */

(function() {
  'use strict';
  
  var setScrollviewSizes = function() {
  
    var $scrollviews = document.querySelectorAll('.gl-scrollview');
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
      
      // instead of checking for IE 9+ by user agent,
      // check if the size is wrong.
      if(scrollview.height !== parent.height || scrollview.width !== parent.width) {
        
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
    
    // only listen to the resize event if we had broken dimensions
    if(setScrollviewSizes()) {
      window.addEventListener('resize', setScrollviewSizes);
    }
    
  });

})();