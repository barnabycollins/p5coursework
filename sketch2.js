var minionGOD;
var litFONT;
var x;

function preload() {
    minionGOD = loadImage('magnus.png');
    litFONT = loadFont('BebasNeue Regular.otf')
    x = 0;
}

function setup() {
    var myCanvas = createCanvas(800, 500, WEBGL);
    //stroke('#00d2ff');
    fill(0,0,0,255);
    background(200);
    //setAttributes('antialias', true);
    //smooth();
    texture(minionGOD);
    textFont()
    textSize(50);
}

// BOXES
//function draw() {
//    box();
//    translate(100,100,0);
//    rotateZ(radians(45));
//    rotateX(radians(10));
//    box();
//}

// SHANPS
function draw() {
    x += 3;
    x = x % 360;
    
    //minionRAVE
    ambientLight("hsb(" + x.toString() + ", 100%, 100%)");

    //minionSHAPE
    beginShape();
    vertex(0,0,100,0,0);
    vertex(100,0,100,1,0);
    vertex(100,100,100,1,1);
    vertex(-100,100,0,0,1);
    endShape(CLOSE);

    //minionBOX
    translate(-100,-100,0);
    rotateZ(radians(45));
    rotateX(radians(10));
    box();

    //minionTEXT
    //text('WAHEY', 10, 50);
}
