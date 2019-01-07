# Perlin Noise
Based on [this sketch](https://www.openprocessing.org/sketch/566877) by [Tony R](https://www.openprocessing.org/user/77286).

Perlin Noise is a concept invented by Ken Perlin in 1983. It is a method of generating random textures that appear natural, with adjacent inputs giving similar outputs. It is used in many places, from the Minecraft terrain generator to digital art installations.

![An example of Perlin Noise](https://flafla2.github.io/img/2014-08-09-perlinnoise/raw2d.png)

This p5js sketch, at its core, uses Perlin Noise to direct the particles moving around the canvas, causing them to follow organic shapes (as well as each other) without any communication between particles. The shapes generated can be changed by providing a numeric 'seed' from which the Perlin Noise derives its structure.

&nbsp;

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

Alongside this code you'd also need to import p5js and the sketch yourself using HTML `<script>` tags, for example:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.2/p5.min.js"></script>
<script src="perlinNoise.js"></script>
```

In the `setup()` function we call `createCanvas(800, 800)` so the sketch has somewhere to draw (specifically a p5js canvas with dimensions of 800px by 800px). We then initialise the class, with no parameters. This means it will resort to its defaults, as described below.

Then, we add to the p5 `draw()` function (which runs every frame) the `draw()` function associated with the sketch. This allows the sketch to generate animated graphics frame-by-frame.

&nbsp;

## Parameters

Below is the parameter order for a `PerlinNoise` definition.

`PerlinNoise(`[`renderer`](###-`renderer`)`,`[`seed`](###-`seed`)`,`[`numParticles`](###-`numParticles`)`,`[`mode`](###-`mode`)`,`[`minLife`](###-`minLife`)`,`[`maxLife`](###-`maxLife`)`,`[`noiseScale`](###-`noiseScale`)`,`[`simulationSpeed`](###-`simulationSpeed`)`,`[`paddingY`](###-`paddingY`)`,`[`paddingX`](###-`paddingX`)`,`[`defaultColour`](###-`defaultColour`)`,`[`colourL`](###-`colourL`)`,`[`colourR`](###-`colourR`)`);`

All parameters are optional. To omit a parameter, simply put `undefined` in its place if you need to use a parameter that appears later in the definition.\
All of these parameters (except `renderer`) can be played with in the HTML demo page included with this script.

&nbsp;

### `renderer`
**Used to pass in a [p5.Graphics](https://p5js.org/reference/#/p5.Graphics) object for the sketch to render to.**\
Default: p5 global default canvas\
Recommended range: Existing [p5.Graphics](https://p5js.org/reference/#/p5.Graphics) objects

Passing no value will cause the sketch to render to the global p5 canvas (ie the one created with a simple `createCanvas()` statement) if one has been defined.

&nbsp;

### `seed`
**The seed for use by the Perlin Noise generator.**\
Default: 1337\
Recommended range: Any number

&nbsp;

### `numParticles`
**The number of particles to show.**\
Default: 100\
Recommended range: 50-1000

More particles looks prettier but will perform slower. Using a larger canvas, smaller padding or [mode](###-`mode`) 1 may require more particles to properly fill the drawing area.

&nbsp;

### `mode`
**The mode to use when spawning particles.**\
Default: 0\
Recommended range: 0-1

Mode 0 will spawn particles only at the top of the sketch (as in the original project) but 1 will spawn them anywhere in the top 70% of the canvas (As the particles tend to travel downwards, weighting their spawnpoints upwards provides an even coverage of the canvas).

&nbsp;

### `minLife`
**The minimum life for a particle, measured in seconds.**\
Default: 0\
Recommended range: 0-20, less than [`maxLife`](###-`maxLife`)

&nbsp;

### `maxLife`
**The maximum life for a particle, measured in seconds.**\
Default: 10\
Recommended range: 0-20, more than [`minLife`](###-`minLife`)

&nbsp;

### `noiseScale`
**The scale of the Perlin Noise relative to the pixels on your screen.**\
Default: 200\
Recommended range: 100-500

A smaller scale will produce more intricate patterns, where a larger one will result in larger, less detailed patterns.

&nbsp;

### `simulationSpeed`
**The speed that particles should travel at.**\
Default: 0.2\
Recommended range: 0.05-0.3

Higher speeds will cause particle trails to look less consistent, and extremely high speeds make the sketch into an incoherent mess of dots.

&nbsp;

### `paddingY`
**The padding to put around the inside of the top and bottom of the canvas in pixels.**\
Default: 30\
Recommended range: 10-100

&nbsp;

### `paddingX`
**The padding to put around the inside of the left and right sides of the canvas in pixels.**\
Default: 30\
Recommended range: 10-100

&nbsp;

### `defaultColour`
**The colour that non-coloured particles should have.**\
Default: White\
Recommended range: Light colours

Each time a particle spawns, it has a 1/3 chance to be a coloured particle. This is the colour to use for 'default' non-coloured particles.

&nbsp;

### `colourL`
**The colour that coloured particles should have when going left.**\
Default: Cyan\
Recommended range: Bright colours that complement [`colourR`](###-`colourR`)

&nbsp;

### `colourR`
**The colour that coloured particles should have when going right.**\
Default: Purple\
Recommended range: Bright colours that complement [`colourL`](###-`colourL`)

&nbsp;

&nbsp;

## Functions

The `PerlinNoise` class comes with three non-constructor functions:
- [`draw(renderer)`](###-`draw(renderer)`)
- [`setParameter(name, value)`](###-`setParameter(name,-value)`)
- [`getParameter(name)`](###-`getParameter(name)`)

They can all be called using `objectName.functionName(parameters)`.\
For example, the `noiseScale` of a `PerlinNoise` object called `pNoise` would be returned by `pNoise.getParameter('noiseScale')`.

&nbsp;

### `draw(renderer)`
**Runs every frame; updates the sketch.**
- `renderer`: The renderer to render the sketch on.
    - Type: [p5.Graphics](https://p5js.org/reference/#/p5.Graphics)
    - Requirement: Optional

When no renderer is given, the sketch will be rendered on the default canvas.\
If a renderer has already been given in the class constructor, it is not strictly necessary to include it again in the `draw()` function.

&nbsp;

### `setParameter(name, value)`
**Setter for all parameters.**
- `name`: The name of the parameter to set.
    - Type: String
    - Requirement: Required<br><br>
- `value`: The value to set that parameter to.
    - Type: Dependent on `name`
    - Requirement: Required

This function allows all parameters that are set in the constructor (except [`renderer`](###-`renderer`)) to be changed on the fly. Changes should be made instantly, without any need to restart the sketch.

Variables that can be changed:

| `name`              | Type expected in `value` |
| ------------------- | ------------------------ |
| `'seed'`            | Number                   |
| `'numParticles'`    | Number                   |
| `'mode'`            | Number                   |
| `'minLife'`         | Number                   |
| `'maxLife'`         | Number                   |
| `'noiseScale'`      | Number                   |
| `'simulationSpeed'` | Number                   |
| `'paddingY'`        | Number                   |
| `'paddingX'`        | Number                   |
| `'defaultColour'`   | String*                  |
| `'colourL'`         | String*                  |
| `'colourR'`         | String*                  |

*Colours are compatible with all colour formats supported by the [p5 `color()` function](https://p5js.org/reference/#/p5/color), formatted as a string (eg `color(255, 255, 255)` → `'255, 255, 255'`)

&nbsp;

### `getParameter(name)`
**Getter for all parameters.**
- `name`: The name of the parameter to set.
    - Type: String
    - Requirement: Required

This function will return the value in the parameter given in `name`. Unlike `setParameter()` it also can deal with the `renderer` variable.

Variables that can be got:

| `name`              | Type returned                                           |
| ------------------- | ------------------------------------------------------- |
| `'renderer'`        | [`p5.Graphics`](https://p5js.org/reference/#/p5.Graphics) |
| `'seed'`            | Number                                                  |
| `'numParticles'`    | Number                                                  |
| `'mode'`            | Number                                                  |
| `'minLife'`         | Number                                                  |
| `'maxLife'`         | Number                                                  |
| `'noiseScale'`      | Number                                                  |
| `'simulationSpeed'` | Number                                                  |
| `'paddingY'`        | Number                                                  |
| `'paddingX'`        | Number                                                  |
| `'defaultColour'`   | [`p5.Color`](https://p5js.org/reference/#/p5.Color)     |
| `'colourL'`         | [`p5.Color`](https://p5js.org/reference/#/p5.Color)     |
| `'colourR'`         | [`p5.Color`](https://p5js.org/reference/#/p5.Color)     |