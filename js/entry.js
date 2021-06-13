var config = {
    type: Phaser.WEBGL,
    backgroundColor: '#000',
    parent: 'infinity',
    scale: {
        parent: 'URFaux',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: vars.canvas.width,
        height: vars.canvas.height,
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload () {
    scene = this;
    scene.load.setPath('assets');
    scene.load.atlas('flares', 'particles/sparks.png', 'particles/sparks.json');
}

function create (){
    let v = vars;
    v.particles.init();
    v.input.init();
}
