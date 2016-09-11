var TopDown = TopDown || {};

TopDown.Boot = function() {};

// Setting game config and loading assets for loading screen
TopDown.Boot.prototype = {
    preload: function() {
        this.load.image('preloadbar', 'assets/images/preloader-bar.png');
    },
    create: function() {
        this.game.stage.backgroundColor = "#fff";

        // show as large as the game can in the browser space
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        // center game
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        // startup physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // Done booting, go to preload
        this.state.start('Preload');
    }
};
