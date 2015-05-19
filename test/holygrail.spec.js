/* holy-grail layout tests
 */

describe('Holy Grail Layout', function() {
  'use strict';
  
  var dom = {};
  
  beforeAll(function() {
    
    dom.$fixture = document.querySelector('.fixture-holygrail');
    
    dom.fixture = dom.$fixture.getBoundingClientRect();
    dom.container = dom.$fixture.querySelector('.gl-vertical').getBoundingClientRect();
    dom.header = dom.$fixture.querySelector('.header').getBoundingClientRect();
    dom.content = dom.$fixture.querySelector('.content').getBoundingClientRect();
    dom.footer = dom.$fixture.querySelector('.footer').getBoundingClientRect();
    dom.firstColumn = document.querySelector('.first-column').getBoundingClientRect();
    dom.lastColumn = document.querySelector('.last-column').getBoundingClientRect();
    dom.contentColumn = document.querySelector('.content-column').getBoundingClientRect();

    dom.$scrollview = document.querySelector('.scrollview');
    dom.scrollview = dom.$scrollview.getBoundingClientRect();

    dom.$bottomContent = document.querySelector('.bottom-content');
    dom.bottomContent = dom.$bottomContent.getBoundingClientRect();
    
  });

  it('should take up the full height of the container', function() {

    expect(dom.container.height).toBe(dom.fixture.height);

  });

  it('should have the content row expand in the remaining space', function() {

    expect(dom.content.height).toBe(dom.container.height - dom.header.height - dom.footer.height);

  });

  it('should have the first column take up the entire content row height', function() {

    expect(dom.firstColumn.height).toBe(dom.content.height);

  });

  it('should have the content column take up the entire content row height', function() {

    expect(dom.contentColumn.height).toBe(dom.content.height);

  });

  it('should have the content column take up the remaining width', function() {

    expect(dom.contentColumn.width).toBe(dom.content.width - dom.firstColumn.width - dom.lastColumn.width);

  });

  it('should not have the bottom content into view ', function() {
    
    expect(dom.bottomContent.top).toBeGreaterThan(dom.scrollview.top + dom.scrollview.height);

  });

  it('should scroll the bottom content into view', function(done) {

    dom.$bottomContent.scrollIntoView();

    // give it a second to finish scrolling
    setTimeout(function() {
      dom.bottomContent = dom.$bottomContent.getBoundingClientRect();
      
      // for IE8
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      
      // refresh the scrollview boundingClientRect, for Opera 12
      dom.scrollview = dom.$scrollview.getBoundingClientRect();
      
      expect(dom.bottomContent.top).toBeLessThan(dom.scrollview.top + dom.scrollview.height + scrollTop);
      
      // clean-up after yourself
      dom.$scrollview.scrollTop = 0;
      
      done();

    });

  });

});

