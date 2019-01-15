var texture;
var pNoise;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    graphic = createGraphics(400, 400);
    pNoise = new PerlinNoise(graphic);
    background(color('#333333'));
    noStroke();
}

function draw() {
    pNoise.draw(graphic);
    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);
    background(color('#333333'));
    texture(graphic);
    box(400);
}
