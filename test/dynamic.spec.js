/* holy-grail layout tests
 */

describe('Dynamic DOM', function() {
  'use strict';

  var dom = {};

  beforeAll(function() {

    dom.$fixture = document.querySelector('.fixture-dynamic');
    dom.fixture = dom.$fixture.getBoundingClientRect();

    dom.$container = dom.$fixture.querySelector('.gl-vertical');
    dom.container = dom.$container.getBoundingClientRect();

    dom.$header = dom.$container.querySelector('.header');
    dom.header = dom.$header.getBoundingClientRect();

    dom.$content = dom.$container.querySelector('.content');
    dom.content = dom.$header.getBoundingClientRect();

  });

  it('should split row heights into half of the container height', function() {

    expect(dom.header.height).toEqual(dom.container.height / 2);

  });

  it('should have equal heights for rows', function() {

    expect(dom.header.height).toEqual(dom.content.height);

  });

  it('should add a new row with equal height', function() {

    dom.$footer = document.createElement('div');
    dom.$footer.className = 'gl-cell';
    dom.$footer.innerHTML = 'row';

    dom.$container.appendChild(dom.$footer);

    // refresh dimensions
    dom.footer = dom.$footer.getBoundingClientRect();
    dom.header = dom.$header.getBoundingClientRect();
    dom.content = dom.$content.getBoundingClientRect();

    expect(dom.footer.height).toBe(dom.header.height);

  });

  it('should split row heights into a third of the container height', function() {

    expect(dom.header.height).toEqual(dom.container.height / 3);

  });

  it('should add a scrollview and nested grid with one column taking up the entire row width', function() {

    dom.$content.innerHTML = '' +
    '<div class="gl-scrollview">' +
      '<div class="gl-scrollview-content">' +
        '<div class="gl gl-fill gl-sm">' +
          '<div class="gl-cell column">' +
            'col' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

    dom.$column = dom.$content.querySelector('.column');

    dom.column = dom.$column.getBoundingClientRect();

    expect(dom.column.width).toEqual(dom.content.width);

  });

  it('should have the nested column take up the entire row height', function(done) {

    // hack for IE 9+ support
    setTimeout(function() {
      dom.column = dom.$column.getBoundingClientRect();

      expect(dom.column.height).toEqual(dom.content.height);
      done();
    }, 500);

  });

  it('should add a new column and split the width in half', function() {

    dom.$lastColumn = document.createElement('div');
    dom.$lastColumn.className = 'gl-cell';
    dom.$lastColumn.innerHTML = 'col';

    dom.$content.querySelector('.gl').appendChild(dom.$lastColumn);

    // refresh dimensions
    dom.lastColumn = dom.$lastColumn.getBoundingClientRect();
    dom.column = dom.$column.getBoundingClientRect();

    expect(dom.lastColumn.width).toBe(dom.column.width);

  });

});
