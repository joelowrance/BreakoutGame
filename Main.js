"use strict";
/**
 * Created by joelo on 10/1/2017.
 */
var Game = (function () {
    function Game(canvas) {
        this.dx = 2;
        this.dy = -2;
        this.ballRadius = 10;
        this.paddleHeight = 10;
        this.paddleWidth = 75;
        this.paddleX = 0;
        this.rightPressed = false;
        this.leftPressed = false;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.x = canvas.width / 2;
        this.y = canvas.height - 30;
        this.paddleX = (canvas.width - this.paddleWidth) / 2;
        setInterval(this.draw.bind(this), 10);
        document.addEventListener("keydown", this.keyDownHandler.bind(this), false);
        document.addEventListener("keyup", this.keyUpHandler.bind(this), false);
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
    Game.prototype.draw = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBall();
        this.drawPaddle();
        //Ball
        this.x += this.dx;
        this.y += this.dy;
        if (this.x + this.dx > this.canvas.width - this.ballRadius || this.x + this.dx < this.ballRadius) {
            this.dx = -this.dx;
        }
        if (this.y + this.dy < this.ballRadius) {
            this.dy = -this.dy;
        }
        else if (this.y + this.dy > this.canvas.height - this.ballRadius) {
            if (this.x > this.paddleX && this.x < this.paddleX + this.paddleWidth) {
                this.dy = -this.dy;
            }
            else {
                alert("GAME OVER"); //TODO write in text on screen, read any key to reset
                document.location.reload(); //TODO this should be passed in.
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
    };
    Game.prototype.drawPaddle = function () {
        this.ctx.beginPath();
        this.ctx.rect(this.paddleX, this.canvas.height - this.paddleHeight, this.paddleWidth, this.paddleHeight);
        this.ctx.fillStyle = "#0095DD";
        this.ctx.fill();
        this.ctx.closePath();
    };
    Game.prototype.drawBall = function () {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = "#009fDD";
        this.ctx.fill();
        this.ctx.closePath();
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