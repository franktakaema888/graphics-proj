/*
READ ME:
Enhancements:
1. randomise picture on spacebar press
2. Move mouse to transition between average face and randomised picture 
*/
var imgs = [];
var avgImg;
var numOfImages = 30;
var randomFace = 0;
let lerpAmount;
//adding load counter 
var loadCounter = 0;

//////////////////////////////////////////////////////////
function preload() 
{   
    // preload() runs once
    //loading images 
    for(var i=0; i<numOfImages;i++)
    {
        var img = loadImage("assets/"+i+".jpg",imageloadSuccess);
        imgs.push(img);
    }
}
//adding imageloadSuccess call back function
function imageloadSuccess()
{
    loadCounter++;
}
//////////////////////////////////////////////////////////
function setup() 
{
    createCanvas(2*imgs[0].width, imgs[0].height); 
    pixelDensity(1);

    // Call averageFace() to pre-generate the final average face
  avgImg = averageFace(imgs);

  // Display the final average face
  image(avgImg, imgs[0].width, 0, imgs[0].width, imgs[0].height);
}
//////////////////////////////////////////////////////////

function draw() 
{
    background(125);
    // check if all images are loaded into gallery
    if(loadCounter != numOfImages)
    {
        console.log("not ready");
        return
    }
    // call average face function to get the new image and put it on the canvas
    var img = averageFace(imgs);
    image(img, imgs[0].width, 0, imgs[0].width, imgs[0].height); //right image
    console.log("All Images loaded, ready for average face!");
    noLoop();

    //creating random function to scroll through faces
    image(imgs[randomFace], 0, 0); // left image
    textSize(20);
    text(`Picture: ${randomFace}`, 10, 40);
    textSize(30);
    //instructions
    push();
    textStyle(BOLD);
    fill(255,255,0);
    text(`PRESS SPACEBAR OR MOVE MOUSE TO CHANGE PICTURE`,width/12, height);
    pop();
}

//implementing average face 
function averageFace(images)
{
    //loading all image pixels to process
    console.log("in Average face");
    for(var i=0; i<images.length; i++)
    {
        images[i].loadPixels();
    }

    var imgOut = createImage(images[0].width, 
                            images[0].height);
    imgOut.loadPixels();

    //looping through all the pixels in imgOut object
    for(var y=0; y<imgOut.height;y++)
    {
        for(var x=0; x<imgOut.width;x++)
        {
            //calculate pixel index for imgOut
            var pixelIndex = ((imgOut.width * y)+x) * 4;
            //initialise variable to store the sum of each RGB value averageFace
            var redSum = 0;
            var greenSum = 0;
            var blueSum = 0;
            //initialise variable to store the sum of each RGB value randomFace
            var r = 0;
            var g = 0;
            var b = 0;


            // getting each correspoding pixel in the image
            for(var i=0;i<images.length;i++)
            {   
                //pixel image for averageFace
                var img = images[i];
                redSum += img.pixels[pixelIndex+0];
                greenSum += img.pixels[pixelIndex+1];
                blueSum += img.pixels[pixelIndex+2];
                //pixel image for randomFace
                var randomImg = images[randomFace];
                r += randomImg.pixels[pixelIndex+0];
                g += randomImg.pixels[pixelIndex+1];
                b += randomImg.pixels[pixelIndex+2];
            }

            //setting the average value for each RGB in each pixel in imgOut object in the corresponding pixel 
            //lerp function is used to transition between average face and random image based on mouseX position
            imgOut.pixels[pixelIndex+0] = lerp(redSum/images.length,
                                                r/images.length,
                                                lerpAmount);
            imgOut.pixels[pixelIndex+1] = lerp(greenSum/images.length,
                                                g/images.length,
                                                lerpAmount);
            imgOut.pixels[pixelIndex+2] = lerp(blueSum/images.length,
                                                b/images.length,
                                                lerpAmount);
            
            imgOut.pixels[pixelIndex+3] = 255;
        }
    }
    imgOut.updatePixels();
    loop();
    return imgOut;
}


// press function to increment count to change picture
function keyPressed()
{
    if(keyCode == 32)
    {
        randomFace = round(random(0,30));
    }
    loop()
}
// the function to detect mouse movement and map mouseX values to be used in lerp as the 3rd argument
function mouseMoved() 
{
    lerpAmount = map(mouseX, width/4, width, 0, 1, true);
    loop();
}


