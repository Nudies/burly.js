/**
 *  ~burly.js lightweight html templating~
 *  @author: nudies@github.com
 *  @version: 1.0.5
 *  @license: MIT
 */

( function ( global ) {
  'use strict';
  var Burly = {};
  var safe = ['PRE', 'CODE'];  // Element that won't be inspected
  var re = /\{\{\s*(\w+)\s*\}\}/g;
  var re2 = /\{\{\s*(\w+)\s*\}\}/;


  if ( global.QUnit !== 'undefined' ) {
    // Objects and functions we want to expose to
    // the global scope for testing.
    global.Bind = Bind;
    global.Bind_factory = Bind_factory;
    global.Util = {
      curlyRe: curlyRe
    };
  }

  /**
   * Returns a an array of matched results or null
   * @function curlyRe
   * @param {string} str
   * @returns {Array} An Array containing the matched results or null
   */
  function curlyRe( str ) {
    return str.match(re);
  }

  /**
   * Bind object is responsible for binding data to the templates
   * @constructor Bind
   * @param {string} view - DOM scope.
   * @param {object} data - Model data to be bound to view.
   * @param {bool} debug - Debug mode. Default is false.
   */
  function Bind( view, data, debug ) {
    this.root = false;
    this.nodes = {};
    this.token = 0;

    this.run( view, data, debug );
  }

  /**
   * Updates the Bind object with new data
   * @method update
   * @memberof Bind
   * @param {string} view - DOM scope.
   * @param {object} data - Model data to be bound to view.
   * @param {bool} debug - Debug mode value.
   */
  Bind.prototype.update = function( view, data, debug ) {
    this.run( view, data, debug );
  };

  /**
   * Perform a regex search on a elements textNode.
   * If it matches the {{ }} pattern then add to our node obj.
   * @method node_builder
   * @memberof Bind
   * @param {object} el - A DOM element that does NOT have children.
   * @param {number} x - Index location for list el.childNodes.
   */
  Bind.prototype.node_builder = function( el, x ) {
    var txtNode = el.childNodes[x].nodeValue;

    if ( txtNode ) {
      if ( curlyRe( txtNode ) ) {
        this.nodes[this.token] = {
          el: el,
          binding: curlyRe( txtNode ),
          origin: txtNode,
          key: x
        };
        ++this.token;
      }
    }
  };

  /**
   * Recursively search a element until it has no more children.
   * @method traverse_DOM
   * @memberof Bind
   * @param {object} el - a DOM element that may or maynot have children.
   */
  Bind.prototype.traverse_DOM = function( el ){
    for ( var x = 0; x < el.childNodes.length; x++ ) {
      if ( el.childNodes[x].nodeName === '#text' ) {
        this.node_builder( el, x );
      }
    }

    for ( var i = 0; i < el.childElementCount; i++ ) {
      // Do not inspect elements inside of the safe array for bindings
      if ( safe.indexOf( el.children[i].nodeName ) === -1 ) {
        this.traverse_DOM( el.children[i] );
      }
    }
  };

  /**
   * Binds the data object to its coresponding DOM element
   * and replaces the {{ key }} with the data model value.
   * @method bind_data
   * @memberof Bind
   * @param {object} data - Model data to be bound to view.
   */
  Bind.prototype.bind_data = function( data ) {
    var node, k;

    for ( var key in this.nodes ) {
      node = this.nodes[key];
      k = node.key;

      node.el.childNodes[k].nodeValue = node.origin;
      for ( var x = 0; x < node.binding.length; x++ ) {
        node.el.childNodes[k].nodeValue = node.el.childNodes[k].nodeValue.replace(
          re2.exec( node.binding[x] )[0],
          data[re2.exec( node.binding[x] )[1]]
        );
      }
    }
  };

  /**
   * Core method for setting our instance variables and running
   * the the bind_data method.
   * @method run
   * @memberof Bind
   * @param {string} view - DOM scope.
   * @param {object} data - Model data to be bound to view.
   * @param {bool} debug - Debug mode value.
   */
  Bind.prototype.run = function( view, data, debug ) {
    var q, match, result;

    // Find the element view we want to work with
    if ( !this.root ) {
      q = document.querySelectorAll('[data-bind]');

      for ( var i = 0; i < q.length; i++ ) {
        if ( q[i].dataset.bind === view ) {
          this.root = q[i];
        }
      }
    }

    if ( !this.root ) {
      throw "undefined view: " + view;
    }

    if ( this.root && !this.nodes.length ) {
      this.traverse_DOM(this.root);
    }

    this.bind_data( data );

    if ( debug ) {
      console.log( 'Name: ', this.root.dataset.bind );
      console.log( 'Target: ', this.root);
      console.log( 'Nodes: ', this.nodes );
      console.log( 'Data: ', data );
    }
  };


  /**
   * Creates new Bind object or reuses one if it already
   * exists for a givien view
   * @constructor Bind_factory
   * @param {string} view - DOM scope.
   * @param {object} data - Model data to be bound to view.
   * @param {bool} debug - Debug mode. Default is false.
   */
  function Bind_factory( ) {
    // Collection of Bind objects
    var binds = {};

    /**
     * Creates a new Bind object or uses an existing one
     * @method build
     * @memberof Bind_factory
     * @param {string} view - DOM scope.
     * @param {object} data - Model data to be bound to view.
     * @param {bool} debug - Debug mode value.
     */
    this.build = function( view, data, debug ) {

      var bind;

      if ( typeof debug !== true ) {
        debug = false;
      }

      if ( !binds[view] ) {
        bind = new Bind( view, data, debug );
        binds[view] = bind;
      } else {
        binds[view].update( view, data, debug );
      }
    };
  }

  var Factory = new Bind_factory();

  Burly.render = function( view, data, debug ) {
    Factory.build( view, data, debug );
  };

  global.Burly = Burly;

}( this ));
