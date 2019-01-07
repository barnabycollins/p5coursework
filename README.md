# Perlin Noise
Perlin Noise is a concept invented by Ken Perlin in 1983. It is a method of generating random textures that appear natural, with adjacent inputs giving similar outputs. It is used in many places, from the Minecraft terrain generator to digital art installations.

![An example of Perlin Noise](https://flafla2.github.io/img/2014-08-09-perlinnoise/raw2d.png)

This p5js sketch, at its core, uses Perlin Noise to direct the particles moving around the canvas, causing them to follow organic shapes (as well as each other) without any communication between particles. The shapes generated can be changed by providing a numeric 'seed' from which the Perlin Noise derives its structure.

## A basic implementation
The simplest possible JS implementation of this sketch would be the following:

```javascript
var pNoise;

function setup() {
    createCanvas(800, 800);
    pNoise = new PerlinNoise();
}

function draw() {
    pNoise.draw();
}
```

Alongside this code you'd also need to import p5js and the sketch yourself using `<script>` tags, for example:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.2/p5.min.js"></script>
<script src="perlinNoise.js"></script>
```

In the `setup()` function we call `createCanvas(800, 800)` so the sketch has somewhere to draw (specifically a p5js canvas with dimensions of 800px by 800px). We then initialise the class, with no parameters. This means it will resort to its defaults, as described below.

Then, we add to the p5 `draw()` function (which runs every frame) the `draw()` function associated with the sketch. This allows the sketch to generate animated graphics frame-by-frame.

## Documentation
### Parameters

```javascript
PerlinNoise(renderer, seed, numParticles, mode, minLife, maxLife, noiseScale, simulationSpeed, paddingY, paddingX, defaultColour, colourL, colourR);
```

All parameters are optional. To omit a parameter, simply put `undefined` in its place if you need to use a parameter that appears later in the definition.

### `renderer`
**Used to pass in a p5.Renderer object for the sketch to render to.**\
Default: p5 global default canvas\
Recommended range: N/A

Passing no value will cause the sketch to render to the global p5 canvas (ie the one created with a simple `createCanvas()` statement) if one has been defined.


### `seed`
**The seed for use by the Perlin Noise generator.**\
Default: 1337\
Recommended range: Any number


### `numParticles`
**The number of particles to show.**\
Default: 100\
Recommended range: 50-1000

More particles looks prettier but will perform slower. Using a larger canvas, smaller padding or [mode](###-`mode`) 1 may require more particles to properly fill the drawing area.


### `mode`
**The mode to use when spawning particles.**\
Default: 0\
Recommended range: 0-1

Mode 0 will spawn particles only at the top of the sketch (as in the original project) but 1 will spawn them anywhere in the top 70% of the canvas (As the particles tend to travel downwards, weighting their spawnpoints upwards provides an even coverage of the canvas).


### `minLife`
**The minimum life for a particle, measured in seconds.**\
Default: 0\
Recommended range: 0-20, less than [`maxLife`](###-`maxLife`)


### `maxLife`
**The maximum life for a particle, measured in seconds.**\
Default: 10\
Recommended range: 0-20, more than [`minLife`](###-`minLife`)


### `noiseScale`
**The scale of the Perlin Noise relative to the pixels on your screen.**\
Default: 200\
Recommended range: 100-500

A smaller scale will produce more intricate patterns, where a larger one will result in larger, less detailed patterns.


### `simulationSpeed`
**The speed that particles should travel at.**\
Default: 0.2\
Recommended range: 0.05-0.3

Higher speeds will cause particle trails to look less consistent, and extremely high speeds make the sketch into an incoherent mess of dots.


### `paddingY`
**The padding to put around the inside of the top and bottom of the canvas in pixels.**\
Default: 30\
Recommended range: 10-100


### `paddingX`
**The padding to put around the inside of the left and right sides of the canvas in pixels.**\
Default: 30\
Recommended range: 10-100


### `defaultColour`
**The colour that non-coloured particles should have.**\
Default: White\
Recommended range: Light colours

Each time a particle spawns, it has a $1/3$ chance to be a coloured particle. This is the colour to use for 'default' non-coloured particles.


### `colourL`
**The colour that coloured particles should have when going left.**\
Default: Cyan\
Recommended range: Bright colours that complement [`colourR`](###-`colourR`)


### `colourR`
**The colour that coloured particles should have when going right.**\
Default: Purple\
Recommended range: Bright colours that complement [`colourL`](###-`colourL`)


| Parameter | Description | Default | Recommended range |
| --------- | ----------- | ------- | ----------------- |
| `renderer` | Used to pass in a p5.Renderer object for the sketch to render to. | p5 global default sketch | N/A |
| `seed` | The seed for use by the Perlin Noise generator. | 1337 | Any number |
| `numParticles` | The number of particles to show. More particles is prettier, but will perform worse. | 100 | 50-1000 |
| `mode` | The mode for particle spawning: 0 spawns particles only at the top of the canvas, where 1 spawns them anywhere in the top 70%*. | 0 | 0-1 |
| `minLife` | The minimum life for a particle, measured in seconds. | 0 | 0-20, less than `maxLife` |
| `maxLife` | The maximum life for a particle, measured in seconds. | 10 | 0-20, more than `minLife` |
| `noiseScale` | The scale of the Perlin Noise relative to the pixels on your screen. | 200 | 100-500 |
| `simulationSpeed` | The speed that particles should travel at. Setting a higher speed may cause particle trails to look less consistent. | 0.2 | 0.05-0.3 |
| `paddingX` | The padding to surround the vertical inner edges of the canvas with. | 30 | 10-100 |
| `paddingY` | The vertical padding to surround the horizontal inner edges of the canvas with. | 30 | 10-100 |
| `defaultColour` | The colour that non-coloured particles should have. | White | Light colours |
| `colourL` | The colour that coloured particles should have when going left. | Cyan | Bright colours |
| `colourR` | The colour that coloured particles should have when going right. | Purple | Bright colours |
*\*The reason to spawn particles in only the top 70% is that they have a tendency to travel downwards, so spawning them across the full range of the page leaves the top looking empty.*