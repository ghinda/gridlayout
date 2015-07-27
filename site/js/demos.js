/* Demos
 */

(function() {

  var toggleClass = function(node, className) {

    var foundClassPosition = node.className.indexOf(className);

    if(foundClassPosition === -1) {
      node.className += ' ' + className;
    } else {

      var tempClass = node.className.substr(0, foundClassPosition - 1);

      node.className = tempClass + node.className.substr(className.length + foundClassPosition);
    }

  };

  var toggleDropdown = function(e) {

    var dropdowns = document.querySelectorAll('.dropdown');
    var i;

    if(e.target.className.indexOf('dropdown-button') === -1) {
      // close all dropdowns
      for(i = 0; i < dropdowns.length; i++) {
        if(dropdowns[i].className.indexOf('dropdown-active') !== -1) {
          toggleClass(dropdowns[i], 'dropdown-active');
        }
      }

      return false;
    }

    var dropdown = e.target.parentNode;

    toggleClass(dropdown, 'dropdown-active');

  };

  var toggleContent = function(e) {

    if(e.target.className.indexOf('js-toggle-content') !== -1) {
      e.preventDefault();

      var contentNode = document.getElementById(e.target.getAttribute('data-content'));

      toggleClass(contentNode, 'content-show');
    }

  };

  var init = function() {
    // init content togglers
    document.body.addEventListener('click', toggleDropdown);

    // init dropdowns
    document.body.addEventListener('click', toggleContent);
  };

  init();

})();
