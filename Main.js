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
var Score = (function (_super) {
    __extends(Score, _super);
    function Score() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.score = 0;
        return _this;
    }
    Score.prototype.draw = function () {
        this.ctx.font = "16px Arial";
        this.ctx.fillStyle = "#0095DD";
        this.ctx.fillText("Score: " + this.score, 8, 20);
    };
    Score.prototype.increment = function () {
        this.score++;
    };
    return Score;
}(GameObject));
var Ball = (function (_super) {
    __extends(Ball, _super);
    function Ball() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ballRadius = 10;
        _this.speed = 5;
        _this.directionX = 5;
        _this.directionY = -5;
        return _this;
    }
    Ball.prototype.move = function (paddle) {
        var canvas = this.ctx.canvas;
        this.x += this.directionX;
        this.y += this.directionY;
        //todo: this should be in collision detection, not move
        if (this.x + this.directionX > canvas.width - this.ballRadius || this.x + this.directionX < this.ballRadius) {
            this.directionX = -this.directionX;
        }
        if (this.y + this.directionY < this.ballRadius) {
            this.directionY = -this.directionY;
        }
        else if (this.y + this.directionY > canvas.height - this.ballRadius) {
            if (this.x > paddle.x && this.x < paddle.x + paddle.width) {
                this.paddleCollision(paddle);
            }
            else {
                this.directionY = 0; // -this.directionY;
                this.directionX = 0;
                //alert("GAME OVER") //TODO write in text on screen, read any key to reset
                //document.location.reload() //TODO this should be passed in.
            }
        }
    };
    Ball.prototype.paddleCollision = function (paddle) {
        var relativeIntersectX = this.x - paddle.x;
        //let angle =0
        if (relativeIntersectX < (paddle.width * .25)) {
            this.directionX = -4;
            //angle = 60;
        }
        else if (relativeIntersectX < (paddle.width * .45)) {
            this.directionX = -2;
            //angle = 45;
        }
        else if (relativeIntersectX > (paddle.width * .45) && relativeIntersectX < (paddle.width * .55)) {
            this.directionX = 0;
            //angle = 0;
        }
        else if (relativeIntersectX < (paddle.width * .75)) {
            this.directionX = 2;
            //angle = 90;
        }
        else {
            this.directionX = 4;
            //angle = 120;
        }
        this.directionY = -this.directionY;
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
        _this.width = 100;
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
        if (this.x > 0) {
            this.x -= this.movement;
        }
    };
    Paddle.prototype.moveRight = function () {
        if (this.x < this.canvas.width - this.width) {
            this.x += this.movement;
        }
    };
    Paddle.prototype.collisionCheck = function (ball) {
    };
    return Paddle;
}(GameObject));
var Brick = (function (_super) {
    __extends(Brick, _super);
    function Brick(x, y, ctx, color) {
        var _this = _super.call(this, x, y, ctx) || this;
        _this.color = color;
        _this.width = 75;
        _this.height = 20;
        _this.status = 1;
        return _this;
    }
    Brick.prototype.draw = function () {
        this.ctx.beginPath();
        this.ctx.rect(this.x, this.y, this.width, this.height);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.closePath();
    };
    return Brick;
}(GameObject));
var BrickCollection = (function () {
    function BrickCollection(ctx) {
        this.ctx = ctx;
        this.columns = 6;
        this.rows = 6;
        this.brickWidth = 75;
        this.brickHeight = 20;
        this.brickPadding = 5;
        this.brickOffsetTop = 30;
        this.brickOffsetLeft = 3;
        this.bricks = [];
        this.colors = [
            "#9400D3",
            "#4B0082",
            "#0000FF",
            "#00FF00",
            "#FFFF00",
            "#FF7F00",
            "#FF0000"
        ];
        for (var c = 0; c < this.columns; c++) {
            this.bricks[c] = [];
            for (var r = 0; r < this.rows; r++) {
                this.bricks[c][r] = new Brick(0, 0, this.ctx, this.colors[r]);
            }
        }
    }
    BrickCollection.prototype.draw = function () {
        for (var c = 0; c < this.columns; c++) {
            for (var r = 0; r < this.rows; r++) {
                var theBrick = this.bricks[c][r];
                if (theBrick.status == 1) {
                    var brickX = (c * (this.brickWidth + this.brickPadding)) + this.brickOffsetLeft;
                    var brickY = (r * (this.brickHeight + this.brickPadding)) + this.brickOffsetTop;
                    theBrick.x = brickX;
                    theBrick.y = brickY;
                    theBrick.draw();
                }
            }
        }
    };
    BrickCollection.prototype.collisionCheck = function (ball, score) {
        for (var c = 0; c < this.columns; c++) {
            for (var r = 0; r < this.rows; r++) {
                var brick = this.bricks[c][r];
                //look at ball's x and y
                if (brick.status == 1) {
                    if (ball.x > brick.x && ball.x < brick.x + this.brickWidth
                        && ball.y > brick.y && ball.y < brick.y + this.brickHeight) {
                        ball.directionY = -ball.directionY;
                        brick.status = 0;
                        score.increment();
                    }
                }
            }
        }
    };
    return BrickCollection;
}());
var Game = (function () {
    function Game(canvas) {
        var _this = this;
        this.rightPressed = false;
        this.leftPressed = false;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.paddle = new Paddle(0, 0, this.ctx);
        this.ball = new Ball(canvas.width / 2, canvas.height - 30, this.ctx);
        this.brickCol = new BrickCollection(this.ctx);
        this.score = new Score(0, 0, this.ctx);
        document.addEventListener("keydown", function (e) { return _this.keyDownHandler(e); });
        document.addEventListener("keyup", function (e) { return _this.keyUpHandler(e); });
        canvas.addEventListener("click", function (e) {
            console.log(this.ball.x, this.ball.x);
        }.bind(this));
        this.draw();
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
        var _this = this;
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
        window.requestAnimationFrame(function () { return _this.draw(); });
    };
    return Game;
}());
//# sourceMappingURL=Main.js.map