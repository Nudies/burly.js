/**
 *  ~burly.js lightweight html templating~
 *  @author: nudies@github.com
 *  @version: 1.0.0
 *  @license: MIT
 *
 *  ~Usage~
 *
 *  <h1 data-bind="greet">{{ greeting }}, {{ name }}!</h1>
 *  <script src="burly.js"></script>
 *  <script>
 *    data = {
 *      greeting: 'Hello',
 *      name: 'Burly'
 *    };
 *
 *    Burly.render('greet', data);
 *  </script>
 *  
 *  
 */

( function ( global ) {

  'use strict';
  var Burly = {};

  if (typeof exports !== 'undefined') {
    exports.Burly = Burly;
    exports.Bind = Bind;
    exports.Bind_factory = Bind_factory;
  }
  
  /**
   * Bind object is responsible for binding data to the templates
   * @constructor Bind
   * @param {string} scope - DOM scope.
   * @param {object} data - Model data to be bound to scope.
   * @param {bool} debug - Debug mode. Default is false.
   */
  function Bind( scope, data, debug ) {

    var  self, re, re2;
    self = this;
    re = /\{\{\s*(\w+)\s*\}\}/g;
    re2 = /\{\{\s*(\w+)\s*\}\}/;

    /**
     * Updates the Bind object with new data
     * @method update
     * @memberof Bind
     * @param {string} scope - DOM scope.
     * @param {object} data - Model data to be bound to scope.
     * @param {bool} debug - Debug mode value.
     */
    self.update = function( scope, data, debug ) {

      self.run( scope, data, debug );

    };

    /**
     * Sets the Bind objects data
     * @method run
     * @memberof Bind
     * @param {string} scope - DOM scope.
     * @param {object} data - Model data to be bound to scope.
     * @param {bool} debug - Debug mode value.
     */
    self.run = function( scope, data, debug ) {

      var q, match, result;

      if (!self.el) {
        q = document.querySelectorAll('[data-bind]');

        for ( var i = 0; i < q.length; i++ ) {
          if (q[i].dataset.bind === scope) {
            self.el = q[i];
          }
        }
      }

      if (!self.el) {
        throw "undefined scope: " + scope;
      }

      if (!self.result) {
        self.result = self.el.innerHTML;
      }

      match = self.result.match(re);
      result = self.result;

      for ( var x = 0; x < match.length; x++ ) {
        result = result.replace( re2.exec(match[x])[0], data[re2.exec(match[x])[1]] );
      }

      self.el.innerHTML = result;

      if ( debug ) {
        console.log( 'Name: ', self.el.dataset.bind );
        console.log( 'Target: ', self.el);
        console.log( 'Nodes: ', this.result );
        console.log( 'Data: ', data );
      }

    };

    //Run on initialization
    self.run( scope, data, debug );

  }


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


  function render( scope, data, debug ) {

    Factory.build( scope, data, debug );

  }

  Burly.render = render;
  global.Burly = Burly;


}( this ));
