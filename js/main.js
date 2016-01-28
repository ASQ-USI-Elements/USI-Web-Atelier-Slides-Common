(function () {
  'use strict';

  function setupProgressbar(){
    if(! document.getElementById("progress")){
      var div = document.createElement("DIV");
      div.id = "progress";
      document.body.appendChild(div);
    }
    var progress = document.getElementById("progress");

    // cache order in a data attribute
    var nodes = document.querySelectorAll('.step:not(#overview):not([data-support="true"])');
    [].forEach.call(nodes, function(n, i){
      n.dataset.progressOrder = i+1;
    })
    var total = nodes.length;

    document.addEventListener('impress:stepenter', function(e) {
      if (e.target.id == 'overview'){
       progress.style.width = '0%'
       return;
      }

      if (e.target.dataset.support == 'true') return;

      var perc = parseInt(e.target.dataset.progressOrder)/total * 100;

      progress.style.width =  perc + '%';
     });
  }


  // if we're not in print mode start impress
  if ( !window.location.search.match(/print/) ) {


  //and inject svgs
  var mySVGsToInject = document.querySelectorAll('img.svg');
  SVGInjector(mySVGsToInject);


    if (impress) {
      try{
        impress().init();
        setupProgressbar();
      }catch(e){
        //no impress maybe we are in ASQ
      }

      //on ESC go to overview
      document.addEventListener("keydown", function ( event ) {
        if ( event.keyCode == 27 ) {
            event.preventDefault();
            try{
              impress().goto("overview");
            }catch(e){
              //no impress maybe we are in ASQ
            }
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
