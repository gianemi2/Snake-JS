/* jshint esversion: 6 */
class Screen{
    constructor(){
        this.screen = document.getElementById('screen');
        this.refreshRate = 1000 * 0.2;
        this.width = 600;
        this.height = 600;
        this.xfood = 0;
        this.yfood = 0;
        this.build();
    }

    build(){
        this.screen.style.height = this.height+'px';
        this.screen.style.width = this.width+'px';
    }
}

class Food{
    constructor(){
        this.x = '';
        this.y = '';
        this.create();
    }

    create(){
        let oldFood = document.getElementById('food');
        if(oldFood){
            oldFood.remove();
        }
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
        this.startingPoint = 3;
        //Multiplier for seconds;
        for(let i = 0; i < this.startingPoint + 1; i++){
            this.expand();
        }
        this.createSnake();
        this.moveSnake(this.xspeed, this.yspeed);
    }

    createSnake(){
        let snake = document.getElementById('snake');
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

    expand(){
        let snake = document.getElementById('snake');
        let tail = document.createElement('div');
        tail.classList.add('tail');
        snake.appendChild(tail);
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

    update(){
        this.snake.dataset.left = this.x+'px';
        this.snake.dataset.top = this.y+'px';
        this.x = this.x + this.xspeed * this.scl;
        this.y = this.y + this.yspeed * this.scl;
        this.snake.style.left = this.x+'px';
        this.snake.style.top = this.y+'px';
    }
}

let snake = new Snake();
let game = new Screen();
let food = new Food();

function eat(){
    if((snake.x == food.x) && (snake.y == food.y)){
        snake.expand();
        food.create();
    }
}

function onKeyPress(keyCode){
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
    }
}

document.addEventListener('keyup', function(e){
    onKeyPress(e.code);
});

function random(min, max) {
    return (Math.floor(Math.random() * ((max - min) / 10 )) + min) * 10;
}

setInterval( function(){
    snake.update();
    snake.follow();
    eat();
}, game.refreshRate);
