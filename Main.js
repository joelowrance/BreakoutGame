"use strict";
/**
 * Created by joelo on 10/1/2017.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GameObject = (function () {
    function GameObject(x, y, ctx) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
    }
    return GameObject;
}());
var Ball = (function (_super) {
    __extends(Ball, _super);
    function Ball() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ballRadius = 10;
        _this.speed = 1;
        _this.directionX = 2;
        _this.directionY = -2;
        return _this;
    }
    Ball.prototype.move = function (paddle) {
        var canvas = this.ctx.canvas;
        this.x += this.directionX;
        this.y += this.directionY;
        if (this.x + this.directionX > canvas.width - this.ballRadius || this.x + this.directionX < this.ballRadius) {
            this.directionX = -this.directionX;
        }
        if (this.y + this.directionY < this.ballRadius) {
            this.directionY = -this.directionY;
        }
        else if (this.y + this.directionY > canvas.height - this.ballRadius) {
            if (this.x > paddle.x && this.x < paddle.x + paddle.width) {
                this.directionY = -this.directionY;
            }
            else {
                this.directionY = -this.directionY;
                //alert("GAME OVER") //TODO write in text on screen, read any key to reset
                //document.location.reload() //TODO this should be passed in.
            }
        }
    };
    Ball.prototype.draw = function () {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = "#009fDD";
        this.ctx.fill();
        this.ctx.closePath();
    };
    return Ball;
}(GameObject));
var Paddle = (function (_super) {
    __extends(Paddle, _super);
    function Paddle(x, y, ctx) {
        var _this = _super.call(this, x, y, ctx) || this;
        _this.height = 10;
        _this.width = 75;
        _this.movement = 7;
        _this.canvas = ctx.canvas;
        _this.x = (_this.canvas.width - _this.width) / 2;
        return _this;
    }
    Paddle.prototype.draw = function () {
        this.ctx.beginPath();
        this.ctx.rect(this.x, this.canvas.height - this.height, this.width, this.height);
        this.ctx.fillStyle = "#0095DD";
        this.ctx.fill();
        this.ctx.closePath();
    };
    Paddle.prototype.moveLeft = function () {
        this.x -= this.movement;
        //wall collision?
        if (this.x < 0) {
            this.x = 0;
        }
    };
    Paddle.prototype.moveRight = function () {
        this.x += this.movement;
        //wall collision?
        if (this.x + this.width > this.canvas.width) {
            this.x = this.canvas.width - this.width;
        }
    };
    return Paddle;
}(GameObject));
var Game = (function () {
    function Game(canvas) {
        //x: number; //over
        //y: number; //down
        //dx: number = 2;
        //dy: number = -2;
        //ballRadius: number= 10;
        //paddleHeight: number = 10;
        //paddleWidth: number = 75;
        this.paddleX = 0;
        this.rightPressed = false;
        this.leftPressed = false;
        this.brickRowCount = 3;
        this.brickColumnCount = 5;
        this.brickWidth = 75;
        this.brickHeigh = 20;
        this.brickPadding = 10;
        this.brickOffsetTop = 30;
        this.brickOffsetLeft = 30;
        this.bricks = []; //Array of what?
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        //this.x = canvas.width /2;
        //this.y = canvas.height -30;
        //this.paddleX = (canvas.width - this.paddleWidth) /2;
        this.paddle = new Paddle(0, 0, this.ctx);
        this.ball = new Ball(canvas.width / 2, canvas.height - 30, this.ctx);
        for (var c = 0; c < this.brickColumnCount; c++) {
            this.bricks[c] = [];
            for (var r = 0; r < this.brickRowCount; r++) {
                this.bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }
        setInterval(this.draw.bind(this), 10);
        document.addEventListener("keydown", this.keyDownHandler.bind(this), false);
        document.addEventListener("keyup", this.keyUpHandler.bind(this), false);
        canvas.addEventListener("mousemove", function (e) {
            console.log(e.layerX, e.layerY);
        });
    }
    Game.prototype.keyDownHandler = function (e) {
        if (e.keyCode == 39) {
            this.rightPressed = true;
        }
        else if (e.keyCode == 37) {
            this.leftPressed = true;
        }
    };
    Game.prototype.keyUpHandler = function (e) {
        if (e.keyCode == 39) {
            this.rightPressed = false;
        }
        else if (e.keyCode == 37) {
            this.leftPressed = false;
        }
    };
    Game.prototype.collisionDetection = function () {
        for (var c = 0; c < this.brickColumnCount; c++) {
            for (var r = 0; r < this.brickRowCount; r++) {
                var b = this.bricks[c][r];
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
    };
    Game.prototype.draw = function () {
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
    };
    Game.prototype.drawBricks = function () {
        for (var c = 0; c < this.brickColumnCount; c++) {
            for (var r = 0; r < this.brickRowCount; r++) {
                if (this.bricks[c][r].status == 1) {
                    var brickX = (c * (this.brickWidth + this.brickPadding)) + this.brickOffsetLeft;
                    var brickY = (r * (this.brickHeigh + this.brickPadding)) + this.brickOffsetTop;
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
    };
    return Game;
}());
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
//# sourceMappingURL=Main.js.map