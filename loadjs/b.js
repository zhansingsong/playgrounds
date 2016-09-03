function loadjs(url, callback) {
	var head = document.getElementsByTagName('head')[0],
			node = document.createElement('script'),
			isLoaded = document.getElementById('loaded'),
			W3C = document.dispatchEvent;
			
	if(!isLoaded){
		node.setAttribute('type', 'text/javascript');
		node.setAttribute('id', 'loaded');
		node.setAttribute('src', url);

		node[W3C ? 'onload' : 'onreadystatechange'] = function(){
			if(node.ready){
				return;
			}
			if(W3C || /loaded|complete/i.test(node.readyState)) {
				node.ready = true;
		    if (callback) {
		        callback();
		    	}
			}
		}
		head.appendChild(node);
	} else {
		if(callback){
			callback();			
		}
	}
}

var test =  function(){
	a.say();
}
loadjs('a.js',test);