var pNoise, seed = 759, numParticles = 250, mode, minLife, maxLife = 20, noiseScale, speed, paddingY, paddingX, backgroundColour, defaultColour, colourL, colourR, submit;

function setup() {
    pNoise = new PerlinNoise('canvascontainer', windowWidth * 0.4, windowHeight, seed, numParticles, mode, minLife, maxLife, noiseScale, speed, paddingY, paddingX, backgroundColour, defaultColour, colourL, colourR);
}
function draw() {
    pNoise.draw();
}
function windowResized() {
    pNoise.canvasSize(windowWidth * 0.4, windowHeight);
}

function updateSketch() {
    for (i = 0; i < inputs.length; i++) {
        if (inputs[i].className.indexOf('number') !== -1) {
            if (isNaN(eval('Number(form.' + inputs[i].name + '.value);'))) {
                eval(inputs[i].name + ' = null;');
            }
            else {
                eval(inputs[i].name + ' = Number(form.' + inputs[i].name + '.value);');
            }
        }
        else if (inputs[i].className == 'colour') {
            eval(inputs[i].name + ' = color(form.' + inputs[i].name + '.value);');
        }
        else {
            eval(inputs[i].name + ' = form.' + inputs[i].name + '.value;');
        }
    }
    setup();
}

document.addEventListener('DOMContentLoaded', function() {
    form = document.getElementById('parameterform');
    inputs = form.getElementsByTagName('input');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        updateSketch();
    });
    console.log(inputs);
});