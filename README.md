[GridLayout](https://ghinda.net/gridlayout/) [![Build Status](https://api.travis-ci.org/ghinda/gridlayout.svg)](https://travis-ci.org/ghinda/gridlayout)
============

Lightweight grid system for advanced horizontal and vertical app layouts, with support for older browsers.

Installation
------------

```
npm install gridlayout
```

or

```
bower install gridlayout
```

Why use GridLayout?
-------------------

If you need to create advanced app layouts, similar to native app layouts, but still need to support older browsers, GridLayout is for you.

If you just support modern browsers, you’re probably better off using Flexbox.

GridLayout is built using `display: table`.

Features
--------

* Responsive - Mobile first and adapts to two other breakpoints.
* Familiar markup - Class naming similar to the Bootstrap grid.
* Vertical grids - Take up the entire height of the container and split it.
* Vertical alignment - Align cell content vertically with just a class.
* Scrollview - Scroll the content inside one of the grid cells.

Browser support
---------------

* IE 8+
* iOS 5+
* Android 3+
* Modern browsers

Browsers that support the overall grid, but not the scrollview:

* Opera Mini
* iOS 4
* Android 2

**Note:**

For overall IE support you have to include the `gridlayout-ie.js` script.

For IE8, also include [Respond.js](https://github.com/scottjehl/Respond), because the grid is mobile-first.

License
-------

GridLayout is licensed under the MIT license.
