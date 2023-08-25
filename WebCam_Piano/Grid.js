let monoSynth = new p5.MonoSynth;

class Grid {
  /////////////////////////////////
  constructor(_w, _h) 
  {
    this.gridWidth = _w;
    this.gridHeight = _h;
    this.noteSize = 40;
    this.notePos = [];
    this.noteState = [];

    // initalise grid structure and state
    for (var x=0;x<_w;x+=this.noteSize){
      var posColumn = [];
      var stateColumn = [];
      for (var y=0;y<_h;y+=this.noteSize){
        posColumn.push(createVector(x+this.noteSize/2,y+this.noteSize/2));
        stateColumn.push(0);
      }
      this.notePos.push(posColumn);
      this.noteState.push(stateColumn);
    }
  }
  /////////////////////////////////
  run(img) 
  {
    img.loadPixels();
    this.findActiveNotes(img);
    this.drawActiveNotes(img);
  }
  /////////////////////////////////
  // drawing shape and color 
  drawActiveNotes(img){
    // draw active notes
    fill(255);
    noStroke();
    for (var i=0;i<this.notePos.length;i++)
    {
      for (var j=0;j<this.notePos[i].length;j++)
      {
        var x = this.notePos[i][j].x;
        var y = this.notePos[i][j].y;
        if (this.noteState[i][j]>0) {
          var alpha = this.noteState[i][j] * 200;
          //changing the color of the circles
          var c1 = color(255,0,255,alpha);
          var c2 = color(255,239,0,alpha);
          var mix = lerpColor(c1, c2, map(i, 0, this.notePos.length, 0, 1));
          fill(mix);
          var s = this.noteState[i][j];
          //drawing the circle
          ellipse(x, y, this.noteSize*s, this.noteSize*s);

          userStartAudio();
          //parameters within monoSynth.play()
          let noteChange = "";
          let velocity = random();
          let time = 0;
          let dur = 1/5;
          //changes in note sound based on the position of circle activation
          if(x > 0 && x < this.gridWidth/2)
          {
            noteChange = "A6"
          }
          else
          {
            noteChange = "C4"
          }
          //playing the notes based on circle activation
          monoSynth.play(noteChange,velocity,time,dur);
        }
        
        this.noteState[i][j]-=0.05;
        this.noteState[i][j]=constrain(this.noteState[i][j],0,1);
      }
    }
  }
  /////////////////////////////////
  //detecting areas where the camera senses movement
  findActiveNotes(img)
  {
    for (var x = 0; x < img.width; x += 1) {
        for (var y = 0; y < img.height; y += 1) {
            var index = (x + (y * img.width)) * 4;
            var state = img.pixels[index + 0];
            if (state==0){ // if pixel is black (ie there is movement)
              // find which note to activate
              var screenX = map(x, 0, img.width, 0, this.gridWidth);
              var screenY = map(y, 0, img.height, 0, this.gridHeight);
              var i = int(screenX/this.noteSize);
              var j = int(screenY/this.noteSize);
              this.noteState[i][j] = 1;
            } 
        }
    }
  }
}
