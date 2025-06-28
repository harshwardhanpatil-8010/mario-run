// Game variables
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('start-button');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');

// Load images
const marioImage = new Image();
marioImage.src = 'images/mario.svg';
const pipeImage = new Image();
pipeImage.src = 'images/pipe.svg';

// Game settings
const gravity = 0.5;
const jumpForce = -12;
const groundHeight = 50;
const obstacleWidth = 50;
const obstacleMinHeight = 30;
const obstacleMaxHeight = 80;
const obstacleMinGap = 300;
const obstacleMaxGap = 600;
const gameSpeed = 5;

// Game state
let isGameRunning = false;
let score = 0;
let highScore = 0;
let animationId;
let obstacles = [];

// Cloud variables
const clouds = [];
for (let i = 0; i < 3; i++) {
    clouds.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height / 2),
        width: 80 + Math.random() * 40,
        height: 40 + Math.random() * 20,
        speed: 0.5 + Math.random() * 0.5
    });
}

// Draw clouds function
function drawClouds() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    for (let cloud of clouds) {
        // Draw cloud
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.height/2, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.width/3, cloud.y - cloud.height/4, cloud.height/2, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.width/1.5, cloud.y, cloud.height/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Move cloud
        cloud.x -= cloud.speed;
        
        // Reset cloud position if it moves off screen
        if (cloud.x + cloud.width < 0) {
            cloud.x = canvas.width;
            cloud.y = Math.random() * (canvas.height / 2);
        }
    }
}

// Mario character
const mario = {
    x: 100,
    y: canvas.height - groundHeight - 50,
    width: 50,
    height: 50,
    velocityY: 0,
    isJumping: false,
    
    draw() {
        if (marioImage.complete) {
            ctx.drawImage(marioImage, this.x, this.y, this.width, this.height);
        } else {
            // Fallback if image isn't loaded
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    },
    
    update() {
        // Apply gravity
        this.velocityY += gravity;
        this.y += this.velocityY;
        
        // Check ground collision
        if (this.y > canvas.height - groundHeight - this.height) {
            this.y = canvas.height - groundHeight - this.height;
            this.velocityY = 0;
            this.isJumping = false;
        }
    },
    
    jump() {
        if (!this.isJumping) {
            this.velocityY = jumpForce;
            this.isJumping = true;
        }
    },
    
    reset() {
        this.y = canvas.height - groundHeight - 50;
        this.velocityY = 0;
        this.isJumping = false;
    }
};

function createObstacle() {
    const height = Math.floor(Math.random() * (obstacleMaxHeight - obstacleMinHeight + 1)) + obstacleMinHeight;
    const obstacle = {
        x: canvas.width,
        y: canvas.height - groundHeight - height,
        width: obstacleWidth,
        height: height,
        
        draw() {
            if (pipeImage.complete) {
                ctx.drawImage(pipeImage, this.x, this.y, this.width, this.height);
            } else {
                // Fallback if image isn't loaded
                ctx.fillStyle = 'green';
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        },
        
        update() {
            this.x -= gameSpeed;
        }
    };
    
    obstacles.push(obstacle);
    
    // Schedule next obstacle
    if (isGameRunning) {
        const nextObstacleGap = Math.floor(Math.random() * (obstacleMaxGap - obstacleMinGap + 1)) + obstacleMinGap;
        setTimeout(createObstacle, nextObstacleGap / gameSpeed * 10);
    }
}

// Ground
const ground = {
    draw() {
        // Draw ground
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);
        
        // Draw grass on top of ground
        ctx.fillStyle = '#228B22';
        ctx.fillRect(0, canvas.height - groundHeight, canvas.width, 10);
    }
};

// Collision detection
function checkCollision(mario, obstacle) {
    return (
        mario.x < obstacle.x + obstacle.width &&
        mario.x + mario.width > obstacle.x &&
        mario.y < obstacle.y + obstacle.height &&
        mario.y + mario.height > obstacle.y
    );
}

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background (sky)
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height - groundHeight);
    gradient.addColorStop(0, '#5C94FC');
    gradient.addColorStop(1, '#9DC1FB');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height - groundHeight);
    
    // Draw clouds
    drawClouds();
    
    // Update and draw ground
    ground.draw();
    
    // Update and draw Mario
    mario.update();
    mario.draw();
    
    // Update and draw obstacles
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].update();
        obstacles[i].draw();
        
        // Check collision
        if (checkCollision(mario, obstacles[i])) {
            gameOver();
            return;
        }
        
        // Remove obstacles that are off-screen
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            i--;
            
            // Increase score
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
        }
    }
    
    // Continue the game loop
    animationId = requestAnimationFrame(gameLoop);
}

// Start game
function startGame() {
    console.log("Game started!");
    if (isGameRunning) return;
    
    isGameRunning = true;
    score = 0;
    obstacles = [];
    mario.reset();
    
    scoreDisplay.textContent = `Score: ${score}`;
    
    // Create first obstacle
    createObstacle();
    
    // Start game loop
    gameLoop();
}

// Game over
function gameOver() {
    isGameRunning = false;
    cancelAnimationFrame(animationId);
    
    // Update high score
    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = `High Score: ${highScore}`;
    }
    
    // Show game over message
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = '48px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 50);
    
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2);
    ctx.fillText('Press Start to play again', canvas.width / 2, canvas.height / 2 + 50);
}

// Event listeners
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && isGameRunning) {
        mario.jump();
    }
});

// Initialize high score display
highScoreDisplay.textContent = `High Score: ${highScore}`;

// Draw initial scene
ctx.clearRect(0, 0, canvas.width, canvas.height);
const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height - groundHeight);
gradient.addColorStop(0, '#5C94FC');
gradient.addColorStop(1, '#9DC1FB');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, canvas.width, canvas.height - groundHeight);
drawClouds();
ground.draw();
mario.draw();
