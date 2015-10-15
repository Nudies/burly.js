# burly.js 
[![NPM](https://nodei.co/npm/burly.png?compact=true)](https://npmjs.org/package/burly)  
lightweight html templating

## Usage
 ```html
 <h1 data-bind="greet">{{ greeting }}, {{ name }}!</h1>
 <script src="burly.js"></script>
 <script>
 	data = {
 		greeting: 'Hello',
 		name: 'Burly'
 	};
 	
   Burly.render('greet', data);
 </script>
 ```

