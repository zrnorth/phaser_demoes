var Spessman = Spessman || {};

Spessman.Boot = function() {};

Spessman.Boot.prototype = {
    preload: function() {
        // Get assets for loading screen
        this.load.image('logo', 'assets/images/logo.png');
        this.load.image('preloadBar', 'assets/images/preloader-bar.png');
    },
    create: function() {
        // set white bg
        this.game.stage.backgroundColor = '#ffffff';
        
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.minWidth = 240;
        this.scale.minHeight = 170;
        this.scale.maxWidth = 2880;
        this.scale.maxWidth = 1920;

        // center horizontally
        this.scale.pageAlignHorizontally = true;
        this.scale.updateLayout();

        // physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // transition to the preload state
        this.state.start('Preload');     
    },
};
