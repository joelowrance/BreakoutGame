/**
 * Created by joelo on 10/1/2017.
 */

abstract class GameObject{
    constructor(
        public x: number,
        public y: number,
        protected ctx: CanvasRenderingContext2D) {
    }
    abstract draw() : void;
}

class Ball extends GameObject {

    ballRadius: number = 10;
    speed: number = 1;
    directionX: number = 2;
    directionY: number = -2;


    move(paddle: Paddle): void {
        let canvas = this.ctx.canvas;
        this.x += this.directionX;
        this.y += this.directionY;

         if (this.x + this.directionX > canvas.width - this.ballRadius || this.x + this.directionX< this.ballRadius){
             this.directionX = -this.directionX;
         }

        if (this.y + this.directionY < this.ballRadius){
            this.directionY  = -this.directionY ;
        } else if (this.y + this.directionY  > canvas.height -this.ballRadius){
            if (this.x > paddle.x && this.x < paddle.x + paddle.width){
                this.directionY  = -this.directionY ;
            }
            else {
                this.directionY = -this.directionY;
                //alert("GAME OVER") //TODO write in text on screen, read any key to reset
                //document.location.reload() //TODO this should be passed in.
            }
        }
    }

    draw(): void {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = "#009fDD";
        this.ctx.fill();
        this.ctx.closePath()
    }
}

class Paddle extends GameObject{
    canvas: HTMLCanvasElement;
    height: number = 10;
    width: number = 75;
    movement: number = 7;

    constructor(x: number, y: number, ctx: CanvasRenderingContext2D) {
        super(x, y, ctx);
        this.canvas = ctx.canvas;
        this.x = (this.canvas.width - this.width) /2;
    }

    draw(): void {
        this.ctx.beginPath();
        this.ctx.rect(this.x, this.canvas.height-this.height, this.width, this.height);
        this.ctx.fillStyle = "#0095DD";
        this.ctx.fill();
        this.ctx.closePath();
    }

    moveLeft(): void {
        this.x -= this.movement;
        //wall collision?
        if (this.x < 0){
            this.x = 0;
        }
    }

    moveRight(): void {
        this.x += this.movement;

        //wall collision?
        if (this.x + this.width > this.canvas.width){
            this.x = this.canvas.width - this.width;
        }
    }
}




class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    //x: number; //over
    //y: number; //down
    //dx: number = 2;
    //dy: number = -2;
    //ballRadius: number= 10;
    //paddleHeight: number = 10;
    //paddleWidth: number = 75;
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
    paddle: Paddle;
    ball: Ball;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");
        //this.x = canvas.width /2;
        //this.y = canvas.height -30;
        //this.paddleX = (canvas.width - this.paddleWidth) /2;
        this.paddle = new Paddle(0, 0, this.ctx);
        this.ball = new Ball(canvas.width / 2, canvas.height -30, this.ctx);


        for(let c: number = 0; c < this.brickColumnCount; c++){
            this.bricks[c] = [];
            for(let r: number = 0; r < this.brickRowCount; r++){
                this.bricks[c][r] = {x: 0, y: 0, status: 1};
            }
        }


        setInterval(this.draw.bind(this), 10);
        document.addEventListener("keydown", this.keyDownHandler.bind(this), false);
        document.addEventListener("keyup", this.keyUpHandler.bind(this), false);
        canvas.addEventListener("mousemove", function(e){
            console.log(e.layerX, e.layerY);
        })
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

    collisionDetection() : void {
        for (let c: number = 0; c < this.brickColumnCount; c++) {
            for (let r: number = 0; r < this.brickRowCount; r++) {
                let b = this.bricks[c][r];
                //look at ball's x and y
                //if (b.status == 1){
                //    if (this.x > b.x && this.x < b.x + this.brickWidth && this.y > b.y && this.y < b.y + this.brickHeigh) {
                //       console.log(this.x, b.x);
                //        this.dy = -this.dy;
                //        b.status = 0;
                //    }
                //}
            }
        }
    }

    draw(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //this.drawBall();
        this.ball.draw();
        this.paddle.draw();
        this.collisionDetection();
        this.drawBricks();

        this.ball.move(this.paddle);

        //Ball
        // this.x += this.dx;
        // this.y += this.dy;
        //
        // if (this.x + this.dx > this.canvas.width - this.ballRadius || this.x + this.dx < this.ballRadius){
        //     this.dx = -this.dx;
        // }
        //
        // if (this.y + this.dy < this.ballRadius){
        //     this.dy = -this.dy;
        // } else if (this.y + this.dy > this.canvas.height -this.ballRadius){
        //     if (this.x > this.paddleX && this.x < this.paddleX + this.paddle.width){
        //         this.dy = -this.dy;
        //     }
        //     else {
        //         this.dy = -this.dy;
        //         //alert("GAME OVER") //TODO write in text on screen, read any key to reset
        //         //document.location.reload() //TODO this should be passed in.
        //     }
        // }

        //Paddle
        if (this.leftPressed) {
            //this.paddle.moveLeft();
            //console.log("left");
            this.paddle.x -= 7;
        }

        if (this.rightPressed) {
            //this.paddle.moveRight();
            //console.log("right");
            this.paddle.x += 7;

        }
    }


    drawBricks() : void {
        for(let c: number = 0; c < this.brickColumnCount; c++){
            for(let r: number = 0; r < this.brickRowCount; r++){
                if(this.bricks[c][r].status == 1){
                    let brickX = (c*(this.brickWidth+this.brickPadding)) + this.brickOffsetLeft;
                    let brickY = (r*(this.brickHeigh + this.brickPadding)) + this.brickOffsetTop;
                    this.bricks[c][r].x = brickX;
                    this.bricks[c][r].y = brickY;
                    this.ctx.beginPath();
                    this.ctx.rect(brickX, brickY, this.brickWidth, this.brickHeigh);
                    this.ctx.fillStyle = "#0095DD";
                    this.ctx.fill();
                    this.ctx.closePath();
                }
            }
        }
    }

    /*drawPaddle() : void {
        this.ctx.beginPath();
        this.ctx.rect(this.paddleX, this.canvas.height-this.paddleHeight, this.paddleWidth, this.paddleHeight);
        this.ctx.fillStyle = "#0095DD";
        this.ctx.fill();
        this.ctx.closePath();
    }*/

    // drawBall() : void {
    //     this.ctx.beginPath();
    //     this.ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2);
    //     this.ctx.fillStyle = "#009fDD";
    //     this.ctx.fill();
    //     this.ctx.closePath()
    // }

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
