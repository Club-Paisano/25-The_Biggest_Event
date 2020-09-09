//jshint esversion: 6
/*
Author: Anthony Noel
-This page is a game using canvas and simple colission detection, where you click on the screen to create your square, and a computer will randomly select a location
on the canvas. If there is a collision, it ends the game. Your score it printed at the top left
Future Dev:
-Make the drawable area get smaller and smaller
-Change the class so that it's vars have getters/setters
//Make color a private var also for the square class
-Find a way to make it simpler to draw something without having to worry about it's center coordinates and its topleft corner
-Bugs: There are certain areas where the computer will never appear but the user can click on, due to the random algorithm,
When there is colission detected, it repaints both squares on top of eachother
-Refactor the code
*/
let score = 0;
const canvas = document.getElementById("myCan");
const ctx = canvas.getContext("2d");
//Set the dimensions of the canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;




//used to hold the info about the square shape drawn to canvas
class Square {
  constructor(width,height) {
    this.width = width;
    this.height = height;
  }

  calcBound() {
    return {
      topLeft: [this.x,this.y],
      topRight: [this.x+this.width,this.y],
      bottomRight:[this.x+this.width, this.y+this.height],
      bottomLeft:[this.x, this.y+this.height]
    };
  }

  drawCenter(centerX,centerY,color) {
    //Using the arguments as a center point, calculate the top left corner for the drawRect function
    let topLeftX = centerX-(this.width/2);
    let topLeftY = centerY-(this.height/2);
    this.x = topLeftX;
    this.y = topLeftY;
    //Use the draw function
    ctx.fillStyle = `${color}`;
    ctx.fillRect(topLeftX,topLeftY,this.width,this.height);
  }

  reDrawCenter(centerX,centerY,color) {
    //Delete the rectangle at the current location
    ctx.clearRect(this.x,this.y,this.width,this.height);
    //Draw a new rectangle centered at the coordinates given
    this.drawCenter(centerX,centerY,color);
    //Update the current x and y
    let topLeftX = centerX-(this.width/2);
    let topLeftY = centerY-(this.height/2);


  }
  getBounds() {
    return calcBound();
  }
  getCenterX() {
    return this.x+(this.width/2);
  }
  getCenterY() {
    return this.y+(this.height/2);
  }

}

const drawComputer = () => {
  //Get random numbers to rep the x,y coordinates, but keep them within an area
  //Of the screen where the square is completely visible

  //The x coodinate will use innerWidth of the window but no more than the full width - the width of the Square
  //I used 50 here because i know my square will be 50 width and height, but id be better not to hardcode it
  const randX = Math.floor(Math.random() * ((window.innerWidth-50) - (0+50) + 1) + (0+50));
  const randY = Math.floor(Math.random() * ((window.innerHeight-50) - (0+50) + 1) + (0+50));

  //Create a square
  const compSqr = new Square(50,50);
  //Draw the square to the canvas at the random coords
  compSqr.drawCenter(randX,randY, "ghostwhite");
  return compSqr;
};


const collisionDetection = (userSqr,compSqr) => {


  // collision detected!
  return (userSqr.x < compSqr.x + compSqr.width &&
   userSqr.x + userSqr.width > compSqr.x &&
   userSqr.y < compSqr.y + compSqr.height &&
   userSqr.y + userSqr.height > compSqr.y) ? true: false;


};

const drawScore = (color = "white") => {
  ctx.fillStyle = color;
  ctx.font = "12 Arial";
  ctx.fillText(`${score}`,25,25);
};

const drawCenterText = (text,color = "green") => {
  ctx.fillStyle = color;
  ctx.font = "40px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`${text}`,canvas.width/2,canvas.height/2);
};
const canClicked = (e) => {
    //Clear canvas
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //Draw a square centered at that location clicked
    const mySqr = new Square(50,50);

    mySqr.drawCenter(e.offsetX,e.offsetY, 'goldenrod');

    //Have the computer draw a square too
    let compSqr = drawComputer();

    //Detect collission detection
    if(collisionDetection(mySqr,compSqr)) {
      console.log("COLISSION DETECTED!");
      //Redraw the squares but in red
      mySqr.reDrawCenter(mySqr.getCenterX(),mySqr.getCenterY(),"firebrick");
      compSqr.reDrawCenter(mySqr.getCenterX(),mySqr.getCenterY(),"firebrick");
        //Change the score to red
      drawScore("firebrick");
      //Put a gameover text at the top
      drawCenterText("GAMEOVER",'firebrick');
      //Decouple the eventlistener
      canvas.removeEventListener("click", canClicked);
      //Return this so the score doesnt increase and isnt rerendered
      return;
    }

    //Update score
    score++;
    drawScore();
};

const initPage = () => {
    //Add a click event listener for the canvas
    canvas.addEventListener("click", canClicked);
    //Add the score to the canvas
    ctx.font = "12 Arial";
    ctx.fillText(`${score}`,25,25);
};

initPage();
