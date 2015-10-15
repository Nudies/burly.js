/**
 *  ~burly.js lightweight html templating~
 *	@author: nudies@github.com
 *	@version: 1.0.0
 *	@license: MIT
 *
 *  ~Usage~
 *
 *  <h1 data-bind="greet">{{ greeting }}, {{ name }}!</h1>
 *  <script src="burly.js"></script>
 *  <script>
 *		data = {
 *			greeting: 'Hello',
 *			name: 'Burly'
 *		};
 *
 *    Burly.render('greet', data);
 *	</script>
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

		var q, el, re, re2, match, result;

		q = document.querySelectorAll('[data-bind]');
		for ( var i = 0; i < q.length; i++ ) {
			if (q[i].dataset.bind === scope) {
				el = q[i];
			}
		}

		if (!el) {
			throw "undefined scope: " + scope;
		}

		re = /\{\{\s*(\w+)\s*\}\}/g;
		re2 = /\{\{\s*(\w+)\s*\}\}/;

		if (!this.result) {
			this.result = el.innerHTML;
		}

		match = this.result.match(re);
		result = this.result;

		for ( var x = 0; x < match.length; x++ ) {
			result = result.replace( re2.exec(match[x])[0], data[re2.exec(match[x])[1]] );
		}

		el.innerHTML = result;

		if ( debug ) {
			console.log( 'Name: ', el.dataset.bind );
			console.log( 'Target: ', el);
			console.log( 'Nodes: ', this.result );
			console.log( 'Data: ', data );
		}

	}

  function render( scope, data, debug ) {
		/**
		 * Creates new bind object
		 * @function render
		 * @param {string} scope - DOM scope.
		 * @param {object} data - Model data to be bound to scope.
		 * @param {bool} debug - Debug mode. Default is false.
		 *
		 */
		 // TODO: create factory for reusable objects

		if ( typeof debug === 'undefined' ) {
			debug = false;
		}

		if ( debug ) {
			new Bind( scope, data, debug );
		}
		else {
			new Bind( scope, data, debug );
		}

	}

	return {

		render: function( scope, data, debug ) {
			render( scope, data, debug );
		}

	};

}());
