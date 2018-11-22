//var minionGOD;

function preload() {
    //minionGOD = loadImage('magnus.png');
}

function setup() {
    var myCanvas = createCanvas(640, 480);
    myCanvas.parent("canvascontainer");
    stroke('#00d2ff');
    fill(0);
}
function draw() {
    ellipse(mouseX, mouseY, 50, 50);
    //image(minionGOD, mouseX, mouseY);
}