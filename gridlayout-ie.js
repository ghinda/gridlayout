/* GridLayout support for IE8+
 * 
 * IE8 does not pass the correct cell height to grids 
 * nested inside table-rows.
 * IE9+ does not pass the correct cell height to child elements.
 */

(function(global) {
  if (!('window' in global && 'document' in global))
    return;
  
// https://github.com/inexorabletash/polyfill/blob/master/es5.js

// ES 15.2.3.7 Object.defineProperties ( O, Properties )
if (typeof Object.defineProperties !== "function") {
  Object.defineProperties = function (o, properties) {
    if (o !== Object(o)) { throw TypeError("Object.defineProperties called on non-object"); }
    var name;
    for (name in properties) {
      if (Object.prototype.hasOwnProperty.call(properties, name)) {
        Object.defineProperty(o, name, properties[name]);
      }
    }
    return o;
  };
}

// https://raw.githubusercontent.com/inexorabletash/polyfill/master/cssom.js

(function(global) {
  if (!('window' in global && 'document' in global))
    return;

  //----------------------------------------------------------------------
  //
  // CSSOM View Module
  // https://dev.w3.org/csswg/cssom-view/
  //
  //----------------------------------------------------------------------

  // Fix for IE8-'s Element.getBoundingClientRect()
  if ('TextRectangle' in this && !('width' in TextRectangle.prototype)) {
    Object.defineProperties(TextRectangle.prototype, {
      'width': { get: function() { return this.right - this.left; } },
      'height': { get: function() { return this.bottom - this.top; } }
    });
  }
}(this));


// https://raw.githubusercontent.com/jonathantneal/Polyfills-for-IE8/master/eventListener.js

// addEventListener polyfill (incomplete)
('Element' in this) && !('addEventListener' in this.Element.prototype) && (function (global) {
	function Event(e, element) {
		var instance = this;

		for (property in e) {
			instance[property] = e[property];
		}

		instance.currentTarget =  element;
		instance.target = e.srcElement || element;
		instance.timeStamp = +new Date;

		instance.preventDefault = function () {
			e.returnValue = false;
		};
		instance.stopPropagation = function () {
			e.cancelBubble = true;
		};
	}

	function addEventListener(type, listener) {
		var
		element = this,
		listeners = element.listeners = element.listeners || [],
		index = listeners.push([listener, function (e) {
			listener.call(element, new Event(e, element));
		}]) - 1;

		element.attachEvent('on' + type, listeners[index][1]);
	}

	function removeEventListener(type, listener) {
		for (var element = this, listeners = element.listeners || [], length = listeners.length, index = 0; index < length; ++index) {
			if (listeners[index][0] === listener) {
				element.detachEvent('on' + type, listeners[index][1]);
			}
		}
	}

	global.addEventListener = document.addEventListener = global.Element.prototype.addEventListener = addEventListener;
	global.removeEventListener = document.removeEventListener = global.Element.prototype.removeEventListener = removeEventListener;
})(this);

// https://raw.githubusercontent.com/jonathantneal/Polyfills-for-IE8/master/getComputedStyle.js
// getComputedStyle
!('getComputedStyle' in this) && (this.getComputedStyle = (function () {
	function getPixelSize(element, style, property, fontSize) {
		var
		sizeWithSuffix = style[property],
		size = parseFloat(sizeWithSuffix),
		suffix = sizeWithSuffix.split(/\d/)[0],
		rootSize;

		fontSize = fontSize != null ? fontSize : /%|em/.test(suffix) && element.parentElement ? getPixelSize(element.parentElement, element.parentElement.currentStyle, 'fontSize', null) : 16;
		rootSize = property == 'fontSize' ? fontSize : /width/i.test(property) ? element.clientWidth : element.clientHeight;

		return (suffix == 'em') ? size * fontSize : (suffix == 'in') ? size * 96 : (suffix == 'pt') ? size * 96 / 72 : (suffix == '%') ? size / 100 * rootSize : size;
	}

	function setShortStyleProperty(style, property) {
		var
		borderSuffix = property == 'border' ? 'Width' : '',
		t = property + 'Top' + borderSuffix,
		r = property + 'Right' + borderSuffix,
		b = property + 'Bottom' + borderSuffix,
		l = property + 'Left' + borderSuffix;

		style[property] = (style[t] == style[r] == style[b] == style[l] ? [style[t]]
		: style[t] == style[b] && style[l] == style[r] ? [style[t], style[r]]
		: style[l] == style[r] ? [style[t], style[r], style[b]]
		: [style[t], style[r], style[b], style[l]]).join(' ');
	}

	function CSSStyleDeclaration(element) {
		var
		currentStyle = element.currentStyle,
		style = this,
		fontSize = getPixelSize(element, currentStyle, 'fontSize', null);

		for (property in currentStyle) {
			if (/width|height|margin.|padding.|border.+W/.test(property) && style[property] !== 'auto') {
				style[property] = getPixelSize(element, currentStyle, property, fontSize) + 'px';
			} else if (property === 'styleFloat') {
				style['float'] = currentStyle[property];
			} else {
				style[property] = currentStyle[property];
			}
		}

		setShortStyleProperty(style, 'margin');
		setShortStyleProperty(style, 'padding');
		setShortStyleProperty(style, 'border');

		style.fontSize = fontSize + 'px';

		return style;
	}

	CSSStyleDeclaration.prototype = {
		constructor: CSSStyleDeclaration,
		getPropertyPriority: function () {},
		getPropertyValue: function ( prop ) {
			return this[prop] || '';
		},
		item: function () {},
		removeProperty: function () {},
		setProperty: function () {},
		getPropertyCSSValue: function () {}
	};

	function getComputedStyle(element) {
		return new CSSStyleDeclaration(element);
	}

	return getComputedStyle;
})(this));


}(this));
;/* GridLayout support for IE8+
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