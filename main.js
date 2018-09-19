/* jshint esversion: 6 */
class Screen{
    constructor(){
        this.screen = document.getElementById('screen');
        this.dialog = document.getElementById('dialog');
        this.stop = false;
        this.dialog.style.display = 'none';
        this.refreshRate = 1000 * 0.25;
        this.width = 200;
        this.height = 200;
        this.xfood = 0;
        this.yfood = 0;
        this.build();
    }

    build(){
        this.screen.style.height = this.height+'px';
        this.screen.style.width = this.width+'px';
    }

    gameover(clockId){
        this.dialog.style.display = 'block';
        clearInterval(clockId);
        this.stop = true;
    }
}

class Food{
    constructor(){
        this.x = '';
        this.y = '';
        this.create();
    }

    create(){
        let screen = document.getElementById('screen');

        this.x = random(0, parseInt(screen.style.width));
        this.y = random(0, parseInt(screen.style.height));
        let food = document.createElement('div');

        food.id = 'food';
        food.style.left = this.x+'px';
        food.style.top = this.y+'px';
        screen.appendChild(food);
    }
}

class Snake{
    constructor(){
        this.x = 0;
        this.y = 0;
        this.xspeed = 1;
        this.yspeed = 0;
        this.index = 0;
        this.scl = 10;
        this.snake = '';
        this.point = 0;
        this.createSnake();
        for(let i = 0; i < 3; i++){
            this.expand(false);
        }
        this.moveSnake(this.xspeed, this.yspeed);
        this.updatePoint();
    }

    updatePoint(){
        let point = document.getElementById('point');
        point.innerText = this.point;
    }

    createSnake(){
        let snake = document.getElementById('snake');
        while(snake.firstChild){
            snake.removeChild(snake.firstChild);
        }
        let head = document.createElement('div');
        head.classList.add('head');
        snake.appendChild(head);
        this.snake = head;
    }

    moveSnake(xspeed, yspeed){
        if(xspeed){
            if(!this.xspeed){
                this.xspeed = xspeed;
                this.yspeed = 0;
            }
        }
        if(yspeed){
            if(!this.yspeed){
                this.xspeed = xspeed;
                this.yspeed = yspeed;
            }
        }
    }

    expand(updatePoint = true){
        let snake = document.getElementById('snake');
        let tail = document.createElement('div');
        tail.classList.add('tail');
        tail.style.left = '-100px';
        tail.style.top = '-100px';
        snake.appendChild(tail);
        if(updatePoint){
            this.point++;
            this.updatePoint();
        }
    }

    follow(){
        let tail = document.querySelectorAll('.tail');
        for(let i = 0; i < tail.length; i++){
            if(i == 0){
                tail[i].dataset.left = tail[i].style.left;
                tail[i].dataset.top = tail[i].style.top;
                tail[i].style.left = this.snake.dataset.left;
                tail[i].style.top = this.snake.dataset.top;
            } else {
                tail[i].dataset.left = tail[i].style.left;
                tail[i].dataset.top = tail[i].style.top;
                tail[i].style.left = tail[i-1].dataset.left;
                tail[i].style.top = tail[i-1].dataset.top;
            }
        }
    }

    isGameover(game){
        let head = document.querySelector('.head');
        let tail = document.querySelectorAll('.tail');
        let died = false;
        tail.forEach(function(piece){
            if((piece.style.left === head.style.left) && (piece.style.top === head.style.top)){
                died = true;
            }
        });
        if(this.x === -10 || this.x === game.width || this.y === -10 || this.y === game.height){
            died = true;
        }
        if(!died){
            return false;
        } else {
            return true;
        }
    }

    update(){
        this.snake.dataset.left = this.x+'px';
        this.snake.dataset.top = this.y+'px';
        this.x = this.x + this.xspeed * this.scl;
        this.y = this.y + this.yspeed * this.scl;
        this.snake.style.left = this.x+'px';
        this.snake.style.top = this.y+'px';
    }

    eat(food){
        if((snake.x == food.x) && (snake.y == food.y)){
            document.getElementById('food').remove();
            snake.expand();
            food.create();
        }
    }
}

let snake = new Snake();
let game = new Screen();
let food = new Food();

function onKeyPress(keyCode){
    console.log(keyCode);
    if(keyCode == 'ArrowUp'){
        snake.moveSnake(0, -1);
    } else if(keyCode == 'ArrowDown'){
        snake.moveSnake(0, 1);
    } else if(keyCode == 'ArrowLeft'){
        snake.moveSnake(-1, 0);
    } else if(keyCode == 'ArrowRight'){
        snake.moveSnake(1, 0);
    } else if(keyCode == 'Escape'){
        snake.expand();
    } else if(keyCode == 'Space'){
        if(game.stop){
            snake = new Snake();
            game = new Screen();
            clock = play();
        }
    }
}

document.addEventListener('keyup', function(e){
    onKeyPress(e.code);
});

function random(min, max) {
    return (Math.floor(Math.random() * ((max - min) / 10 )) + min) * 10;
}

function play(){
    let interval = setInterval( function(){
        snake.update();
        snake.follow();
        snake.eat(food);
        if(snake.isGameover(game)){
            game.gameover(interval);
        }
    }, game.refreshRate);
}

let clock = play();
