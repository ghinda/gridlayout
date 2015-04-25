/* holy-grail layout tests
 */

describe('Holy Grail Layout', function() {
  'use strict';
  
  var $fixture;
  var fixture;
  var container;
  var header;
  var content;
  var footer;
  var firstColumn;
  var lastColumn;
  var contentColumn;
  var $scrollview;
  var scrollview;
  var $bottomContent;
  var bottomContent;
  
  beforeAll(function() {
    
    $fixture = document.querySelector('.fixture-holygrail');

    fixture = $fixture.getBoundingClientRect();
    container = $fixture.querySelector('.gl-container').getBoundingClientRect();
    header = $fixture.querySelector('.header').getBoundingClientRect();
    content = $fixture.querySelector('.content').getBoundingClientRect();
    footer = $fixture.querySelector('.footer').getBoundingClientRect();
    firstColumn = document.querySelector('.first-column').getBoundingClientRect();
    lastColumn = document.querySelector('.last-column').getBoundingClientRect();
    contentColumn = document.querySelector('.content-column').getBoundingClientRect();

    $scrollview = document.querySelector('.scrollview');
    scrollview = $scrollview.getBoundingClientRect();

    $bottomContent = document.querySelector('.bottom-content');
    bottomContent = $bottomContent.getBoundingClientRect();
    
  });

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
      
      // clean-up after yourself
      $scrollview.scrollTop = 0;
      
      done();

    });

  });

});

