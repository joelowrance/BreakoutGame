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

class Score extends  GameObject {
    score: number = 0;

    draw(): void {
        this.ctx.font = "16px Arial";
        this.ctx.fillStyle = "#0095DD";
        this.ctx.fillText("Score: " + this.score, 8, 20);
    }

    increment() : void{
        this.score++;
    }
}



class Ball extends GameObject {

    ballRadius: number = 10;
    speed: number = 5;
    directionX: number = 5;
    directionY: number = -5;

    move(paddle: Paddle): void {
        let canvas = this.ctx.canvas;
        this.x += this.directionX;
        this.y += this.directionY;

        //todo: this should be in collision detection, not move
         if (this.x + this.directionX > canvas.width - this.ballRadius || this.x + this.directionX< this.ballRadius){
             this.directionX = -this.directionX;
         }

        if (this.y + this.directionY < this.ballRadius){
            this.directionY  = -this.directionY ;
        } else if (this.y + this.directionY  > canvas.height -this.ballRadius){
            if (this.x > paddle.x && this.x < paddle.x + paddle.width){
                this.paddleCollision(paddle);

            }
            else {
                this.directionY = 0;// -this.directionY;
                this.directionX = 0;
                //alert("GAME OVER") //TODO write in text on screen, read any key to reset
                //document.location.reload() //TODO this should be passed in.
            }
        }
    }

    paddleCollision(paddle: Paddle){
        let relativeIntersectX = this.x - paddle.x;
        //let angle =0

        if (relativeIntersectX < (paddle.width * .25)){
            this.directionX = -4;
            //angle = 60;
        }else if (relativeIntersectX < (paddle.width * .45)){
            this.directionX = -2;
            //angle = 45;
        }
        else if (relativeIntersectX > (paddle.width * .45) && relativeIntersectX < (paddle.width * .55)) {
            this.directionX = 0;
            //angle = 0;
        }else if (relativeIntersectX < (paddle.width * .75)){
            this.directionX = 2;
            //angle = 90;
        } else {
            this.directionX = 4
            //angle = 120;
        }

        this.directionY = -this.directionY;
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
    width: number = 100;
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
        if (this.x > 0){
            this.x -= this.movement;
        }
    }

    moveRight(): void {
        if (this.x < this.canvas.width - this.width){
            this.x += this.movement;
        }
    }

    collisionCheck(ball: Ball): void {

    }
}

class Brick extends GameObject{
    width: number = 75;
    height: number = 20;
    status: number = 1;

    constructor(x: number, y: number, ctx: CanvasRenderingContext2D, private color: string){
        super(x, y, ctx);
    }

    draw(): void {
        this.ctx.beginPath();
        this.ctx.rect(this.x, this.y, this.width, this.height);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.closePath();
    }
}

class BrickCollection {
    public bricks: Brick[][];
    public columns: number = 6;
    public rows: number = 6;
    private brickWidth: number = 75;
    private brickHeight: number = 20;
    private brickPadding: number = 5;
    private brickOffsetTop: number = 30;
    private brickOffsetLeft: number = 3;
    private colors:  Array<string>;


    constructor(private ctx: CanvasRenderingContext2D) {
        this.bricks = [];

        this.colors = [
            "#9400D3",
            "#4B0082",
            "#0000FF",
            "#00FF00",
            "#FFFF00",
            "#FF7F00",
            "#FF0000"]

        for(let c: number=0; c<this.columns; c++){
            this.bricks[c] = [];
            for(let r:number=0; r<this.rows; r++){
                this.bricks[c][r] = new Brick(0, 0, this.ctx, this.colors[r]);
            }
        }
    }

    draw() :void {
        for(let c: number = 0; c < this.columns; c++){
            for(let r: number = 0; r < this.rows; r++){
                let theBrick = (this.bricks[c][r] as Brick)
                if(theBrick.status == 1){
                    let brickX = (c*(this.brickWidth +this.brickPadding)) + this.brickOffsetLeft;
                    let brickY = (r*(this.brickHeight + this.brickPadding)) + this.brickOffsetTop;
                    theBrick.x = brickX;
                    theBrick.y = brickY;
                    theBrick.draw();
                }
            }
        }
    }

    collisionCheck(ball: Ball, score: Score) : void {
        for (let c: number = 0; c < this.columns; c++) {
            for (let r: number = 0; r < this.rows; r++) {
                let brick = (this.bricks[c][r] as Brick);
                //look at ball's x and y
                if (brick.status == 1){
                    if (ball.x > brick.x && ball.x < brick.x + this.brickWidth
                        && ball.y > brick.y && ball.y < brick.y + this.brickHeight){
                        ball.directionY = -ball.directionY;
                        brick.status = 0;
                        score.increment();
                    }
                }
            }
        }
    }
}

class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    rightPressed: boolean = false;
    leftPressed: boolean = false;
    paddle: Paddle;
    ball: Ball;
    brickCol: BrickCollection;
    score: Score;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");
        this.paddle = new Paddle(0, 0, this.ctx);
        this.ball = new Ball(canvas.width / 2, canvas.height -30, this.ctx);
        this.brickCol = new BrickCollection(this.ctx);
        this.score = new Score(0, 0, this.ctx);

        document.addEventListener("keydown", (e) => this.keyDownHandler(e));
        document.addEventListener("keyup", (e) => this.keyUpHandler(e));


        canvas.addEventListener("click", function(e){
            console.log(this.ball.x, this.ball.x);
        }.bind(this))

        this.draw()
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
        this.score.draw();
        this.ball.draw();
        this.paddle.draw();
        this.brickCol.collisionCheck(this.ball, this.score);
        this.brickCol.draw();
        this.ball.move(this.paddle);

        //Paddle
        if (this.leftPressed) {
            this.paddle.moveLeft();
        }

        if (this.rightPressed) {
           this.paddle.moveRight();
        }

        window.requestAnimationFrame(() => this.draw())
    }
}
