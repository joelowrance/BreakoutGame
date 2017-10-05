/**
 * Created by joelo on 10/1/2017.
 */

class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    x: number;
    y: number;
    dx: number = 2;
    dy: number = -2;
    ballRadius: number= 10;
    paddleHeight: number = 10;
    paddleWidth: number = 75;
    paddleX: number = 0;
    rightPressed: boolean = false;
    leftPressed: boolean = false;
    brickRowCount: number = 3;
    brickColumnCount: number = 5;
    brickWidth: number = 75;
    brickHeigh: number = 20;
    brickPadding: number = 10;
    brickOffsetTop: number = 30;
    brickOffsetLeft: number = 30;
    bricks = []; //Array of what?

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");
        this.x = canvas.width /2;
        this.y = canvas.height -30;
        this.paddleX = (canvas.width - this.paddleWidth) /2;


        for(var c: number = 0; c < this.brickColumnCount; c++){
            this.bricks[c] = [];
            for(var r: number = 0; r < this.brickRowCount; r++){
                this.bricks[c][r] = {x: 0, y: 0};
            }
        }


        setInterval(this.draw.bind(this), 10);
        document.addEventListener("keydown", this.keyDownHandler.bind(this), false);
        document.addEventListener("keyup", this.keyUpHandler.bind(this), false);
    }

    keyDownHandler(e: KeyboardEvent) : void {
        if (e.keyCode == 39){
            this.rightPressed = true;
        }
        else if (e.keyCode == 37){
            this.leftPressed = true;
        }
    }

    keyUpHandler(e: KeyboardEvent) : void {
        if (e.keyCode == 39){
            this.rightPressed = false;
        }
        else if (e.keyCode == 37){
            this.leftPressed = false;
        }
    }


    draw(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBall();
        this.drawPaddle();
        this.drawBricks();

        //Ball
        this.x += this.dx;
        this.y += this.dy;

        if (this.x + this.dx > this.canvas.width - this.ballRadius || this.x + this.dx < this.ballRadius){
            this.dx = -this.dx;
        }

        if (this.y + this.dy < this.ballRadius){
            this.dy = -this.dy;
        } else if (this.y + this.dy > this.canvas.height -this.ballRadius){
            if (this.x > this.paddleX && this.x < this.paddleX + this.paddleWidth){
                this.dy = -this.dy;
            }
            else {
                this.dy = -this.dy;
                //alert("GAME OVER") //TODO write in text on screen, read any key to reset
                //document.location.reload() //TODO this should be passed in.
            }
        }

        console.log(this.leftPressed, this.rightPressed);

        //Paddle
        if (this.leftPressed) {
            console.log("left");
            this.paddleX -= 7;
        }

        if (this.rightPressed) {
            console.log("right");
            this.paddleX += 7;

        }

    }

    drawBricks() : void {
        for(let c: number = 0; c < this.brickColumnCount; c++){
            for(let r: number = 0; r < this.brickRowCount; r++){
                let brickX = (c*(this.brickWidth+this.brickPadding)) + this.brickOffsetLeft;
                let brickY = (r*(this.brickHeigh + this.brickPadding)) + this.brickOffsetTop;
                this.bricks[c][r].x = brickX;
                this.bricks[c][r].y = brickY;
                this.ctx.beginPath()
                this.ctx.rect(brickX, brickY, this.brickWidth, this.brickHeigh);
                this.ctx.fillStyle = "#0095DD";
                this.ctx.fill();
                this.ctx.closePath();
            }
        }
    }

    drawPaddle() : void {
        this.ctx.beginPath();
        this.ctx.rect(this.paddleX, this.canvas.height-this.paddleHeight, this.paddleWidth, this.paddleHeight);
        this.ctx.fillStyle = "#0095DD";
        this.ctx.fill();
        this.ctx.closePath();
    }

    drawBall() : void {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = "#009fDD";
        this.ctx.fill();
        this.ctx.closePath()
    }

}


/*
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width / 2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;


function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#009fDD";
    ctx.fill();
    ctx.closePath()
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    x += dx;
    y += dy;
}
setInterval(draw, 10);*/
