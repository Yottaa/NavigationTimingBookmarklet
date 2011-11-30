## Summary

This bookmarklet display the timing information that is available using the [W3C NavigationTiming API](http://www.w3.org/TR/navigation-timing/). 
I found this is a simpler way at seeing what the performance of a page is verse opening up the developer tools every time. This bookmarklet can be used in:<br/>
<ul><li>Latest Chrome Build</li>
<li>Firefox 7+</li>
<li>IE 9+ (Still need to test)</li></ul>

On mobile devices is can be used on:<br/>
<ul><li>Windows Phone 7.5 (Mango)</li>
<li>Andriod Ice cream sandwich</li></ul>

## Using It

I have written a blog about this and you can find the bookmarket instructions there. Why? I tried to get the code for the 
bookmarklet in the markdown but it strips the javascript. This makes sense 

[Blog article on the Bookmarklet](http://blog.yottaa.com/2011/11/standardizing-web-performance)

## Development Approach

I took a different a to building the bookmarklet. The only components to the booklet are jquery, ViewJS the new jquery templates and github. 
Before starting, I looked at a lot of bookmarklet but they all kind of sucked at their approach:

1.) Need to hand build the DOM
2.) Hosting the bookmarklet was a pain
3.) The way the javascript was compiled into a single file was not easy to maintain

So how does this bookmarklet's architecture resolve this problems?  

### Bookmarklet link

The bookmarklet link is very simple and calls out to an 

<code>
javascript:(function(){
	var w3cnavjs=document.createElement('SCRIPT');
	w3cnavjs.type='text/javascript';
	w3cnavjs.src='http://yottaa.github.com/NavigationTimingBookmarklet/bookmarklet.js';
	document.getElementsByTagName('head').appendChild(w3cnavjs);
})();
</code>

The code for the bookmarklet does only two things:

1.) Captures the W3C NavigationTiming Data
2.) Encodes it into a JSON String
3.) Creates an iframe and passes the data to the iframe in the hash

<code>
	$(document.body).append('<iframe id="w3c-nav-iframe" frameborder="0" height="660px" width="350px" scrolling="no" style="padding:0px;position:absolute;top:10px;right:10px;z-index:999999999" border="0"></iframe>');
	
	//Add the data as the hash. The iframe will pull the data.
	$('#w3c-nav-iframe').attr('src', "http://yottaa.github.com/NavigationTimingBookmarklet/w3c-nav-bookmarklet.html#"+JSON.stringify(data));
</code>

### Why use an iframe?

I tried several ways to do this. Ideally I would not need to use an iframe but because the template was loaded from a file on the server. 
I needed to yottaa.github.com domain, which caused a cross domain issue. Yes, I could have encoded the HTML into a string and had it 
embedded in the JavaScript but this would have increased the maintenance cost of the bookmarklet. If i wanted to change any UI or 
add a new feature changing the minified HTML string would have been worse than building the DOM structure by JavaScript alone.

### My iframe

The source of my iframe is "w3c-nav-bookmarklet.html" file which when loaded will run the following code:

<code>
	$(document).ready(function(){	
		//Need to pull off the "#" from the string
		var data = window.location.hash.substring(1);
		
		//if the string is empty that means there is no data and the browser does
		//not support the API.
		if (data != ""){
			data = JSON.parse(data);
			showW3cNavPerformanceData(data);
		}else{				
			$(document.body).html($("#w3c-nav-bookmarklet-notsupported").render({}));
		}
	});
</code>

### Why use github to host?

Even though i am the CTO of yottaa.com, deploying stuff into production easily required working with our operations team or setting up a separate 
server environment. The bookmarklet requires no server side other than serving files so, i figured using the Github pages would simplify everything.

Now when i want to release a new version i can just push the code into my gh-pages branch and the new version will automatically be deployed. 
No need for a separate deployment script for the website.

### Setting up github pages

This was fairly straightforward; i just followed the [instructions here](http://pages.github.com/). My branching strategy for the project is 
different from my other repositories. In this project, i use the "gh-pages" branch as the master/production branch and use the "master" branch 
as my development branch.


## TODO

Make the bookmarklet scroll to the top of the page.
Make the bookmarklet go aways smoothly. Now it leaves the iframe behind.

