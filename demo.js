var pNoise, seed = 759, numParticles = 250, mode, minLife, maxLife = 20, noiseScale, simulationSpeed, paddingY, paddingX, backgroundColour, defaultColour, colourL, colourR, submit;

function setup() {
    pNoise = new PerlinNoise('canvascontainer', windowWidth * 0.4, windowHeight, seed, numParticles, mode, minLife, maxLife, noiseScale, simulationSpeed, paddingY, paddingX, backgroundColour, defaultColour, colourL, colourR);
}
function draw() {
    pNoise.draw();
}
function windowResized() {
    pNoise.canvasSize(windowWidth * 0.4, windowHeight);
}

/**
 * Update the (live) sketch with new values from the form
 */
function updateSketch() {
    for (i = 0; i < inputs.length; i++) {
        // for every input
        if (inputs[i].className.indexOf('number') !== -1) {
            // for numbers
            if (!isNaN(eval('Number(form.' + inputs[i].name + '.value);'))) {
                // if it's a valid number
                eval('pNoise.setParameter("' + inputs[i].name + '", Number(form.' + inputs[i].name + '.value));');
            }
        }
        else if (inputs[i].className == 'colour') {
            // for colours
            eval('pNoise.setParameter("' + inputs[i].name + '", color(form.' + inputs[i].name + '.value));');
        }
        else if (inputs[i].className !== 'submit-button') {
            // for strings (none implemented in the demo at the moment)
            eval('pNoise.setParameter("' + inputs[i].name + '", form.' + inputs[i].name + '.value);');
        }
    }
}

/**
 * Restart sketch with new values from the form
 */
function restartSketch() {
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
        else if (inputs[i].className !== 'submit-button') {
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
    document.getElementById('restart-btn').addEventListener('click', function() {
        restartSketch();
    });
});