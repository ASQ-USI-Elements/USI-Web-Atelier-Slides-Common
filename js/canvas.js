var ctx;
var activeCanvas = false;

if ((document.location.href).indexOf("?edit/") === -1) {

	function createCanvas(parent, width, height) {
		var canvas = {};
		canvas.node = document.createElement('canvas');
		canvas.context = canvas.node.getContext('2d');
		canvas.node.width = width || 100;
		canvas.node.height = height || 100;
		parent.appendChild(canvas.node);
		canvas.lastX = 0;
		canvas.lastY = 0;
		return canvas;
	}

	function init(container, width, height, fillColor) {
		var canvas = createCanvas(container, width, height);
		ctx = canvas.context;

		// define a custom fillCircle method
		ctx.fillCircle = function(x1, y1, x2, y2, lineThickness) {
			//this.fillStyle = fillColor;

			var steep = (Math.abs(y2 - y1) > Math.abs(x2 - x1));
			if (steep) {
				var x = x1;
				x1 = y1;
				y1 = x;

				var y = y2;
				y2 = x2;
				x2 = y;
			}
			if (x1 > x2) {
				var x = x1;
				x1 = x2;
				x2 = x;

				var y = y1;
				y1 = y2;
				y2 = y;
			}

			var dx = x2 - x1, dy = Math.abs(y2 - y1), error = 0, de = dy / dx, yStep = -1, y = y1;

			if (y1 < y2) {
				yStep = 1;
			}

			for (var x = x1; x < x2; x++) {
				if (steep) {
					this.fillRect(y, x, lineThickness, lineThickness);
				} else {
					this.fillRect(x, y, lineThickness, lineThickness);
				}

				error += de;
				if (error >= 0.5) {
					y += yStep;
					error -= 1.0;
				}
			}
		};

		ctx.clearTo = function() {
			ctx.clearRect(0, 0, width, height);
		};

		function rainbow(numOfSteps, step) {
		    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
		    // Adam Cole, 2011-Sept-14
		    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
		    var r, g, b;
		    var h = step / numOfSteps;
		    var i = ~~(h * 6);
		    var f = h * 6 - i;
		    var q = 1 - f;
		    switch(i % 6){
		        case 0: r = 1, g = f, b = 0; break;
		        case 1: r = q, g = 1, b = 0; break;
		        case 2: r = 0, g = 1, b = f; break;
		        case 3: r = 0, g = q, b = 1; break;
		        case 4: r = f, g = 0, b = 1; break;
		        case 5: r = 1, g = 0, b = q; break;
		    }
		    var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
		    return (c);
		}
		var color = 0;

		// bind mouse events
		canvas.node.onmousemove = function(e) {
			if (!canvas.isDrawing) {
				return;
			}
			mouseX = e.pageX - this.offsetLeft;
			mouseY = e.pageY - this.offsetTop;

			ctx.fillCircle(mouseX, mouseY, canvas.lastX, canvas.lastY, 6);

			canvas.lastX = mouseX;
			canvas.lastY = mouseY;

		};
		canvas.node.onmousedown = function(e) {
			canvas.isDrawing = true;
			canvas.lastX = e.pageX - this.offsetLeft;
			canvas.lastY = e.pageY - this.offsetTop;

			ctx.fillStyle = rainbow(50,color++);
			if (color>50) { color = 0; }
		};
		canvas.node.onmouseup = function(e) {
			canvas.isDrawing = false;
		};
		canvas.node.onmousewheel = function(e) {
			var delta = e.detail ? e.detail * (-120) : e.wheelDelta;
			ctx.fillStyle = "rgb(" + delta + ",0,0)";
		}
	}

	var _width = window.innerWidth;
	var _height = window.innerHeight;
	var container = document.getElementById('canvas');

	document.addEventListener("keyup", function(event) {
		if (event.keyCode === 67) {
			if (activeCanvas) {
				ctx.clearTo();
				container.style.display = "none";
				activeCanvas = !activeCanvas;
			} else {
				if (ctx === undefined) {
					init(container, _width, _height, '#ddd');
				}
				container.style.display = "block";
				activeCanvas = !activeCanvas;
			}
		}

	}, false);

}