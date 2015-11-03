// Testing tools
function restoreState(el, body) {
  el.innerHTML = body;
}


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
  hooks.beforeEach(function() {
    this.el = document.getElementById("test-element");
    this.data = { testBind: "Successful Bind" };
  });

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
    this.bind.traverse_DOM(this.el); 
    assert.equal(
      this.el,
      this.bind.nodes[0].el,
      "traverse_DOM finds childnode #text and calls node_builder \
       which adds a object to the node object."
    );

    assert.equal(
      this.bind.token,
      1,
      "traverse_DOM finds childnode #text and calls node_builder \
       which increments token from 0 to 1."
    );

  });

  QUnit.test("node_builder()", function( assert ) {
    this.bind.node_builder(this.el, 0);
    assert.equal(
      this.bind.nodes[0].el,
      this.el,
      "node_builder sets the node object el to #test-element."
    );

    assert.equal(
      this.bind.nodes[0].binding[0],
      "{{ testBind }}",
      "node_builder sets the node object binding to an array containing \
       all the bind {{  }}, templates."
    );

    assert.equal(
      this.bind.nodes[0].origin,
      "{{ testBind }}",
      "node_builder sets the node object origin to {{ testBind }}."
    );
    console.dir(this.bind.nodes);

    assert.equal(
      this.bind.nodes[0].key,
      0,
      "node_builder sets the node object key to 0."
    );

    assert.equal(
      this.bind.token,
      1,
      "node_builder increments token from 0 to 1 after setting node obj."
    );
  });

  QUnit.test("bind_data()", function( assert ) {
    this.bind.bind_data(this.data);
    assert.equal(
      this.el.childNodes[0].nodeValue,
      "Successful Bind", 
      "bind_data binds model data to view template."
    );
  });
});


QUnit.module("Bind_factory", function( hooks ) {
  hooks.beforeEach(function() {
    this.el = document.getElementById("test-element");
    this.data = { testBind: "Successful Bind" };
  });

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
