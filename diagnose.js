

(function(){
	
	//
	// HELPER FUNCTIONS
	//
	// https://github.com/jquery/sizzle/blob/3136f48b90e3edc84cbaaa6f6f7734ef03775a07/sizzle.js#L708
	var doc = document, win = window;
	
    var contains = doc.documentElement.compareDocumentPosition ?
      function( a, b ) {
        return !!(a.compareDocumentPosition( b ) & 16);
      } :
      doc.documentElement.contains ?
      function( a, b ) {
        return a !== b && ( a.contains ? a.contains( b ) : false );
      } :
      function( a, b ) {
        while ( (b = b.parentNode) ) {
          if ( b === a ) {
            return true;
          }
        }
        return false;
      };

	var config = {
		log: true, 
		autoCapture: true,
		delayTime: 5000
	};
	
	var winH = 0;
	var output = {
		images: [],
		scripts: [],
		iframes: []
	};

    function saveViewport() {
      	winH = window.innerHeight|| document.documentElement.clientHeight||document.body.clientHeight;
    }

	// object = dom element
	// index = imgs array index
	function showIfVisible(track) {
 		saveViewport();
  		//When we could not get the offset using getBoundingClientRect (Firefox 2 or Opera 7/8), 
  		//we think it all are visible from safe considering poin

  		// We hacve to check that the current node is in the DOM
  		// It could be a detached() dom node
  		// http://bugs.jquery.com/ticket/4996	
  		if (!('getBoundingClientRect' in document.documentElement) || (contains(document.documentElement, track)
    		&& track.getBoundingClientRect().top < (winH + offset))) {
    		// To avoid onload loop calls
    		// removeAttribute on IE is not enough to prevent the event to fire
    		//img.onload = null;
    		//img.removeAttribute('onload');
    		// on IE < 8 we get an onerror event instead of an onload event		
    		//img.onerror = null;
   			// img.removeAttribute('onerror');	
    		return true; // img shown
  		} else {
    		return false; // img to be shown
  		}
	}

	function log(message) {
		if (config.log == true && console && console.log) {
			console.log('yo_AfterShocK: ' + message);
		}
	};

	function scripts(){
		var tag = "script";
		var tags = document.getElementsByTagName(tag),
	        currentTag;
	
		log('Find all ' + tag + ' tags in the document.');
      	// merge them with already self onload registered imgs
      	for (var imgIndex = 0, max = tags.length; imgIndex < max; imgIndex += 1) {
        	currentTag = tags[imgIndex];
        	var src = currentTag.getAttribute('src');
        	if (src) {
        		output.scripts[output.scripts.length] = { src : src };
				log('Found a ' + tag + ', src = ' + src + ' tag to handle with AfterShocK.');
        	}else{
        		output.scripts[output.scripts.length] = { body : currentTag.outerHTML };
				log('--Found a ' + tag);
				log(currentTag.outerHTML);
				log('--End Found a ' + tag);
				
        	}
      	}

	};
	
	function images(){
		var tag = "img";
		var tags = document.getElementsByTagName(tag),
	        currentTag;
	
		log('Find all ' + tag + ' tags in the document.');
      	// merge them with already self onload registered imgs
      	for (var imgIndex = 0, max = tags.length; imgIndex < max; imgIndex += 1) {
        	currentTag = tags[imgIndex];
        	var src = currentTag.getAttribute('src'), visible = showIfVisible(currentTag);
        	if (src) {
				log('Found a ' + tag + ', src = ' + src + ' tag to handle with AfterShocK, which is ' + (visible == true ? "visible" : "not visible"));
        	}
        	output.images[output.images.length] = { src: src, visible: visible };
        	//TODO - Tadd delay load information
      	}

	};
	
	function iframes(){
		var tag = "iframe";
		var tags = document.getElementsByTagName(tag),
	        currentTag;
	
		log('Find all ' + tag + ' tags in the document.');
      	// merge them with already self onload registered imgs
      	for (var imgIndex = 0, max = tags.length; imgIndex < max; imgIndex += 1) {
        	currentTag = tags[imgIndex];
        	var src = currentTag.getAttribute('src'), visible = showIfVisible(currentTag);
        	if (src) {
				log('Found a ' + tag + ', src = ' + src + ' tag to handle with AfterShocK, which is ' + (visible == true ? "visibles" : "not visible"));
        		output.iframes[output.iframes.length] = { src: src, visible: visible };
        	}
      	}

	};
	
	window.yo_diagnose = function(){
		scripts();
		images();
		iframes();
		yo_sendOutput();
	}
	
	window.yo_sendOutput = function(){
		var message = JSON.stringify(output);	
		log("-- Start Output");
		log(message);
		log("-- End Output");
		
		parent.postMessage(message, "*");
	}
	
	window.JSON = {};	
	JSON.stringify = JSON.stringify || function (obj) {
	    var t = typeof (obj);
	    if (t != "object" || obj === null) {
	        // simple data type
	        if (t == "string") obj = '"'+obj+'"';
	        return String(obj);
	    }
	    else {
	        // recurse array or object
	        var n, v, json = [], arr = (obj && obj.constructor == Array);
	        for (n in obj) {
	            v = obj[n]; t = typeof(v);
	            if (t == 'string') v = '"'+v+'"';
	            else if (t == 'object' && v !== null) v = JSON.stringify(v);
	            json.push((arr ? '' : '"' + n + '":') + String(v));
	        }
	        return (arr ? '[' : '{') + String(json) + (arr ? ']' : '}');
	    }
	};    
	
	function async_load(){
		//We need to look at all the code to see what we can optimize.
		if (config.autoCapture == true){
			setTimeout('yo_diagnose();', config.delayTime);
		}
	};

	// X-browser
	function addEvent(el, type, fn) {
		if (el.attachEvent) {
			el.attachEvent && el.attachEvent('on' + type, fn);
		} else {
			el.addEventListener(type, fn, false);
		}
	};

	// X-browser
	function removeEvent(el, type, fn) {
		if (el.detachEvent) {
			el.detachEvent && el.detachEvent('on' + type, fn);
		} else {
			el.removeEventListener(type, fn, false);
		}
	};

	addEvent(win, 'load', async_load);
    

})();









