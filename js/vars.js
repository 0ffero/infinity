var scene;
var vars = {
    version: 0.1,
    canvas: {
        width: 1920, height: 1080, cX: 1920/2, cY: 1080/2,
    },

    graphics: {
        infinity: {
            getPoints: function (quantity, stepRate) {
                if (!stepRate) {
                    stepRate = Phaser.Math.PI2 / quantity;
                }

                var input = Phaser.Utils.Array.NumberArrayStep(0, Phaser.Math.PI2, stepRate);
                let infinityPoints = [];
                for (let t=0; t<input.length; t++) {
                    let scale = 2 / (3 - Math.cos(2*t));
                    let x = ~~(scale * Math.cos(t) * 4000)/10;
                    let y = ~~(scale * Math.sin(2*t)/2*4000)/10;
                    infinityPoints.push(new Phaser.Geom.Point(x,y));
                }
                return infinityPoints;
            }
        },

        infinitySmooth: {
            getPoints: function () {
                let infinityPoints = [];
                for (let t=0; t<Phaser.Math.PI2; t+=0.1) {
                    let scale = 2 / (3 - Math.cos(2*t));
                    let x = ~~(scale * Math.cos(t) * 4000)/10;
                    let y = ~~(scale * Math.sin(2*t)/2*4000)/10;
                    infinityPoints.push(new Phaser.Geom.Point(x,y));
                }
                return infinityPoints;
            }
        }
    },

    input: {
        init: ()=> {
            scene.input.on('pointerdown', function (pointer) {
                let pV = vars.particles;
                let emitters = pV.available.infinity.emitters.list;
                if (pV.currentlyRunning==='infinity') {
                    pV.currentlyRunning='infinitySmooth';
                    emitters[0].stop();
                    emitters[1].start();
                } else {
                    pV.currentlyRunning='infinity';
                    let newColour = pV.currentColour.splice(0,1);
                    pV.currentColour.push(newColour);
                    emitters[1].setFrame(newColour).stop();
                    emitters[0].setFrame(newColour).start();
                }
            })
        }
    },

    phaserObject: {
        infinity: {
            getRandomPoint: function (vec) {
                let x; let y; let pixel;
                do {
                    x = Phaser.Math.Between(0, 533);
                    y = Phaser.Math.Between(0, 237);
                    pixel = scene.textures.getPixel(x, y, 'ib', 'infinity');
                } while (pixel.alpha < 255);

                return vec.setTo(x,y);
            }
        },

        beauty: {
            getRandomPoint: function (vec) {
                let x; let y; let pixel;
                do {
                    x = Phaser.Math.Between(0, 513);
                    y = Phaser.Math.Between(0, 231);
                    pixel = scene.textures.getPixel(x, y, 'ib', 'beauty');
                } while (pixel.alpha < 255);

                return vec.setTo(x,y);
            }
        }
    },

    particles: {
        available: [],
        currentlyRunning: 'infinity',
        currentColour: ['red','blue','white'],

        init: ()=> {
            let pV = vars.particles;
            pV.letterSparklesInit();
            pV.available.infinity = scene.add.particles('flares');

            vars.particles.available.infinity.createEmitter({
                frame: pV.currentColour[2],
                x: 1920/2,
                y: 1080/2,
                scale: { start: 1, end: 0 },
                blendMode: 'ADD',
                emitZone: { type: 'edge', source: vars.graphics.infinity, quantity: 120 },
                on: true
            });

            vars.particles.available.infinity.createEmitter({
                frame: pV.currentColour[2],
                x: 1920/2,
                y: 1080/2,
                lifespan: 2000, quantity: 1,
                scale: { start: 1, end: 0 },
                blendMode: 'ADD',
                emitZone: { type: 'edge', source: vars.graphics.infinitySmooth },
                on: false
            });
        },

        letterSparklesInit: ()=> {
            vars.particles.available.letterSparkle = scene.add.particles('flares');

            vars.particles.available.letterSparkle.createEmitter({
                x: vars.canvas.cX-533/2, y: vars.canvas.cY-500,
                quantity: 30, lifespan: 666, gravityY: 1,
                scale: { start: 0, end: 0.5, ease: 'Quad.easeOut' },
                alpha: { start: 1, end: 0, ease: 'Quad.easeIn' },
                blendMode: 'ADD',
                emitZone: { type: 'random', source: vars.phaserObject.infinity }
            });

            vars.particles.available.letterSparkle.createEmitter({
                x: vars.canvas.cX-513/2, y: vars.canvas.cY+300,
                quantity: 30, lifespan: 666, gravityY: 1,
                scale: { start: 0, end: 0.5, ease: 'Quad.easeOut' },
                alpha: { start: 1, end: 0, ease: 'Quad.easeIn' },
                blendMode: 'ADD',
                emitZone: { type: 'random', source: vars.phaserObject.beauty }
            });
        }
    }
}