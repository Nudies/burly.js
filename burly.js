/**
 *  ~burly.js lightweight html templating~
 *  @author: nudies@github.com
 *  @version: 1.0.3
 *  @license: MIT
 */

( function ( global ) {

  'use strict';
  var Burly = {};

  if (global.QUnit !== 'undefined') {
    global.Bind = Bind;
    global.Bind_factory = Bind_factory;
  }

  /**
   * Bind object is responsible for binding data to the templates
   * @constructor Bind
   * @param {string} scope - DOM scope.
   * @param {object} data - Model data to be bound to scope.
   * @param {bool} debug - Debug mode. Default is false.
   */
  function Bind( scope, data, debug ) {

    this.re = /\{\{\s*(\w+)\s*\}\}/g;
    this.re2 = /\{\{\s*(\w+)\s*\}\}/;
    this.safe = ['PRE', 'CODE'];
    this.root = false;
    this.nodes = {};
    this.token = 0;

    this.run( scope, data, debug );

  }

  /**
   * Updates the Bind object with new data
   * @method update
   * @memberof Bind
   * @param {string} scope - DOM scope.
   * @param {object} data - Model data to be bound to scope.
   * @param {bool} debug - Debug mode value.
   */
  Bind.prototype.update = function( scope, data, debug ) {

    this.run( scope, data, debug );

  };

  /**
   * Perform a regex search on a elements textNode.
   * If it matches the {{ }} pattern then add to our node obj.
   * @method regex_check
   * @memberof Bind
   * @param {object} el - A DOM element that does NOT have children.
   * @param {number} x - Index location for list el.childNodes.
   */
  Bind.prototype.regex_check = function( el, x ) {

    if ( el.childNodes[x].nodeValue ) {
      if ( el.childNodes[x].nodeValue.match(this.re) ) {
        this.nodes[this.token] = {
          el: el,
          binding: el.childNodes[x].nodeValue.match(this.re),
          origin: el.childNodes[x].nodeValue,
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
        this.regex_check( el, x );
      }
    }
    
    for ( var i = 0; i < el.childElementCount; i++ ) {
      // Do not inspect elements inside of the safe array for bindings
      if ( this.safe.indexOf(el.children[i].nodeName) === -1 ) {
        this.traverse_DOM( el.children[i] );
      }
    }

  };

  /**
   * Binds the data object to its coresponding DOM element
   * and replaces the {{ key }} with the data model value.
   * @method bind_data
   * @memberof Bind
   * @param {object} data - Model data to be bound to scope.
   */
  Bind.prototype.bind_data = function( data ) {
    var k; 

    for ( var key in this.nodes ) {
      k = this.nodes[key].key;  
      this.nodes[key].el.childNodes[k].nodeValue = this.nodes[key].origin;
      for ( var x = 0; x < this.nodes[key].binding.length; x++ ) {
        this.nodes[key].el.childNodes[k].nodeValue = this.nodes[key].el.childNodes[k].nodeValue.replace(
          this.re2.exec(this.nodes[key].binding[x])[0],
          data[this.re2.exec(this.nodes[key].binding[x])[1]]
        );
      }
    }

  };

  /**
   * Core method for setting our instance variables and running
   * the the data_bind method.
   * @method run
   * @memberof Bind
   * @param {string} scope - DOM scope.
   * @param {object} data - Model data to be bound to scope.
   * @param {bool} debug - Debug mode value.
   */
  Bind.prototype.run = function( scope, data, debug ) {

    var q, match, result;

    // Find the element scope we want to work with
    if ( !this.root ) {
      q = document.querySelectorAll('[data-bind]');

      for ( var i = 0; i < q.length; i++ ) {
        if ( q[i].dataset.bind === scope ) {
          this.root = q[i];
        }
      }
    }

    if ( !this.root ) {
      throw "undefined scope: " + scope;
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
   * Creates new bind object
   * @constructor Bind_factory
   * @param {string} scope - DOM scope.
   * @param {object} data - Model data to be bound to scope.
   * @param {bool} debug - Debug mode. Default is false.
   */
  function Bind_factory( ) {
    var binds;

    // Collection of binds
    binds = {};

    /**
     * Creates a new Bind object or uses an existing one
     * @method build
     * @memberof Bind_factory
     * @param {string} scope - DOM scope.
     * @param {object} data - Model data to be bound to scope.
     * @param {bool} debug - Debug mode value.
     */
    this.build = function( scope, data, debug ) {

      var bind;

      if ( typeof debug === 'undefined' ) {
        debug = false;
      }

      if ( !binds[scope] ) {
        bind = new Bind( scope, data, debug );
        binds[scope] = bind;
      }
      else {
        binds[scope].update( scope, data, debug );
      }

    };

  }

  var Factory = new Bind_factory();


  Burly.render = function( scope, data, debug ) {

    Factory.build( scope, data, debug );

  };

  global.Burly = Burly;

}( this ));
