/**
 *  ~burly.js lightweight data binding~
 *  @author: nudies@github.com
 *  @version: 1.2.0
 *  @license: MIT
 */

( function ( global ) {
  'use strict';
  var Burly = {};
  var safe = ['PRE', 'CODE'];  // Element that won't be inspected
  var re = /\{\{\s*(\S+)\s*\}\}/g;
  var re2 = /\{\{\s*(\S+)\s*\}\}/;


  if ( global.QUnit !== 'undefined' ) {
    // Objects and functions we want to expose to
    // the global scope for testing.
    global.Bind = Bind;
    global.BindFactory = BindFactory;
    global.Util = {
      curlyRe: curlyRe,
      isFunction: isFunction,
      getValue: getValue
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
   * Checks if the given argument is a function 
   * @function isFunction
   * @param {*} str
   * @returns {boolean} 
   */
  function isFunction( val ) {
    return typeof val === 'function'; 
  }

  /**
  * Gets the value of an objects properties through dot notation, ex. 'foo.bar.baz'
  * @function getValue
  * @param {string} access - The property accessor for the data object. Supports dot notation.
  * @param {object} data - The object to get a value from
  * @returns {string} The value accessed in data
  */
  function getValue ( access, data ) {
    var value = data;
    var accessVals;
    var args = [];

    if ( access.indexOf(':') > -1 ) {
      access = access.split(':');
      args = access.splice(1);
      accessVals = access[0].split('.');
    }
    else {
      accessVals = access.split('.'); 
    }

    for ( var i = 0; i < accessVals.length; i++ ) {
      value = value[accessVals[i]];
    }

    if ( isFunction(value) ) { 
      return value.apply(global, args);
    }
    return value;
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
   * @method nodeBuilder
   * @memberof Bind
   * @param {object} el - A DOM element that does NOT have children.
   * @param {number} x - Index location for list el.childNodes.
   */
  Bind.prototype.nodeBuilder = function( el, x ) {
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
   * @method traverseDOM
   * @memberof Bind
   * @param {object} el - a DOM element that may or maynot have children.
   */
  Bind.prototype.traverseDOM = function( el ){
    for ( var x = 0; x < el.childNodes.length; x++ ) {
      if ( el.childNodes[x].nodeName === '#text' ) {
        this.nodeBuilder( el, x );
      }
    }

    for ( var i = 0; i < el.childElementCount; i++ ) {
      // Do not inspect elements inside of the safe array for bindings
      if ( safe.indexOf( el.children[i].nodeName ) === -1 ) {
        this.traverseDOM( el.children[i] );
      }
    }
  };

  /**
   * Binds the data object to its coresponding DOM element
   * and replaces the {{ key }} with the data model value.
   * @method bindData
   * @memberof Bind
   * @param {object} data - Model data to be bound to view.
   */
  Bind.prototype.bindData = function( data ) {
    var node, k;
    var matches;

    for ( var key in this.nodes ) {
      node = this.nodes[key];
      k = node.key;

      // If this is the second time binding a particular binding {{ foo }}, then
      // the current nodeValue will be 'foo'. We need to set it back to {{ foo }}
      // for pattern matching reasons.
      node.el.childNodes[k].nodeValue = node.origin;
      for ( var x = 0; x < node.binding.length; x++ ) {
        matches = re2.exec( node.binding[x] );
        node.el.childNodes[k].nodeValue = node.el.childNodes[k].nodeValue.replace(
          matches[0],                 // the matched text '{{ foo }}'
          getValue(matches[1], data)  // matches[1] is the capture group text 'foo'
        );
      }
    }
  };

  /**
   * Core method for setting our instance variables and running
   * the the bindData method.
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
      throw 'undefined view: ' + view;
    }

    if ( this.root && !this.nodes.length ) {
      this.traverseDOM(this.root);
    }

    this.bindData( data );

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
   * @constructor BindFactory
   * @param {string} view - DOM scope.
   * @param {object} data - Model data to be bound to view.
   * @param {bool} debug - Debug mode. Default is false.
   */
  function BindFactory( ) {
    // Collection of Bind objects
    var binds = {};

    /**
     * Creates a new Bind object or uses an existing one
     * @method build
     * @memberof BindFactory
     * @param {string} view - DOM scope.
     * @param {object} data - Model data to be bound to view.
     * @param {bool} debug - Debug mode value.
     */
    this.build = function( view, data, debug ) {
      var bind;

      if ( debug !== true ) {
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

  var Factory = new BindFactory();

  Burly.render = function( view, data, debug ) {
    Factory.build( view, data, debug );
  };

  global.Burly = Burly;

}( this ));
