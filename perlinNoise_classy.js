// This sketch borrows heavily from yasai's perlin noise sketch
// Tony R. 2018

class PerlinNoise {
    constructor (parentDiv, width, height, seed, numParticles, minLife, maxLife, noiseScale, speed, paddingY, paddingX, backgroundColour, defaultColour, colourL, colourR) { 
        this.parent = parentDiv || false;                               // id of div to be used as parent (false if none)
        this.width = width || windowHeight;                             // width of canvas
        this.height = height || windowHeight;                           // height of canvas
        this.seed = seed || 'cheeses';                                  // seed for use by random() and noise()
        this.nums = numParticles || 100;                                // number of particles to instantiate
        this.minLife = minLife || 0;                                    // minimum life for each particle
        this.maxLife = maxLife || 10;                                   // maximum life for each particle
        this.noiseScale = noiseScale || 200;                            // constant to scale noise with
        this.simulationSpeed = speed || 0.2;                            // constant to scale particle velocities with
        this.fadeFrame = 0;                                             // iterating variable to count frames
        this.padding_top = paddingY || 30;                              // padding on top & bottom of box
        this.padding_side = paddingX || 30;                             // padding on sides of box
        this.particles = [];                                            // array to put particles in
        this.backgroundColor = backgroundColour || color(20, 20, 20);   // background colour
        this.defaultColour = defaultColour || color('white');           // colour for non-coloured particles
        this.color_from = colourR || color('purple');                   // colour for moving right
        this.color_to = colourL || color('cyan');                       // colour for moving left

        this.myCanvas = createCanvas(this.width, this.height);
        if (this.parent) {
            this.myCanvas.parent(this.parent);
        }
        this.element = document.getElementById('p5_loading');
        if (this.element) {
            this.element.parentNode.removeChild(element);
        }

        randomSeed(this.seed);
        noiseSeed(this.seed);

        background(this.backgroundColor);
        
        noStroke();
        smooth();
        
        // generate initial particle locations
        for(var i = 0; i < this.nums; i++){
            var p = new Particle(this.minLife, this.maxLife, this.defaultColour, this.color_to, this.color_from, this.width, this.height, this.padding_side, this.padding_top, this.noiseScale, this.simulationSpeed);
            p.pos.x = random(this.padding_side, this.width-this.padding_side);
            p.pos.y = this.padding_top;
            this.particles[i] = p;
        }
        
        fill(color(255));
    } // end constructor

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
            // (as they are randomly placed this ensures we have an even spread without creating patterns)
            var iterations = map(i,0,this.nums,5,1);
            var radius = map(i,0,this.nums,2,6);
            
            this.particles[i].move(iterations);
            this.particles[i].checkEdge();
            
            var alpha = 255;
            
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
            fill(red(particle_color), green(particle_color), blue(particle_color), alpha * fade_ratio);
            this.particles[i].display(radius);
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth * 0.4, windowHeight);
}

function Particle(minLife, maxLife, defaultColour, colourL, colourR, width, height, padding_side, padding_top, noiseScale, simulationSpeed){
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
            this.respawnTop();
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
            this.respawnTop();
        }
    };
    
    // alternative respawn function where we respawn anywhere in the canvas, not necessarily at the top
    this.respawn = function(){
        this.pos.x = random(0, width);
        this.pos.y = random(0, height);
        this.life = maxLife;
    };
    
    // respawn at the top
    this.respawnTop = function() {
        this.pos.x = random(padding_side, width-padding_side);
        this.pos.y = padding_top;
        this.life = maxLife;
    };

    // actually show an ellipse at the position
    this.display = function(r){
        ellipse(this.pos.x, this.pos.y, r, r);
    };
}