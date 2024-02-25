class shoop {
  constructor(x, y, size, colour) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.a = 0;
    this.v = 0;
    this.g = 1;
    this.offGround = 0;
    this.animate = false;
    this.colour = colour;
    this.frame = 1;
    this.toLeft = false;
  }
  
  bobble() {
    if (keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW) || keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW)) {
      this.animate = true;
    }
    if (this.offGround != 0) {
      this.animate = true;
    }
    if (this.animate) {
      if (this.offGround === 0) {
        this.a = 2*this.size;
        this.animate = false;
        this.frame = 1;
      }
      else {
        this.a = -1/8*this.size;
      }
      this.v += this.a*3/2;
      this.y -= this.v;
      this.offGround += this.v;
      this.frame += 1;
      
      if (this.frame === 34) {
        footstepSound("default");
      }
    }
  }
  
  move() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= shoopSpeed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += shoopSpeed;
    }
    if (keyIsDown(UP_ARROW)) {
      this.y -= shoopSpeed;
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.y += shoopSpeed;
    }
  }
  
  draw() {
    push();
    
    if (keyIsPressed && keyCode === LEFT_ARROW) {
      this.toLeft = true;
    }
    else if (keyIsPressed && keyCode === RIGHT_ARROW) {
      this.toLeft = false;
    }
    
    if (this.toLeft) {
      translate(2*this.x, 0);
      scale(-1, 1);
    }
    
    // head
    this.head(this.x+33*this.size, this.y-3.5*this.size, this.size*1.2);
    
    //legs
    this.leg(this.x+9*this.size, this.y+16*this.size, this.size);
    push();
    translate(this.x+12*this.size, this.y+15*this.size);
    rotate(-15);
    this.leg(0, 0, this.size);
    pop();
    push();
    translate(this.x-16*this.size, this.y+15*this.size);
    rotate(15);
    this.leg(0, 0, this.size);
    pop();
    this.leg(this.x-12*this.size, this.y+16*this.size, this.size);
    
    // body
    this.shadedFluff(this.x-this.size, this.y+14*this.size, this.size, this.colour);
    this.shadedFluff(this.x-21*this.size, this.y, this.size, this.colour);
    this.shadedFluff(this.x-14*this.size, this.y-10*this.size, this.size, this.colour);
    this.shadedFluff(this.x-14*this.size, this.y+10*this.size, this.size, this.colour);
    this.shadedFluff(this.x+14*this.size, this.y+10*this.size, this.size, this.colour);
    this.shadedFluff(this.x, this.y+2*this.size, this.size*1.15, this.colour);
    this.shadedFluff(this.x+19*this.size, this.y+this.size, this.size, this.colour);
    this.shadedFluff(this.x, this.y-15*this.size, this.size, this.colour);
    this.shadedFluff(this.x+14*this.size, this.y-10*this.size, this.size, this.colour);
    
    //ear
    this.ear(this.x+22*this.size, this.y-16*this.size, this.size*1.2);
    
    pop();
  }
  
  shadedFluff(x, y, size, shoopColour) {
    noStroke();
    fill(shoopColour[0], shoopColour[1], shoopColour[2]);
    ellipse(x, y, 20*size, 20*size);
    fill(shoopColour[0]-20, shoopColour[1]-20, shoopColour[2]-20);
    arc(x, y, 20*size, 20*size, 50, 230, CHORD);
    fill(shoopColour[0], shoopColour[1], shoopColour[2]);
    bezier(x-cos(50)*10*size, y-sin(50)*10*size, 
           x-sin(320/3-30)*7*size, y+cos(320/3-30)*7*size, 
           x-sin(160/3-30)*7*size, y+cos(160/3-30)*7*size, 
           x+sin(40)*10*size, y+cos(40)*10*size);
  }
  
  head(x, y, size) {
    noStroke();
    fill(255, 240, 215);
    rect(x-40*size, y-13*size, 40*size, 20*this.size);
    ellipse(x, y, 20*this.size, 30*this.size);
    strokeWeight(size);
    stroke(100);
    fill(255);
    ellipse(x+3*size, y-4*size, 7*this.size, 7*this.size);
    fill(100);
    ellipse(x+4*size, y-4.5*size, this.size, this.size);
    line(x+3*size, y+7*size, x+5*size, y+8*size);
    line(x+2*size, y+11*size, x+4*size, y+7.5*size);
  }
  
  ear(x, y, size) {
    noStroke();
    fill(255, 240, 215);
    bezier(x, y, x-13*size, y+16*size, x+size, y+21*size, x+4*size, y+3*size);
    fill(225, 210, 185);
    arc(x-4*size, y+5.5*size, 16*size, 18*size, -15, 85, CHORD);
  }
  
  leg(x, y, size) {
    strokeWeight(size*2.5);
    stroke(70);
    noFill();
    switch (this.frame) {
      case 1:
        bezier(x, y, x+5*size, y+6*this.size, x+5*this.size, y+12*size, x, y+18*size);
      break
      case 2:
        bezier(x, y, x+3*size, y+6*this.size, x+2.5*this.size, y+12*size, x-2*this.size, y+17*size);
      break
      case 3:
        bezier(x, y, x+1*size, y+6*this.size, x, y+12*size, x-5*this.size, y+17*size);
      break
      case 4:
        bezier(x, y, x-1*size, y+5*this.size, x-2*this.size, y+11*size, x-7*this.size, y+16*size);
      break
      case 5:
        bezier(x, y, x-2.5*size, y+5*this.size, x-4*this.size, y+11*size, x-10*this.size, y+16*size);
      break
      case 6:
        bezier(x, y, x-4*size, y+5*this.size, x-6*this.size, y+11*size, x-12*size, y+15*size);
      break
      case 7:
        bezier(x, y, x-3*size, y+5*this.size, x-3*this.size, y+11*size, x-11*size, y+15*size);
      break
      case 8:
        bezier(x, y, x-2*size, y+5*this.size, x-1*this.size, y+11*size, x-11*size, y+14*size);
      break
      case 9:
        bezier(x, y, x-2*size, y+6*this.size, x+1*this.size, y+10*size, x-10*size, y+14*size);
      break
      case 10:
        bezier(x, y, x-1*size, y+6*this.size, x+3*this.size, y+10*size, x-10*size, y+13*size);
      break
      case 11:
        bezier(x, y, x, y+6*this.size, x+5*this.size, y+10*size, x-9*size, y+13*size);
      break
      case 12:
        bezier(x, y, x+2*size, y+6*this.size, x+6*this.size, y+10*size, x-7*size, y+13*size);
      break
      case 13:
        bezier(x, y, x+4*size, y+6*this.size, x+7*this.size, y+9*size, x-5*size, y+12*size);
      break
      case 14:
        bezier(x, y, x+6*size, y+6*this.size, x+8*this.size, y+9*size, x-3*size, y+12*size);
      break
      case 15:
        bezier(x, y, x+8*size, y+6*this.size, x+9.5*this.size, y+8*size, x-1.5*size, y+11*size);
      break
      case 16:
        bezier(x, y, x+11*size, y+6*this.size, x+11*this.size, y+8*size, x, y+11*size);
      break
      case 17:
        bezier(x, y, x+10*size, y+6*this.size, x+11*this.size, y+8*size, x, y+12*size);
      break
      case 18:
        bezier(x, y, x+9*size, y+6*this.size, x+10*this.size, y+8*size, x+this.size, y+12*size);
      break
      case 19:
        bezier(x, y, x+8*size, y+6*this.size, x+10*this.size, y+8*size, x+this.size, y+13*size);
      break
      case 20:
        bezier(x, y, x+7*size, y+6*this.size, x+9*this.size, y+8*size, x, y+14*size);
      break
      case 21:
        bezier(x, y, x+6*size, y+6*this.size, x+9*this.size, y+8*size, x+2*size, y+15*size);
      break
      case 22:
        bezier(x, y, x+6*size, y+6*this.size, x+9*this.size, y+8*size, x+4*size, y+15*size);
      break
      case 23:
        bezier(x, y, x+6*size, y+6*this.size, x+9*this.size, y+8*size, x+6*size, y+15*size);
      break
      case 24:
        bezier(x, y, x+7*size, y+6*this.size, x+10*this.size, y+9*size, x+8*size, y+16*size);
      break
      case 25:
        bezier(x, y, x+7*size, y+6*this.size, x+10*this.size, y+9*size, x+9.5*size, y+16*size);
      break
      case 26:
        bezier(x, y, x+7*size, y+6*this.size, x+10*this.size, y+9*size, x+11*size, y+16*size);
      break
      case 27:
        bezier(x, y, x+7*size, y+6*this.size, x+10*this.size, y+9*size, x+10*size, y+16*size);
      break
      case 28:
        bezier(x, y, x+7*size, y+6*this.size, x+10*this.size, y+9*size, x+9*size, y+16*size);
      break
      case 29:
        bezier(x, y, x+6*size, y+6*this.size, x+9*this.size, y+8*size, x+8*size, y+16*size);
      break
      case 30:
        bezier(x, y, x+6*size, y+6*this.size, x+9*this.size, y+8*size, x+7*size, y+16*size);
      break
      case 31:
        bezier(x, y, x+6*size, y+6*this.size, x+9*this.size, y+8*size, x+6*size, y+16*size);
      break
      case 32:
        bezier(x, y, x+6*size, y+6*this.size, x+8*this.size, y+9*size, x+4.5*size, y+16*size);
      break
      case 33:
        bezier(x, y, x+6*size, y+6*this.size, x+7*this.size, y+10*size, x+3*size, y+17*size);
      break
      case 34:
        bezier(x, y, x+5*size, y+6*this.size, x+7*this.size, y+10*size, x+2*size, y+17*size);
      break
      case 35:
        bezier(x, y, x+5*size, y+6*this.size, x+6*this.size, y+11*size, x+1*size, y+18*size);
    }
  }
  
}
