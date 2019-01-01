// This sketch borrows heavily from yasai's perlin noise sketch
// Tony R. 2018
'use strict';



/** Class to create a Perlin Noise sketch */
class PerlinNoise {
    /**
    * Create new Perlin Noise sketch
    * @param {string} [parentDiv] - The div id to place the sketch inside
    * @param {number} [width=windowHeight] - The width the canvas should take
    * @param {number} [height=windowHeight] - The height the canvas should take
    * @param {number} [seed=1337] - The seed to use to generate the noise: must be a number, not a string
    * @param {number} [numParticles=100] - The number of particles to generate (default: 100)
    * @param {number} [mode=0] - The mode to use: 0 for particles spawning at the top, 1 for particles spawning everywhere
    * @param {number} [minLife=0] - The minimum life to assign to each particle (default: 0)
    * @param {number} [maxLife=10] - The maximum life to assign to each particle (default: 10)
    * @param {number} [noiseScale=200] - The scale of the Perlin Noise relative to pixels (default: 200)
    * @param {number} [speed=0.2] - A multiplier for the speed at which particles travel (default: 0.2)
    * @param {number} [paddingY=30] - The vertical padding to add inside the canvas at the top and bottom
    * @param {number} [paddingX=30] - The horizontal padding to add inside the canvas at the left and right sides
    * @param {string} [backgroundColour=black] - The background colour to add
    * @param {string} [defaultColour=white] - The colour to use for non-coloured particles
    * @param {string} [colourL=cyan] - The colour to give particles travelling left
    * @param {string} [colourR=purple] - The colour to give particles travelling right
    */
    constructor (parentDiv, width, height, seed, numParticles, mode, minLife, maxLife, noiseScale, speed, paddingY, paddingX, backgroundColour, defaultColour, colourL, colourR) { 
        this.parent = parentDiv || false;                               // id of div to be used as parent (false if none)
        this.width = width || windowHeight;                             // width of canvas
        this.height = height || windowHeight;                           // height of canvas
        this.seed = seed || 1337;                                       // seed for use by random() and noise()
        this.nums = numParticles || 100;                                // number of particles to instantiate
        this.mode = mode || 0;                                          // mode to use (are particles spawning everywhere (1) or just at the top (0)?)
        this.minLife = minLife || 0;                                    // minimum life for each particle
        this.maxLife = maxLife || 10;                                   // maximum life for each particle
        this.noiseScale = noiseScale || 200;                            // constant to scale noise with
        this.simulationSpeed = speed || 0.2;                            // constant to scale particle velocities with
        this.padding_top = paddingY || 30;                              // padding on top & bottom of box
        this.padding_side = paddingX || 30;                             // padding on sides of box
        this.particles = [];                                            // array to put particles in
        this.backgroundColor = backgroundColour || color('black');      // background colour
        this.defaultColour = defaultColour || color('white');           // colour for non-coloured particles
        this.color_to = colourL || color('cyan');                       // colour for moving left
        this.color_from = colourR || color('purple');                   // colour for moving right
        this.fadeFrame = 0;                                             // iterating variable to count frames

        this.canvas = createCanvas(this.width, this.height);
        if (this.parent) {
            this.canvas.parent(this.parent);
        }
        this.element = document.getElementById('p5_loading');
        if (this.element) {
            this.element.parentNode.removeChild(this.element);
        }

        randomSeed(this.seed);
        noiseSeed(this.seed);

        background(this.backgroundColor);
        
        noStroke();
        smooth();
        
        // generate initial particle locations
        for(var i = 0; i < this.nums; i++){
            var p = new Particle(this.mode, this.minLife, this.maxLife, this.defaultColour, this.color_to, this.color_from, this.width, this.height, this.padding_side, this.padding_top, this.noiseScale, this.simulationSpeed);
            p.pos.x = random(this.padding_side, this.width-this.padding_side);
            if (this.mode) {
                p.pos.y = random(this.padding_top, this.height-this.padding_top);
            }
            else {
                p.pos.y = this.padding_top;
            }
            this.particles[i] = p;
        }
        
        fill(color(255));
    } // end constructor

    /**
     * To be put inside the p5 draw() function
     */
    draw() {
        ++this.fadeFrame;               // increment fadeFrame
        if(this.fadeFrame % 5 == 0){    // every 5th frame
            
            blendMode(DIFFERENCE);      // fade past particle trails
            fill(1, 1, 1);
            rect(0,0,this.width,this.height);
    
            blendMode(LIGHTEST);
            fill(this.backgroundColor);
            rect(0,0,this.width,this.height);
        }
        
        blendMode(BLEND);
        
        // iterate through particles
        for(var i = 0; i < this.nums; i++){
            // iterations and radius both dependent on the particle's index
            // (as they are randomly placed this ensures we have an even spread of properties without creating patterns)
            var iterations = map(i,0,this.nums,5,1);
            var radius = map(i,0,this.nums,2,6);
            
            this.particles[i].move(iterations);
            this.particles[i].checkEdge();
            
            // work out the colour the particle should have based on its heading
            var particle_heading = this.particles[i].vel.heading()/PI;
            if(particle_heading < 0){
                particle_heading *= -1;
            }
            var particle_color = lerpColor(this.particles[i].color1, this.particles[i].color2, particle_heading);
            
            // work out how bright (opaque) the particle should be based on its life:
            // dark initially and finally, and bright otherwise
            var fade_ratio;
            fade_ratio = min(this.particles[i].life * 5 / this.maxLife, 1);
            fade_ratio = min((this.maxLife - this.particles[i].life) * 5 / this.maxLife, fade_ratio);
    
            // show the particle now that colour etc has been processed
            fill(red(particle_color), green(particle_color), blue(particle_color), 255 * fade_ratio);
            this.particles[i].display(radius);
        }
    }

    // optionally to be attached to the p5 windowResized function to allow for resizing the canvas to respond to changes in the window's shape
    /**
     * Resize the canvas to the given sizes
     * @param {number} [resizeWidth='existing width'] - Width to make the canvas
     * @param {number} [resizeHeight='existing height'] - Height to make the canvas
     */
    canvasSize(resizeWidth, resizeHeight) {
        resizeWidth = resizeWidth || this.width;
        resizeHeight = resizeHeight || this.height;
        resizeCanvas(resizeWidth, resizeHeight);

        // update width and height variables
        this.width = resizeWidth;
        this.height = resizeHeight;
        for(var i = 0; i < this.nums; i++){
            this.particles[i].setSize(resizeWidth, resizeHeight);
        }
    }
}



function Particle(respawnMode, minLife, maxLife, defaultColour, colourL, colourR, width, height, padding_side, padding_top, noiseScale, simulationSpeed){
    // member properties and initialization
    this.vel = createVector(0, 0);
    this.pos = createVector(random(0, width), random(0, height));
    this.life = random(minLife, maxLife);
    this.flip = int(random(0,2)) * 2 - 1;
    this.color1 = this.color2 = defaultColour;
    
    // at a 1/3 chance, make this a coloured particle
    if(int(random(3)) == 1){
        //this.color1 = color('palegreen');
        //this.color2 = color('cyan');
        this.color1 = colourR;
        this.color2 = colourL;
    }
    
    // member functions
    this.move = function(iterations){
        // if dead, respawn
        if((this.life -= 0.01666) < 0) {
            this.respawn();
        }

        // while we still have iterations to use up
        while(iterations > 0) {
            
            // compute angle
            var transition = map(this.pos.x, padding_side, width-padding_side, 0.1, 0.9);
            var angle = noise(this.pos.x/noiseScale, this.pos.y/noiseScale)*transition*TWO_PI*noiseScale;
            //var transition = map(this.pos.y, height/5, height-padding_top, 0, 1, true);
            //var angle = HALF_PI;
            //angle += (noise(this.pos.x/noiseScale, this.pos.y/noiseScale)-0.5)*transition*TWO_PI*noiseScale/66;

            // work out the position we will be at as a result of this angle
            this.vel.x = cos(angle);
            this.vel.y = sin(angle);
            this.vel.mult(simulationSpeed);
            this.pos.add(this.vel);

            // decrement iterations
            --iterations;
        }
    };

    // respawn if we're near the edge
    this.checkEdge = function(){
        if(this.pos.x > width - padding_side
        || this.pos.x < padding_side
        || this.pos.y > height - padding_top
        || this.pos.y < padding_top){
            this.respawn();
        }
    };
    
    // alternative respawn function where we respawn anywhere in the canvas, not necessarily at the top
    this.respawn = function(){
        this.pos.x = random(padding_side, width-padding_side);
        if (respawnMode) {
            this.pos.y = random(padding_top, height-padding_top);
        }
        else {
            this.pos.y = padding_top;
        }
        this.life = maxLife;
    };

    // actually show an ellipse at the position
    this.display = function(r){
        ellipse(this.pos.x, this.pos.y, r, r);
    };

    this.setSize = function(x, y) {
        width = x || width;
        height = y || height;
    };
}
