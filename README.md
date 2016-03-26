[![NPM](https://nodei.co/npm/burly.png?compact=true)](https://npmjs.org/package/burly)  
# burly.js 
Lightweight data binding

## Usage
```html
<h1 data-bind="greet">{{ greeting }}, {{ name }}!</h1>
<script src="burly.js"></script>
<script>
var model = {
  greeting: 'Hello',
  name: 'Burly'
};
 	
Burly.render('greet', model);
</script>
```
 

Burly supports nested object access using dot notaion.
```html
<div data-bind="author-info">
  <p>{{ author.info.name }}</p>
  <p>{{ author.github }}</p>
</div>
<script src="burly.js"></script>
<script>
var model = {
  author: {
    info: {
      name: 'nudies',
      age: 'None of your business!'
    },
    github: 'https://github.com/Nudies'
  } 
};

// Pass true as the third argument for some debuging output in the console.
Burly.render('author-info', model, true);
</script>
```


It also supports function calls. Arguments can be passed using `:` notation, `{{ function:arg1:arg2 }}`.  
Never manually update that copyright date again!
```html
<footer data-bind="footer-data">
  <p>Copyright {{companyCR:Burly }}</p>
</footer>
<script src="burly.js"></script>
<script>
var model = {
  companyCR: function(company) {
    var d = new Date();
    return d.getFullYear() + " " + company;
  }
};

Burly.render('footer-data', model);
</script>
```
