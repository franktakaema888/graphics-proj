// Image of Husky Creative commons from Wikipedia:
// https://en.wikipedia.org/wiki/Dog#/media/File:Siberian_Husky_pho.jpg
/*
READ ME
Enhancements:
1. Implemented check boxes to switch between filters individually
2. Added in an invert colour filter
*/
var imgIn;
let imageChange = 0;

let checkSepia;
let checkDarkCorners;
let checkRadialBlur;
let checkBorder;

let imageSepia;
let imageDarkCorners;
let imageRadialBlur;
let imageBorder;
let imageInvert;

var matrix = [
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64]
];
/////////////////////////////////////////////////////////////////
function preload() {
    imgIn = loadImage("assets/husky.jpg");
}
/////////////////////////////////////////////////////////////////
function setup() {
    createCanvas((imgIn.width * 2), imgIn.height);

    checkSepia = createCheckbox('sepia', false);
    checkSepia.changed(myCheckedEvent);

    checkDarkCorners = createCheckbox('dark corners', false);
    checkDarkCorners.changed(myCheckedEvent);

    checkRadialBlur = createCheckbox('radial blur', false);
    checkRadialBlur.changed(myCheckedEvent);

    checkBorder = createCheckbox('border', false);
    checkBorder.changed(myCheckedEvent);

    checkInvert = createCheckbox('Invert Colour', false);
    checkInvert.changed(myCheckedEvent);
}
/////////////////////////////////////////////////////////////////
function draw() {
    background(125);
    image(imgIn, 0, 0);
    image(earlyBirdFilter(imgIn), imgIn.width, 0);
    noLoop();

    //instructions
    push();
    textSize(20);
    textStyle(BOLD);
    fill(255,255,0);
    text(`PRESS ARROW UP OR DOWN TO CHANGE THE FILTER`,width/3, height);
    pop();
}
/////////////////////////////////////////////////////////////////
function mousePressed(){
  // loop();
}

/////////////////////////////////////////////////////////////////
function earlyBirdFilter(img){
  var resultImg = createImage(imgIn.width, imgIn.height);

  //make a copy of imgIn to resultImg
  resultImg.copy(imgIn,0,0,imgIn.width, imgIn.height,0,0,imgIn.width, imgIn.height);
  // conditions set based on the up and down arrow to switch between filters
  if(imageChange == 0)
  {
    resultImg = sepiaFilter(resultImg);
    resultImg = darkCorners(resultImg);
    resultImg = radialBlurFilter(resultImg);
  }
  if(imageChange == 1 || imageSepia == true)
  {
    resultImg = sepiaFilter(resultImg);
  }
  if(imageChange == 2 || imageDarkCorners == true)
  {
    resultImg = darkCorners(resultImg);
  }
  if(imageChange == 3 || imageRadialBlur == true)
  {
    resultImg = radialBlurFilter(resultImg);;
  }
  if(imageChange == 4 || imageBorder == true)
  {
    resultImg = borderFilter(resultImg);
  }
  if(imageChange == 5 || imageInvert == true)
  {
    resultImg = invertColorsFilter(resultImg);
  }
  console.log(imageChange);
  return resultImg;
}

function myCheckedEvent() {
  if (checkSepia.checked()) 
  {
    imageSepia = true;
  } else {
    imageSepia = false;
  } 

  if(checkDarkCorners.checked()) 
  {
    imageDarkCorners = true;
  } else {
    imageDarkCorners = false;
  }

  if(checkRadialBlur.checked()) 
  {
    imageRadialBlur = true;
  } else {
    imageRadialBlur = false;
  }

  if(checkBorder.checked()) 
  {
    imageBorder = true;
  } else {
    imageBorder = false;
  }

  if(checkInvert.checked()) 
  {
    imageInvert = true;
  } else {
    imageInvert = false;
  }
  loop();
}

function keyPressed()
{
  if(keyCode == 38 && imageChange < 5)
  {
    imageChange ++
  }
  if(keyCode == 40 && imageChange > 0)
  {
    imageChange --;
  }
  loop();
}

function sepiaFilter(img)
{
  img.loadPixels();
  for(var x=0; x<img.width;x++)
  {
    for(var y=0; y<img.height;y++)
    {
      // get each pixel RGB value
      var pixelIndex = (( img.width * y) + x) * 4;
      var oldRed = img.pixels[pixelIndex+0];
      var oldGreen = img.pixels[pixelIndex+1];
      var oldBlue = img.pixels[pixelIndex+2];

      //compute new RGB value
      var newRed = (oldRed * 0.393) + (oldGreen * 0.769) + (oldBlue * 0.189);
      var newGreen = (oldRed * 0.349) + (oldGreen * 0.686) + (oldBlue * 0.168);
      var newBlue = (oldRed * 0.272) + (oldGreen * 0.534) + (oldBlue * 0.131);

      //constrain the RGB value from 0 to 255
      newRed = constrain(newRed,0,255);
      newGreen = constrain(newGreen,0,255);
      newBlue = constrain(newBlue,0,255);

      //update each pixel with new RGB value
      img.pixels[pixelIndex + 0] = newRed;
      img.pixels[pixelIndex + 1] = newGreen;
      img.pixels[pixelIndex + 2] = newBlue;
      img.pixels[pixelIndex + 3] = 255;
    }
  }
  img.updatePixels();
  return img;
}

function darkCorners(img)
{
  img.loadPixels();
  var midX = img.width/2;
  var midY = img.height/2;
  //calculate the distance from (0,0) to center - the max distance
  var maxDist = abs(dist(midX,midY,0,0));
  var dynLum = 1;
  for(var x=0; x<img.width; x++)
  {
    for(var y=0; y<img.height; y++)
    {
      //calculate the pixel distance away from the center
      var d = abs(dist(midX,midY,x,y));

      if(d>300) //only process pixels that are 300 distance away from the center
      {
        var pixelIndex = ((img.width * y) + x) * 4;
        var oldRed = img.pixels[pixelIndex+0];
        var oldGreen = img.pixels[pixelIndex+1];
        var oldBlue = img.pixels[pixelIndex+2];

        if(d <= 450) //for 300 to 450 distance
        {
          dynLum = map(d,300,450,1,0.4);
        }else{//for above 450 to maxDist
          dynLum = map(d,450,maxDist,0.4,0);
        }

        //constrain dynLum value 0 to 1
        dynLum = constrain(dynLum,0,1);
        //update each pixel with new RGB value 
        img.pixels[pixelIndex+0] = oldRed * dynLum;
        img.pixels[pixelIndex+1] = oldGreen * dynLum;
        img.pixels[pixelIndex+2] = oldBlue * dynLum;
      }
    }
  }
  img.updatePixels();
  return img;
}

function convolution(x, y, matrix, matrixSize, img)
{
  var totalRed = 0.0;
  var totalGreen = 0.0;
  var totalBlue = 0.0;
  var offset = floor(matrixSize / 2);

  // covolution matrix loop 
  for(var i = 0; i < matrixSize; i++)
  {
    for(var j = 0; j < matrixSize; j++)
    {
      // get pixel loc within convolution matrix
      var xloc = x + j - offset;
      var yloc = y + j - offset;
      var index = (xloc + img.width * yloc) * 4;
      // ensure we don't address a pixel that doesn't exist 
      index = constrain(index, 0 ,img.pixels.length - 1);

      // multiply all values with the mask and sum up the values 
      totalRed += img.pixels[index + 0] * matrix[i][j];
      totalGreen += img.pixels[index + 1] * matrix[i][j];
      totalBlue += img.pixels[index + 2] * matrix[i][j];
    }
  }
  // return the new color as an array
  return [totalRed, totalGreen, totalBlue];
}

function radialBlurFilter(img)
{
  img.loadPixels();

  for(var x = 0; x<img.width; x++)
  {
    for(var y = 0; y<img.height; y++)
    {
      var pixelIndex = ((img.width * y) + x) * 4;
      var oldRed = img.pixels[pixelIndex+0];
      var oldGreen = img.pixels[pixelIndex+1];
      var oldBlue = img.pixels[pixelIndex+2];

      //calculate the convolution value for that pixel
      var c = convolution(x,y,matrix,matrix.length,img);

      var mouseDist = abs(dist(x,y,mouseX,mouseY));
      var dynBlur = map(mouseDist, 100,300,0,1);
      dynBlur = constrain(dynBlur,0,1);

      //calculate new RGB value
      var newRed = c[0]*dynBlur + oldRed *(1-dynBlur);
      var newGreen = c[1]*dynBlur + oldGreen *(1-dynBlur);
      var newBlue = c[2]*dynBlur + oldBlue *(1-dynBlur);

      //update each pixel with new RGB value
      img.pixels[pixelIndex+0] = newRed;
      img.pixels[pixelIndex+1] = newGreen;
      img.pixels[pixelIndex+2] = newBlue;
    }
  }

  img.updatePixels();
  return img;
}

function borderFilter(img) 
{
  //Draw the img onto the buffer
  var tempImg = createGraphics(img.width,img.height);
  tempImg.image(img,0,0);

  //Draw a big, fat white rectangle with rounded corners around the image
  tempImg.noFill();
  tempImg.stroke(255);
  tempImg.strokeWeight(20);
  tempImg.rect(0,0,img.width,img.height,50);

  //Draw another rectangle now, without rounded corners, in order to get rid of the little triangles so you end up with the image below. at the end of the function.
  tempImg.noFill();
  tempImg.strokeWeight(20);
  tempImg.stroke(255);
  tempImg.rect(0,0,img.width, img.height);

  return tempImg;
}

function invertColorsFilter(img) {
  img.loadPixels();

  for (var x = 0; x < img.width; x++) {
    for (var y = 0; y < img.height; y++) {
      var pixelIndex = ((img.width * y) + x) * 4;

      var oldRed = img.pixels[pixelIndex + 0];
      var oldGreen = img.pixels[pixelIndex + 1];
      var oldBlue = img.pixels[pixelIndex + 2];

      var newRed = 255 - oldRed;
      var newGreen = 255 - oldGreen;
      var newBlue = 255 - oldBlue;

      img.pixels[pixelIndex + 0] = newRed;
      img.pixels[pixelIndex + 1] = newGreen;
      img.pixels[pixelIndex + 2] = newBlue;
    }
  }

  img.updatePixels();
  return img;
}
