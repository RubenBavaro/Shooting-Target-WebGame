let colors = ["#FF0000", "#FFFFFF","#FF0000", "#FFFFFF","#FF0000", "#FFFFFF", "#FF0000", "#FFFFFF", "#FF0000"];
let points = 0;
let startTime = null;
let gameActive = false;
let timeoutId = null;
let arrows = [];

function generateRandomInteger(min=0, max=2) {
    return Math.floor(Math.random() * (max - min) + min);
}

function setup() {
    let canvas = createCanvas(300, 300);
    canvas.parent('cerchi');
    angleMode(DEGREES);
    document.getElementById('start').addEventListener('click', startGame);
}

function startGame() {
    points = 0;
    arrows = [];
    gameActive = true;
    startTime = Date.now();
    document.getElementById('points').innerText = 'PUNTI ATTUALI == 0';
    document.getElementById('start').disabled = true;
    
    timeoutId = setTimeout(() => {
        gameActive = false;
        document.getElementById('start').disabled = false;
        document.getElementById('time').innerText = "TEMPO SCADUTO!";
    }, 5000);
}

function draw() {
    pixelDensity(5);
    let maxDiameter = width; 
    let numCircles = 9;
    for (let i = 0; i < numCircles; i++) {
        let diameter = maxDiameter - (i * (maxDiameter / numCircles)); 
        fill(colors[i]);
        ellipse(width / 2, height / 2, diameter, diameter); 
    }

    stroke(0);
    strokeWeight(2);
    arrows.forEach(arrow => {

        let dx = mouseX - arrow.x;
        let dy = mouseY - arrow.y;
        let angle = atan2(dy, dx);
        

        let length = (arrow.length + 1) * 10;
        let endX = arrow.x + cos(angle) * length;
        let endY = arrow.y + sin(angle) * length;
        
        line(arrow.x, arrow.y, endX, endY);
    });

    if (gameActive) {
        let elapsed = Date.now() - startTime;
        let remaining = (5000 - elapsed)/1000;
        document.getElementById('time').innerText = 
            `Tempo rimanente: ${remaining.toFixed(2)}`;
    }
}

function mouseClicked(){
    if (!gameActive) return;
    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;

    let centerX = width / 2;
    let centerY = height / 2;
    let distance = dist(mouseX, mouseY, centerX, centerY);
    let step = width / 9;

    for (let i = 8; i >= 0; i -= 2) {
        let outerDiameter = width - (i * step);
        let outerRadius = outerDiameter / 2;
        let innerDiameter = i === 8 ? 0 : width - ((i + 1) * step);
        let innerRadius = innerDiameter / 2;

        if (distance <= outerRadius && distance >= innerRadius) {
            points += 50 - ((8 - i)/2) * 10;
            document.getElementById('points').innerText = 
                `PUNTI ATTUALI == ${points}`;
            
            arrows.push({
                x: mouseX,
                y: mouseY,
                length: generateRandomInteger()
            });
            break;
        }
    }
}