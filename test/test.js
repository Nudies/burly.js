// Testing tools
function restoreState(el, body) {
  el.innerHTML = body;
}

// Contains tests for utility functions
QUnit.module("Util", function( hooks ) {
  QUnit.test("curlyRe()", function( assert ) {
    assert.equal(
      "function",
      typeof Util.curlyRe,
      "curlyRe is a function"
    );

    assert.ok(
        Util.curlyRe("{{ test }}") instanceof Array,
        "Returns an array when regex matches"
    );

    assert.ok(
        Util.curlyRe("{ test }}") === null,
        "Returns null when regex does not match"
    );
  });
});


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

    assert.equal(
      this.el.innerHTML,
      "Successful Bind",
      "Model data bound to a views {{ key }}"
    );

    assert.throws(
      function() {
        Burly.render( "badView", this.data )
      },
      "undefined view: badView",
      "Throws a 'undefined view' error"
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

    assert.equal(
      this.el.innerHTML,
      "Successful Bind",
      "Model data bound to a views {{ key }}"
    );

    assert.equal(
      this.el,
      this.bind.root,
      "Bind sets root to the view name"
    );

    assert.throws(
      function() {
        new Bind( "badView", this.data )
      },
      "undefined view: badView",
      "Throws a 'undefined view' error"
    );
  });

  QUnit.test("traverse_DOM()", function( assert ) {
    assert.ok(
      true,
      "placeholder"
    );
  });

  QUnit.test("node_builder()", function( assert ) {
    assert.ok(
      true,
      "placeholder"
    );
  });

  QUnit.test("bind_data()", function( assert ) {
    assert.ok(
      true,
      "placeholder"
    );
  });
});


// Contains test for the Bind_factory
QUnit.module("Bind_factory", function( hooks ) {
  // setUp before each test
  hooks.beforeEach(function() {
    this.el = document.getElementById("test-element");
    this.data = { testBind: "Successful Bind" };
  });

  // tearDown after each test
  hooks.afterEach(function() {
    restoreState(this.el, "{{ testBind }}");
  });

  QUnit.test("build()", function( assert ) {
    assert.ok(
      true,
      "placeholder"
    );
  });
});
