/**
 *  ~burly.js lightweight html templating~
 *  @author: nudies@github.com
 *  @version: 1.0.3
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

    self.root = false;
    self.nodes = {};
    self.token = 0;

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
     * Perform a regex search on a elements textNode.
     * If it matches the {{ }} pattern then add to our node obj.
     * @method regex_check
     * @memberof Bind
     * @param {object} el - A DOM element that does NOT have children.
     */
    self.regex_check = function( el, x ) {

      if ( el.childNodes[x].nodeValue ) {
        if ( el.childNodes[x].nodeValue.match(re) ) {
          self.nodes[self.token] = {
            el: el,
            binding: el.childNodes[x].nodeValue.match(re),
            origin: el.childNodes[x].nodeValue,
            key: x
          };
          ++self.token;
        }
      }

    };

    /**
     * Recursively search a element until it has no more children.
     * @method traverse_DOM
     * @memberof Bind
     * @param {object} el - a DOM element that may or maynot have children.
     */
    self.traverse_DOM = function( el ){

      for ( var x = 0; x < el.childNodes.length; x++ ) {
        if ( el.childNodes[x].nodeName === '#text' ) {
          self.regex_check( el, x );
        }
      }
      
      for ( var i = 0; i < el.childElementCount; i++ ) {
        self.traverse_DOM( el.children[i] );
      }

    };

    /**
     * Binds the data object to its coresponding DOM element
     * and replaces the {{ key }} with the data model value.
     * @method bind_data
     * @memberof Bind
     * @param {object} data - Model data to be bound to scope.
     */
    self.bind_data = function( data ) {
      var k; 

      for ( var key in self.nodes ) {
        k = self.nodes[key].key;  
        self.nodes[key].el.childNodes[k].nodeValue = self.nodes[key].origin;
        for ( var x = 0; x < self.nodes[key].binding.length; x++ ) {
          self.nodes[key].el.childNodes[k].nodeValue = self.nodes[key].el.childNodes[k].nodeValue.replace(
            re2.exec(self.nodes[key].binding[x])[0],
            data[re2.exec(self.nodes[key].binding[x])[1]]
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
    self.run = function( scope, data, debug ) {

      var q, match, result;

      // Find the element scope we want to work with
      if ( !self.root ) {
        q = document.querySelectorAll('[data-bind]');

        for ( var i = 0; i < q.length; i++ ) {
          if ( q[i].dataset.bind === scope ) {
            self.root = q[i];
          }
        }
      }

      if ( !self.root ) {
        throw "undefined scope: " + scope;
      }

      if ( self.root && !self.nodes.length ) {
        self.traverse_DOM(self.root);
      }

      self.bind_data( data );

      if ( debug ) {
        console.log( 'Name: ', self.root.dataset.bind );
        console.log( 'Target: ', self.root);
        console.log( 'Nodes: ', self.nodes );
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


  Burly.render = function( scope, data, debug ) {

    Factory.build( scope, data, debug );

  };

  global.Burly = Burly;

}( this ));
