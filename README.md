[![NPM](https://nodei.co/npm/burly.png?compact=true)](https://npmjs.org/package/burly)  
# burly.js 
js templating

## Usage
 ```html
 <h1 data-bind="greet">{{ greeting }}, {{ name }}!</h1>
 <script src="burly.js"></script>
 <script>
 	model = {
 		greeting: 'Hello',
 		name: 'Burly'
 	};
 	
   Burly.render('greet', model);
 </script>
 ```

