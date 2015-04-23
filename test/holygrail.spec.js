/* holy-grail layout tests
 */

(function() {

var $fixture = document.querySelector('.fixture-holygrail');

var fixture = $fixture.getBoundingClientRect();
var container = $fixture.querySelector('.gl-container').getBoundingClientRect();
var header = $fixture.querySelector('.header').getBoundingClientRect();
var content = $fixture.querySelector('.content').getBoundingClientRect();
var footer = $fixture.querySelector('.footer').getBoundingClientRect();
var firstColumn = document.querySelector('.first-column').getBoundingClientRect();
var lastColumn = document.querySelector('.last-column').getBoundingClientRect();
var contentColumn = document.querySelector('.content-column').getBoundingClientRect();
var scrollview = document.querySelector('.scrollview').getBoundingClientRect();

var $bottomContent = document.querySelector('.bottom-content');
var bottomContent = $bottomContent.getBoundingClientRect();

describe('Holy Grail Layout', function() {

  it('should take up the full height of the container', function() {

    expect(container.height).toBe(fixture.height);

  });

  it('should have the content row expand in remaining space', function() {

    expect(content.height).toBe(container.height - header.height - footer.height);

  });

  it('should have the first column take up the entire content row height', function() {

    expect(firstColumn.height).toBe(content.height);

  });

  it('should have the content column take up the entire content row height', function() {

    expect(contentColumn.height).toBe(content.height);

  });

  it('should have the content column take up the remaining width', function() {

    expect(contentColumn.width).toBe(content.width - firstColumn.width - lastColumn.width);

  });

  it('should not have the bottom content into view ', function() {

    expect(bottomContent.top).toBeGreaterThan(scrollview.top + scrollview.height);

  });

  it('should scroll the bottom content into view', function(done) {

    $bottomContent.scrollIntoView();

    // give it a second to finish scrolling
    setTimeout(function() {
      bottomContent = $bottomContent.getBoundingClientRect();

      expect(bottomContent.top).toBeLessThan(scrollview.top + scrollview.height);
      done();

    });

  });

});


}());

