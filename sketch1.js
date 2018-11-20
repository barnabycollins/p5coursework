var minionGOD;

function preload() {
    minionGOD = loadImage('magnus.png');
}

function setup() {
    var myCanvas = createCanvas(640, 480);
    myCanvas.parent("canvascontainer");
}
function draw() {
    image(minionGOD, mouseX, mouseY);
}