// Testing tools
function restoreState(el, body) {
  el.innerHTML = body;
}


// Contains tests for the Burly singleton. 
// This is the api that end users will consume.
QUnit.module("Burly", function( hooks ) {

  // setUp before each test
  hooks.beforeEach(function() {
    this.el = document.getElementById("test-element"); 
    this.data = { testBind: "Successful Bind" };
  });

  // tearDown after each test
  hooks.afterEach(function() {
    restoreState(this.el, "{{ testBind }}");
  });

  QUnit.test("render()", function( assert ) {
    assert.equal(
      "function",
      typeof Burly.render,
      "Burly contains a render function"
    );

    assert.equal(
      this.el.innerHTML, 
      "{{ testBind }}", 
      "View contains a {{ key }} to bind model data to" 
    );

    Burly.render( "view", this.data );

    assert.equal( this.el.innerHTML, 
      "Successful Bind", 
      "Model data bound to a views {{ key }}" 
    );

    assert.throws( 
      function() {
        Burly.render( "badView", this.data )
      }, 
      "undefined scope: badView",
      "Throws a 'undefined scope:' error" 
    ); 
  });

});


// Contains test for the Bind constructor
QUnit.module("Bind", function( hooks ) {

  // setUp before each test
  hooks.beforeEach(function() {
    this.el = document.getElementById("test-element"); 
    this.data = { testBind: "Successful Bind" };
    this.bind = new Bind( "view", this.data );
  });

  // tearDown after each test
  hooks.afterEach(function() {
    restoreState(this.el, "{{ testBind }}");
  });

  QUnit.test("run()", function( assert ) {
    assert.equal( 
      "function", 
      typeof this.bind.run,
      "Bind contains a run function"
    );
  });

});

