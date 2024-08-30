const gameArea = document.querySelector('.game-area');
const spaceship = document.querySelector('.spaceship');
const scoreDisplay = document.querySelector('.score');
const startButton = document.querySelector('.start-button');
const gameOverScreen = document.querySelector('.game-over');
const finalScoreDisplay = document.getElementById('final-score');
const restartButton = document.querySelector('.restart-button');
const backgroundMusic = document.getElementById('background-music');
const explosionSound = document.getElementById('explosion-sound');
const muteMusicButton = document.querySelector('.mute-music');
const muteSoundButton = document.querySelector('.mute-sound');

let score = 0;
let gameInterval;
let creationInterval = 2000; 

let spaceshipX = gameArea.offsetWidth / 2 - spaceship.offsetWidth / 2;
let spaceshipY = gameArea.offsetHeight / 2 - spaceship.offsetHeight / 2;

const spaceshipSpeed = 5;

let isMovingUp = false;
let isMovingDown = false;
let isMovingLeft = false;
let isMovingRight = false;

function createSpaceObject() {
    const spaceObject = document.createElement('img');
    const isComet = Math.random() < 0.2; 

    if (isComet) {
        spaceObject.src = 'images/comet.png';
        spaceObject.classList.add('comet');
    } else {
        spaceObject.src = 'images/asteroid.png';
        spaceObject.classList.add('asteroid');
    }

    let side = Math.floor(Math.random() * 4); 
    switch (side) {
        case 0:
            spaceObject.style.left = Math.random() * gameArea.offsetWidth + 'px';
            spaceObject.style.top = '-50px'; 
            break;
        case 1:
            spaceObject.style.left = gameArea.offsetWidth + 'px';
            spaceObject.style.top = Math.random() * gameArea.offsetHeight + 'px';
            break;
        case 2:
            spaceObject.style.left = Math.random() * gameArea.offsetWidth + 'px';
            spaceObject.style.top = gameArea.offsetHeight + 'px';
            break;
        case 3:
            spaceObject.style.left = '-50px'; 
            spaceObject.style.top = Math.random() * gameArea.offsetHeight + 'px';
            break;
    }

    gameArea.appendChild(spaceObject);

    let objectX = parseInt(spaceObject.style.left);
    let objectY = parseInt(spaceObject.style.top);
    let targetX = gameArea.offsetWidth / 2;
    let targetY = gameArea.offsetHeight / 2;
    let angle = Math.atan2(targetY - objectY, targetX - objectX);
    let speed = 2 + Math.random() * 3; 

    let moveObject = setInterval(() => {
        objectX += speed * Math.cos(angle);
        objectY += speed * Math.sin(angle);
        spaceObject.style.left = objectX + 'px';
        spaceObject.style.top = objectY + 'px';

        if (
            objectX < spaceshipX + spaceship.offsetWidth &&
            objectX + spaceObject.offsetWidth > spaceshipX &&
            objectY < spaceshipY + spaceship.offsetHeight &&
            objectY + spaceObject.offsetHeight > spaceshipY
        ) {
            clearInterval(moveObject);
            gameArea.removeChild(spaceObject);
            endGame();
        }

        if (
            objectX + spaceObject.offsetWidth < 0 ||
            objectX > gameArea.offsetWidth ||
            objectY + spaceObject.offsetHeight < 0 ||
            objectY > gameArea.offsetHeight
        ) {
            clearInterval(moveObject);
            gameArea.removeChild(spaceObject);
            score++;
            scoreDisplay.textContent = `Pontuação: ${score}`;

            creationInterval = 2000 - score * 100; 
            creationInterval = Math.max(500, creationInterval); 
            clearInterval(gameInterval); 
            gameInterval = setInterval(createSpaceObject, creationInterval);
        }
    }, 20); 
}

function playBackgroundMusic() {
    if (!backgroundMusic.muted) {
        backgroundMusic.play();
    }
}

function stopBackgroundMusic() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0; 
}

function playExplosionSound() {
    if (!explosionSound.muted) {
        explosionSound.play();
    }
}

function startGame() {
    spaceship.style.left = spaceshipX + 'px';
    spaceship.style.top = spaceshipY + 'px';
    spaceship.style.display = 'block';
    spaceship.src = 'images/spaceship.png';
    score = 0;
    scoreDisplay.textContent = `Pontuação: ${score}`;

    creationInterval = 2000;
    const spaceObjects = document.querySelectorAll('.asteroid, .comet');
    spaceObjects.forEach(object => gameArea.removeChild(object));

    gameInterval = setInterval(createSpaceObject, creationInterval); 
    playBackgroundMusic(); 
    gameOverScreen.style.display = 'none'; 
    startButton.disabled = true; 
}

function endGame() {
    clearInterval(gameInterval);
    stopBackgroundMusic(); 
    playExplosionSound(); 

    spaceship.src = 'images/explosion.gif'; 
    setTimeout(() => {
        spaceship.style.display = 'none'; 
        finalScoreDisplay.textContent = score;
        gameOverScreen.style.display = 'block';
        startButton.disabled = false;
    }, 1000); 

    creationInterval = 2000; 
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            isMovingUp = true;
            break;
        case 'ArrowDown':
            isMovingDown = true;
            break;
        case 'ArrowLeft':
            isMovingLeft = true;
            break;
        case 'ArrowRight':
            isMovingRight = true;
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            isMovingUp = false;
            break;
        case 'ArrowDown':
            isMovingDown = false;
            break;
        case 'ArrowLeft':
            isMovingLeft = false;
            break;
        case 'ArrowRight':
            isMovingRight = false;
            break;
    }
});

setInterval(() => {
    if (isMovingUp) spaceshipY -= spaceshipSpeed;
    if (isMovingDown) spaceshipY += spaceshipSpeed;
    if (isMovingLeft) spaceshipX -= spaceshipSpeed;
    if (isMovingRight) spaceshipX += spaceshipSpeed;

    spaceshipX = Math.max(0, Math.min(spaceshipX, gameArea.offsetWidth - spaceship.offsetWidth));
    spaceshipY = Math.max(0, Math.min(spaceshipY, gameArea.offsetHeight - spaceship.offsetHeight));
    spaceship.style.left = spaceshipX + 'px';
    spaceship.style.top = spaceshipY + 'px';
}, 20);

startButton.addEventListener('click', startGame);

restartButton.addEventListener('click', () => {
    const spaceObjects = document.querySelectorAll('.asteroid, .comet');
    spaceObjects.forEach(object => gameArea.removeChild(object));

    startGame(); 
});

muteMusicButton.addEventListener('click', () => {
    backgroundMusic.muted = !backgroundMusic.muted;
    muteMusicButton.textContent = backgroundMusic.muted ? 'Música: Desligada' : 'Música: Ligada';
});

muteSoundButton.addEventListener('click', () => {
    explosionSound.muted = !explosionSound.muted;
    muteSoundButton.textContent = explosionSound.muted ? 'Som: Desligado' : 'Som: Ligado';
});