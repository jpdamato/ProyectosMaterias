
/*
 * Initialize canvas
 */
var canvas;

// imgBuffer

var imBufferHeight ;
var imBufferWidth;
var imgBuffer;
var colorMode ; 

var box = null;

 // *-
var minfX = -1.5; // -1.5
var maxfX = 0.5;
	 
var minfY = -1.0;
var maxfY = 1.0;
	 
function focusOnSubmit()
{
  
}




function rgb(r,g,b)
{
	  var rgbX = [r,g,b];
	  return rgbX;
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
/*
 * Render a filled Rectangle, pixel by Pixel
 */

 function fractalMandelBrot(x,y)
 {
	 
	
     // z = z*z + z0
	
    var z0R = x/canvas.height  * (maxfX - minfX) + minfX;
	var z0I = y/canvas.height  * (maxfY - minfY) + minfY;
	
	var zR = 0.0;
	var zI = 0.0;
	
	var iter = 0;
	//verifico la convergencia
	while ( ( (zR*zR + zI*zI)  < 4) && (iter<255))
	 {
		 var zTemp;
	     zTemp = zR * zR - zI * zI + z0R  ; 
		 zI = 2 * zR * zI + z0I;
		 
		 zR = zTemp;
		 
		 iter++;
	 }
	 
	 return iter;
	 
	 
 }
 
 var changed = true;
 
 function drawFilledRectangle()
{
	var startTime  = (new Date).getTime();
   
    // Disallow redrawing while rendering
	for (var y = 0 ; y < imBufferHeight;y++)
	{
      for ( var x=0; x<imBufferHeight; ++x ) 
	  {
          
			var vFractal = fractalMandelBrot(x,y);
			
			imgBuffer.data[(y*imgBuffer.width+x)*4+0] = vFractal;
            imgBuffer.data[(y*imgBuffer.width+x)*4+1] = vFractal;
            imgBuffer.data[(y*imgBuffer.width+x)*4+2] = vFractal;
            imgBuffer.data[(y*imgBuffer.width+x)*4+3] = 255;
       }
	} 
	var endTime = (new Date).getTime();
	var timeDiff = endTime - startTime; //in ms
    // strip the ms
   // timeDiff /= 1000;
	console.log(timeDiff + " ms");
	
	changed = false;
	
	//document.getElementById('renderTime').innerText  = timeDiff + " ms";
	 
}

function reDraw()
{
        var ctx = canvas.getContext('2d');
        ctx.lineWidth = 1;

        // clear out old box first
        ctx.clearRect(0, 0, canvas.width, canvas.height);

		// draw a Rectangle , pixel by pixel
		if (changed){
			
			var minXP = Math.min(box[0],box[2]);
			var minYP = Math.min(box[1],box[3]);
			
			var maxXP = Math.abs(box[2]-box[0]) + minXP;
			var maxYP = Math.abs(box[2]-box[0]) + minYP;
			
			
			
			var tminR = (minXP/canvas.width) * (maxfX - minfX) + minfX; 
			var tmaxR = (maxXP/canvas.width) * (maxfX - minfX) + minfX;
            var tminI = (minYP/canvas.height) * (maxfY - minfY) + minfY; 
			var tmaxI = (maxYP/canvas.height) * (maxfY - minfY) + minfY;			
			
			minfX = tminR;
			maxfX = tmaxR;
			minfY = tminI;
			maxfY = tmaxI;
			
			
			drawFilledRectangle();
			
			box = null;
			changed = false;
		}
		
		ctx.putImageData(imgBuffer, 0, 0);
		
		
       if (box != null)
	   {
		   ctx.strokeStyle = '#FF3B03';
		   ctx.strokeRect(box[0], box[1], box[2]-box[0], box[3]-box[1]);
	   }
		//console.log("redraw");
		
		setTimeout(reDraw,30);

}

function main()
{
 canvas = document.getElementById('canvas1');
 canvas.width  = 800;
 canvas.height =800;
//init Buffer
 imBufferHeight =  document.documentElement.clientHeight ;
 imBufferWidth = document.documentElement.clientWidth ;
 colorMode = 0;
  var ctx = canvas.getContext('2d');
 imgBuffer = ctx.createImageData(imBufferHeight, imBufferHeight);

  box = [0,0, canvas.width, canvas.height];

    canvas.onmousedown = function(e)
    {
     
        box = [e.clientX, e.clientY, 0, 0];
    }
	
	 canvas.onmousemove = function(e)
    {
        if (box != null)
		{
		  if (e.button == 0)
		  {
            box[2] = e.clientX;
            box[3] = e.clientY;
		  }
		  
		}
    }
	
	 canvas.onmouseup = function(e)
    {
       console.log("recreate fractal");
	   box[2] = e.clientX;
       box[3] = e.clientY;
	   changed = true;
    }
  
  reDraw();
}

main();