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
                    if (pV.currentColour==='red') { pV.currentColour='blue'; } else { pV.currentColour='red'; }
                    emitters[1].setFrame(pV.currentColour).stop();
                    emitters[0].setFrame(pV.currentColour).start();
                }
            })
        }
    },

    particles: {
        available: [],
        currentlyRunning: 'infinity',
        currentColour: 'red',

        init: ()=> {
            vars.particles.available.infinity = scene.add.particles('flares');

            vars.particles.available.infinity.createEmitter({
                frame: 'red',
                x: 1920/2,
                y: 1080/2,
                scale: { start: 1, end: 0 },
                blendMode: 'ADD',
                emitZone: { type: 'edge', source: vars.graphics.infinity, quantity: 120 },
                on: true
            });

            vars.particles.available.infinity.createEmitter({
                frame: 'red',
                x: 1920/2,
                y: 1080/2,
                lifespan: 2000, quantity: 1,
                scale: { start: 1, end: 0 },
                blendMode: 'ADD',
                emitZone: { type: 'edge', source: vars.graphics.infinitySmooth },
                on: false
            });
        }
    }
}