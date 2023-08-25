/*
Enhancements:
1. Change Speed of the box turning and confetti speed using a slider
2. Change Colours of the Box using a slider
3. Use specularMaterial,shininess and ambientlight to make light reflect off the boxes based on mouse position
4. Created a Checkbox to toggle between normal material andspecularMaterial
*/

var distance;
var length;
var confLocs = [];
var confTheta = [];
var toggle;

function setup()
{
    createCanvas(900, 800, WEBGL);
	angleMode(DEGREES);
	
	// variables to control the position of the controllers
	var controlX = 10;
	var controlY = 10;

	// slider to control the speed of the confetti and box movements
	slider = createSlider(3, 18, 9);
	slider.position(controlX, controlY);
	slider.style('width', '100px');

	// slider to change the color of the boxes
	colorSlider = createSlider(0, 255, 100);
	colorSlider.position(controlX, controlY + 20);
	colorSlider.style('width', '100px');

	// checkbox to toggle between old and new material
	checkbox = createCheckbox('material switch', false);
  	checkbox.changed(myCheckedEvent);
	checkbox.position(controlX, controlY + 35);

    for(var i=0; i<200; i++)
    {
    	var a = random(-500,500);
		var b = random(-500,0);
		var c = random(-500,500);
		
		confLocs.push(createVector(a, b, c));
    	confTheta.push(random(0, 360));
    }
}

function draw()
{
    background(125);
    drawBoxes();
	normalMaterial();
    confetti();
    pivotCamera();
}

function myCheckedEvent() 
{
	if (checkbox.checked()) {
	  toggle = true;
	} else {
	  toggle = false;
	}
}

function pivotCamera()
{
	var xLoc = cos(frameCount) * height;
	var zLoc = sin(frameCount) * height;
	camera(xLoc,-600,zLoc,0,0,0,0,1,0);
}

function confetti()
{	
	noStroke();
	for(var i=0; i<200; i++)
    {

    	push();
    	translate(confLocs[i].x, confLocs[i].y, confLocs[i].z);
    	rotateX(confTheta[i]);
    	plane(15, 15);
		

		confLocs[i].y += 1;
		confTheta[i] += slider.value(); //implementation of slider change value

		if (confLocs[i].y>0)
		{
			confLocs[i].y = -800;
		}
    	pop();
    }
}


function drawBoxes()
{	
	//light source to display showcase the relfection of the material
	if(toggle == true)
	{
		normalMaterial();
	} else {
		shinyMaterial();
	}
	stroke(0);
	strokeWeight(2);
	//drawing of the boxes
	for(var x = -400; x < 400; x+=50)
	{
		for(var z = -400; z < 400; z +=50)
		{
			push();
			translate(x,0,z);
			distance = dist(0, 0, x, z) + frameCount * slider.value(); // slider value change for box speed
	    	length = map(sin(distance+frameCount), -1, 1, 100, 300);
			box(50,length,50);
			pop();
		}
	}
}

//function to create another material for the boxes
function shinyMaterial()
{
	ambientLight(70);
	let locX = mouseX - width / 2;
	let locY = mouseY - height / 2;
	pointLight(255, 255, 255, locX, locY, 50);
	// initiating material
	specularMaterial(colorSlider.value(),194,194);
	shininess(50);
}