const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

const value = document.getElementById("scoreValue");
const result = document.querySelector("h2 > span");

let snake = [
    { x: 200, y: 200 },
    { x: 220, y: 200 }
];

let fruit = { x: 80, y: 80, color: "blue" };

let direction;
let loopId;

const drawSnake = () => {
    ctx.fillStyle = "gray";
    
    snake.forEach((position, index) => {
        if (index === snake.length - 1) {
            ctx.fillStyle = "white";
        }
        
        ctx.fillRect(position.x, position.y, scale, scale);
    });
}

const drawFruit = () => {
    const { x, y, color } = fruit;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, scale, scale);
}

const incrementScore = () => {
    value.innerText = parseInt(value.innerText) + 10;
}

const moveSnake = () => {
    if (!direction) return; 
    
   
    const head = { x: snake[snake.length - 1].x, y: snake[snake.length - 1].y };

   
    switch (direction.toLowerCase()) {
        case 'arrowright':
        case 'd':
            head.x += scale;
            if (head.x >= canvas.width) {
                head.x = 0; 
            }
            break;
        case 'arrowleft':
        case 'a':
            head.x -= scale;
            if (head.x < 0) {
                head.x = canvas.width - scale;
            }
            break;
        case 'arrowup':
        case 'w':
            head.y -= scale;
            if (head.y < 0) {
                head.y = canvas.height - scale; 
            }
            break;
        case 'arrowdown':
        case 's':
            head.y += scale;
            if (head.y >= canvas.height) {
                head.y = 0; 
            }
            break;
    }

    
    for (let i = 0; i < snake.length - 1; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            
            clearInterval(loopId);
            document.getElementById('gameOverScreen').style.display = 'block';
            result.innerText = value.innerText;
            value.innerText = 0;
            
            return;
        }
    }

    
    if (head.x === fruit.x && head.y === fruit.y) {
        
        randomPosition();

        
        snake.push({ ...head });
        incrementScore();
    } else {
       
        snake.shift();
        
        
        snake.push(head);
    }
};

const randomPosition = () => {
    
    let newX = Math.floor(Math.random() * columns) * scale;
    let newY = Math.floor(Math.random() * rows) * scale;

    
    for (let segment of snake) {
        if (newX === segment.x && newY === segment.y) {
           
            randomPosition();
            return;
        }
    }

    
    fruit.x = newX;
    fruit.y = newY;
};

const drawGrid = () => {
    ctx.save(); 
    
    ctx.lineWidth = 1;
    ctx.strokeStyle = "white";
    
  
    ctx.globalAlpha = 0.3;

    for (let i = 20; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }

    ctx.restore(); 

   
    ctx.fillStyle = "gray";
    snake.forEach((position, index) => {
        if (index === snake.length - 1) {
            ctx.fillStyle = "white";
        }
        ctx.fillRect(position.x, position.y, scale, scale);
    });
};

const gameLoop = () => {
    clearInterval(loopId);

    loopId = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();
        drawFruit();
        moveSnake();
        drawSnake();
        
    }, 250);
}

gameLoop();
document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();

    switch (key) {
        case 'arrowright':
        case 'd':
            if (direction !== 'arrowleft' && direction !== 'a') {
                direction = 'arrowright';
            }
            break;
        case 'arrowleft':
        case 'a':
            if (direction !== 'arrowright' && direction !== 'd') {
                direction = 'arrowleft';
            }
            break;
        case 'arrowup':
        case 'w':
            if (direction !== 'arrowdown' && direction !== 's') {
                direction = 'arrowup';
            }
            break;
        case 'arrowdown':
        case 's':
            if (direction !== 'arrowup' && direction !== 'w') {
                direction = 'arrowdown';
            }
            break;
        default:
            break;
    }
});


document.addEventListener("DOMContentLoaded", function() {
    const aviso = document.getElementById("aviso");
    const startButton = document.getElementById("startButton");
    const joystickContainer = document.getElementById("joystickContainer");
    const joystickBase = document.getElementById("joystickBase");

    let joystick; 

    const joystickOptions = {
        zone: joystickBase, 
        mode: 'static',
        position: { left: '50%', top: '50%' },
        color: 'rgba(255,255,255,0.5)',
        size: 150
    };


    function createJoystick() {
        joystick = nipplejs.create(joystickOptions);

        joystick.on('move', (event, data) => {
            const angle = data.angle.degree;

            if (angle >= 45 && angle < 135) {
                if (!isMovingVertically()) {
                    direction = 'arrowup'; // Cima
                }
            } else if (angle >= 135 && angle < 225) {
                if (!isMovingHorizontally()) {
                    direction = 'arrowleft'; // Esquerda
                }
            } else if (angle >= 225 && angle < 315) {
                if (!isMovingVertically()) {
                    direction = 'arrowdown'; // Baixo
                }
            } else {
                if (!isMovingHorizontally()) {
                    direction = 'arrowright'; // Direita
                }
            }
        });

       
        const isMovingHorizontally = () => {
            return direction === 'arrowright' || direction === 'arrowleft';
        };

     
        const isMovingVertically = () => {
            return direction === 'arrowup' || direction === 'arrowdown';
        };
    }

    startButton.addEventListener("click", function() {
       
        aviso.style.display = "none";
    
      
        if (window.innerWidth <= 798) {
           
            joystickContainer.style.display = "block";
            
       
            createJoystick();
        }
    
      
        gameLoop();
    });

 
    document.getElementById('restartButton').addEventListener('click', () => {
      
        snake = [
            { x: 200, y: 200 },
            { x: 220, y: 200 }
        ];

        direction = null;

       
        document.getElementById('gameOverScreen').style.display = 'none';

      
        clearInterval(loopId);

       
        gameLoop();
    });
});