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

  var toggleContent = function(e) {
    e.preventDefault();

    var contentNode = document.getElementById(e.target.getAttribute('data-content'));

    toggleClass(contentNode, 'content-show');
  };

  var $btnToggle = document.querySelectorAll('.js-toggle-content');

  for(var i=0; i < $btnToggle.length; i++) {
    $btnToggle[i].addEventListener('click', toggleContent);
  }

})();
