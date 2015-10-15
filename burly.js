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
 */

var Burly = ( function (){
  'use strict';

  function Bind( scope, data, debug ) {
    /**
     * Bind object is responsible for binding data to the templates
     * @constructor Bind
     * @param {string} scope - DOM scope.
     * @param {object} data - Model data to be bound to scope.
     * @param {bool} debug - Debug mode. Default is false.
     */

    // init
    var  self, re, re2;

    self = this;
    re = /\{\{\s*(\w+)\s*\}\}/g;
    re2 = /\{\{\s*(\w+)\s*\}\}/;



    // Members
    self.update = function( scope, data, debug ){

      self.run( scope, data, debug );

    };

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

    self.run( scope, data, debug );

  }

  function Bind_factory( ) {
    /**
     * Creates new bind object
     * @function bind_factory
     * @param {string} scope - DOM scope.
     * @param {object} data - Model data to be bound to scope.
     * @param {bool} debug - Debug mode. Default is false.
     *
     */
     // TODO: create factory for reusable objects

    var binds, bind;

    // Collection of binds
    binds = {};

    this.build = function( scope, data, debug ) {
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

  return {

    render: function( scope, data, debug ) {
      Factory.build( scope, data, debug );
    }

  };

}());
