// Testing tools
function restoreState(el, body) {
  el.innerHTML = body;
}


QUnit.module("Util", function( hooks ) {
  hooks.beforeEach(function() {
    this.data = {
      foo: {
        bar: {
          baz: "nested"
        }
      },
      quux: "not nested"
    };
  });

  QUnit.test("curlyRe()", function( assert ) {
    assert.ok(
      Util.curlyRe("{{ test }}") instanceof Array,
      "Returns an array when regex matches"
    );

    assert.ok(
      Util.curlyRe("{ test }}") === null,
      "Returns null when regex does not match"
    );
  });

  QUnit.test("isFunction()", function( assert ) {
    assert.ok(
      Util.isFunction(function(){}),
      "Passed in value is a function"
    );

    assert.notOk(
      Util.isFunction({}),
      "Passed in value is not a function"
    );
  });

  QUnit.test("getValue()", function( assert ) {
    assert.equal(
      "nested",
      Util.getValue("foo.bar.baz", this.data),
      "Returns value of object property (nested) using dot notation"
    );

    assert.equal(
      "not nested",
      Util.getValue("quux", this.data),
      "Returns value of object property (not nested)"
    );

    assert.equal(
      undefined,
      Util.getValue("bambi", this.data),
      "Returns undefined when object has no matching propeties"
    );
  });
});


// Contains tests for the Burly singleton.
// This is the api that end users will consume.
QUnit.module("Burly", function( hooks ) {
  hooks.beforeEach(function() {
    this.el = document.getElementById("test-element");
    this.data = { testBind: "Successful Bind" };
    this.el2 = document.getElementById("test-element2");
    this.data2 = {
                  testBind: {
                    nested: "Successful Bind"
                  }
                };
  });

  hooks.afterEach(function() {
    restoreState(this.el, "{{ testBind }}");
    restoreState(this.el2, "{{ testBind.nested }}");
  });

  QUnit.test("render()", function( assert ) {
    assert.equal(
      this.el.innerHTML,
      "{{ testBind }}",
      "View contains a {{ key }} to bind model data to"
    );

    Burly.render( "view", this.data );

    assert.equal(
      this.el.innerHTML,
      this.data.testBind,
      "Model data bound to a views {{ key }}"
    );

    Burly.render( "view2", this.data2 );

    assert.equal(
      this.el2.innerHTML,
      this.data2.testBind.nested,
      "Model data bound to a views {{ nested.key }}"
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


QUnit.module("Bind", function( hooks ) {
  hooks.beforeEach(function() {
    this.el = document.getElementById("test-element");
    this.data = { testBind: "Successful Bind" };
    this.bind = new Bind( "view", this.data );
  });

  hooks.afterEach(function() {
    restoreState(this.el, "{{ testBind }}");
  });

  QUnit.test("run()", function( assert ) {
    assert.equal(
      this.el.innerHTML,
      this.data.testBind,
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

  QUnit.test("traverseDOM()", function( assert ) {
    this.bind.traverseDOM(this.el);
    assert.equal(
      this.el,
      this.bind.nodes[0].el,
      "traverseDOM finds childnode #text and calls nodeBuilder \
       which adds a object to the node object."
    );

    assert.equal(
      this.bind.token,
      1,
      "traverseDOM finds childnode #text and calls nodeBuilder \
       which increments token from 0 to 1."
    );

  });

  QUnit.test("nodeBuilder()", function( assert ) {
    this.bind.nodeBuilder(this.el, 0);
    assert.equal(
      this.bind.nodes[0].el,
      this.el,
      "nodeBuilder sets the node object el to #test-element."
    );

    assert.equal(
      this.bind.nodes[0].binding[0],
      "{{ testBind }}",
      "nodeBuilder sets the node object binding to an array containing \
       all the bind {{  }}, templates."
    );

    assert.equal(
      this.bind.nodes[0].origin,
      "{{ testBind }}",
      "nodeBuilder sets the node object origin to {{ testBind }}."
    );

    assert.equal(
      this.bind.nodes[0].key,
      0,
      "nodeBuilder sets the node object key to 0."
    );

    assert.equal(
      this.bind.token,
      1,
      "nodeBuilder increments token from 0 to 1 after setting node obj."
    );
  });

  QUnit.test("bindData()", function( assert ) {
    this.bind.bindData(this.data);
    assert.equal(
      this.el.childNodes[0].nodeValue,
      this.data.testBind, 
      "bindData binds model data to view template."
    );
  });
});


QUnit.module("BindFactory", function( hooks ) {
  hooks.beforeEach(function() {
    this.el = document.getElementById("test-element");
    this.data = { testBind: "Successful Bind" };
    this.factory = new BindFactory()
  });

  hooks.afterEach(function() {
    restoreState(this.el, "{{ testBind }}");
  });

  QUnit.test("build()", function( assert ) {
    this.factory.build("view", this.data)
    assert.equal(
      this.el.innerHTML,
      this.data.testBind,
      "BuildFactory has build function"
    );
  });
});
