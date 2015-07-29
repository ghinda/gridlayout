/* Demos
 */

(function() {

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

    var target = e.target || e.srcElement;

    if(target.className.indexOf('dropdown-button') === -1) {

      // close all dropdowns
      for(i = 0; i < dropdowns.length; i++) {
        if(dropdowns[i].className.indexOf('dropdown-active') !== -1) {
          toggleClass(dropdowns[i], 'dropdown-active');
        }
      }

    } else {

      var dropdown = target.parentNode;

      toggleClass(dropdown, 'dropdown-active');

      e.preventDefault && e.preventDefault();

    }

  };

  var toggleContent = function(e) {

    var target = e.target || e.srcElement;

    if(target.className.indexOf('js-toggle-content') !== -1) {

      var contentNode = document.getElementById(target.getAttribute('data-content'));

      toggleClass(contentNode, 'content-show');

      e.preventDefault && e.preventDefault();
    }

  };

  var init = function() {
    // init content togglers
    addEventListener.call(document.body, 'click', toggleDropdown);

    // init dropdowns
    addEventListener.call(document.body, 'click', toggleContent);
  };

  init();

})();
