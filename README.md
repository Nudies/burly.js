# burly.js 
lightweight html templating

## Usage
 ```
 <h1 data-bind="greet">{{ greeting }} {{ name }}!</h1>
 <script src="burly.js"></script>
 <script>
 	data = {
 		greeting: 'Hello',
 		name: 'Burly'
 	};
 	
   Burly.render('greet', data);
 </script>
 ```
