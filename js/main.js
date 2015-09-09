(function () {
  'use strict';

  var iAPI = impress();

  //svgs
  var mySVGsToInject = document.querySelectorAll('img.svg');
  SVGInjector(mySVGsToInject);


  // if we're not in print mode start impress
  if ( !window.location.search.match(/print/) ) {
  	if (impress) {
  		impress().init();

      //on ESC go to overview
      document.addEventListener("keydown", function ( event ) {
        if ( event.keyCode == 27 ) {
            event.preventDefault();
            impress().goto("overview");
          }
      }, false);          
  	}

    if (typeof hljs != "undefined") {
         hljs.initHighlightingOnLoad();
    }

  } else {
    //show all substeps
  	var substeps = document.querySelectorAll(".substep");
  	Array.prototype.forEach.call(substeps,function(dom, index) {
  		dom.classList.add("active");
  	});

    //we use the preview class on print
    document.body.classList.add("preview");
  }

  //Add slide counters
  var forEach = Array.prototype.forEach
    , keys = Object.keys
    , steps = document.querySelectorAll("div.step")

  forEach.call(steps, function (dom, index) {
      if (dom.id !== 'overview') {
          var wrap = document.createElement("div");
          wrap.className = 'wrap';
          while (dom.firstChild) {
              wrap.appendChild(dom.firstChild);
          }
          dom.appendChild(wrap);
          var counter = wrap.appendChild(document.createElement('div'));
          counter.className = "counter";
          counter.innerHTML = (index + 1) + " / " + steps.length;
      }
  });

  if ("ontouchstart" in document.documentElement) { 
      document.querySelector(".hint").innerHTML = "<p>Tap on the left or right to navigate</p>";
  }

  if ( window.location.search.match(/print/) ) {
  	window.print();
  } 

}());