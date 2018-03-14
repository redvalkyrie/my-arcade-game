/**
 *information obtained from the following sources:
 *https://stackoverflow.com/
 *https://www.w3schools.com/
 * https://discussions.udacity.com/
 * Sound files from the following sources
 * https://www.bensound.com/royalty-free-music/track/summer
 * http://www.noiseforfun.com/browse-sound-effects/
 */
let startScreen = document.querySelector('.startUp');
let charList = document.querySelectorAll('.person');
/**
@description: adds event listeners to each starting character and begins game
 * when selected
 * @param: kid: each .png on start screen (characters).
 */
charList.forEach(function(kid) {
    kid.addEventListener('click', function() {
        if (kid) {
            player.sprite = kid.getAttribute('src');

            startScreen.classList.remove('show');
            startNow = true;
            getEnemies();
        }
    });
});
/**
 *@description: Enemies our player must avoid
 * @param: x: enemy's x coordinate, y: enemy's y coordinate
 */
let Enemy = function(x, y) {

    this.x = x;
    this.y = y;
    this.speed = Math.floor(Math.random() * (300-80)) + 80;
    // The image/sprite for enemies
    this.sprite = 'images/enemy-bug.png';
};
/**
 *@description: updates the enemy's position on the canvas and checks and calls
  *collisionCheck to check for collisions
  *@param: dt: time delta
 */
Enemy.prototype.update = function(dt) {
    // Multiplies any movement by the dt parameter which will ensure the game
    // runs at the same speed for all computers.
    this.x = this.x + (this.speed * dt) ;
    if (this.x > 500) {
        this.x = -200;
    }
    this.collisionCheck(player);
};
/**
 *@description: Draw the enemy on the screen, required method for game
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
/**
 *@description: Checks for colllions between player and bugs
 * @param: player, the user's player Character consolled by the user.
 */
Enemy.prototype.collisionCheck = function(player) {
    if (player.x < this.x + 70 &&
        player.x + 70 > this.x &&
        player.y < this.y + 55 &&
        55 + player.y > this.y) {
            player.reset();
            lifeRemove();
            hitSound.play();
        }
}
/**
 *@description: Player for the user
 * @param: x: player's X coordinate, Y: user's Y coordinate
 */
let Player = function(x, y) {
    this.sprite ='images/char-boy.png';
    this.x = x;
    this.y = y;
};
/**
 *@description: Resets player when colliding with bugs or reaching water
 */
Player.prototype.reset = function () {
    this.x = 200;
    this.y = 390;
}

Player.prototype.update = function(dt) {

};
/**
 *@description: Draws the character on the screen
*/

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
/**
 * @description: Moves player based upon key pressed. Checks if player x/y values
 *  are within canvas range.  If 'up' arrow moves player into water, player is
 *  reset to starting position.
 * @param: key: the key the user pressed
 */
Player.prototype.handleInput = function(key) {
    switch(key) {
        case 'left':
            if (this.x > 0) {
                this.x = this.x - 100;
            }
            break;
        case 'right':
            if (this.x < 400) {
                this.x = this.x + 100;
            }
            break;
        case 'up':
            if (this.y > 80) {
                this.y = this.y - 80;
            }else {
                this.reset();
                addSplash();
                splashSound.cloneNode(true).play();
            }
            break;
        case 'down':
            if (this.y < 370) {
                this.y = this.y + 80;
            }
            break;
        default:
            break;
    }
};

/**
 * @description: Player the user has selected in starting position
 */
let player = new Player(200, 390);
/**
 * @description: Array for all enemies.
 */
let allEnemies = new Array();
/**
 * @description: Array to store all y values of bugs created
 */
let bugCheck = new Array();

/**
 * @description: Creates enemies for allEnemies
 */
let getEnemies = function() {
    const bugs = 4;
    /**
     *@description: randomly selects a y value for each block row, shuffles
     randX and randY to decrease likelihood of dublipate X/Y coordinates
      */
    let randomizedY = function() {
        const positions = [60, 140, 220];
        return positions[Math.floor(Math.random() * 3)];
    };

    for (let i=0; i<bugs; i++) {
        let enemy = new Enemy();
        enemy.x = 0;
        enemy.y = randomizedY();
        bugCheck.push(enemy.y);
        allEnemies.push(enemy);
    }
    enemyCheck();
};
/**
 * @description: Checks all rows forenemies and pushes new enemy into allEnemies
 * if a row is empty.
 */
let enemyCheck = function() {
    let topRow = bugCheck.includes(60);
    let middleRow = bugCheck.includes(140);
    let bottomRow = bugCheck.includes(220);
    if(topRow === false) {
        let newBug = new Enemy();
        newBug.x =0;
        newBug.y = 60;
        allEnemies.push(newBug);
    }
    if (middleRow === false) {
        let newBug = new Enemy();
        newBug.x =0;
        newBug.y = 140;
        allEnemies.push(newBug);
    }
    if (bottomRow === false) {
        let newBug = new Enemy();
        newBug.x =0;
        newBug.y = 220;
        allEnemies.push(newBug);
    }
}
/**
 * @description: Set up hearts and check for winning the game
 */
let livesRemaining = 3;
let heartCount = document.querySelectorAll('.fa-heart');
let heartList = document.querySelector('.hearts');
/**
 * @description:when player reaches the water
 */
let splashCount = document.querySelector('.splashes');
let splash = 0;

function addSplash() {
    splash ++;
    if(splash ===1){
        splashCount.innerHTML = splash + ' Splash!';
    } else {
        splashCount.innerHTML = splash + ' Splashes!';
    }
}
/**
 * @description:removes 1 live(heart) every time there is player/bug collision
 */
function lifeRemove() {
    livesRemaining --;
    if (livesRemaining === 2) {
        heartCount[2].style.visibility = 'collapse';
    } else if (livesRemaining === 1){
        heartCount[1].style.visibility = 'collapse';
    } else if (livesRemaining ===0) {
        heartCount[0].style.visibility = 'collapse';
    }
}
/**
 * @description:This listens for key presses and sends the keys to Player.handleInput() method.
 */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

/**
 * @description:Function for continual looping of background music
 */
function musicPlayer() {
    let music = document.querySelector('.myMusic').loop;
    document.querySelector('.myMusic').innerHTML = music;
}

//sound effect for player/bug collision
const hitSound = new Audio('sounds/NFF-slap.mp3');

//sound effect for when player reaches water
const splashSound = new Audio ('sounds/NFF-bubbling.mp3');

let endHearts = document.querySelector('.totalLives');
let endSplashes = document.querySelector('.totalSplashes');

let endGame = document.querySelector('.gameEnd');

// accesses the class "modal" from html
let modalSelector = document.querySelector('.modal');

let endScore = document.querySelector('.endScore');
/**
 * @description:Checks for conditions of end game are met.  IF so, displays
 * win or loss, hearts, and number of splashes.
 */
function gameOver () {
    if (livesRemaining === 0 || splash === 10){
        modalSelector.classList.add('show');
        if (livesRemaining === 0) {
            endGame.innerHTML = 'Game Over!';
            endHearts.innerHTML = '0 Lives!';
            endSplashes.innerHTML = splashCount.innerHTML;
        } else {
            endGame.innerHTML = 'You Win!';
            endHearts.innerHTML = heartList.innerHTML;
            endSplashes.innerHTML = splashCount.innerHTML;
        }
    }
}
//button to allow player to play again at end of game
const replayButton = document.querySelector('.replay');

replayButton.addEventListener('click', gameReset);
/**
 * @description:Resets game when button clicked to play again, empties allEnemies,
 * bugCheck, and allGems.  Resets livesRemaining, splashes,clears all
 * .innerHTML from modal, and shows startScreen (character selection screen).
 */
function gameReset() {
    livesRemaining=3;
    splash=0;
    player.reset();
    allEnemies = [];
    splashCount.innerHTML = splash + ' Splashes!';
    endGame.innerHTML = '';
    endHearts.innerHTML = '';
    endSplashes.innerHTML = '';
    bugCheck = [];
    allGems = [];
    for (let i=0; i < heartCount.length; i++) {
        heartCount[i].style.visibility = 'visible';
    }
    modalSelector.classList.remove('show');
    startScreen.classList.add('show');
}
