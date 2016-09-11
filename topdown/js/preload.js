var TopDown = TopDown || {};

TopDown.Preload = function(){};

TopDown.Preload.prototype = {
    preload: function() {
        // Loading screen
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
        this.preloadBar.anchor.setTo(0.5);

        this.load.setPreloadSprite(this.preloadBar);

        // load all the assets
        this.load.tilemap('level1', 'assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('gameTiles', 'assets/images/tiles.png');
        this.load.image('door', 'assets/images/door.png');
        this.load.image('heart', 'assets/images/heart.png');
        this.load.image('needle', 'assets/images/needle.png');
        this.load.image('shroom', 'assets/images/shroom.png');

        // loading player w/ walking animations
        this.load.spritesheet('player', 'assets/images/player.png', 16, 16);
    },
    create: function() {
        this.state.start('Game'); // done loading, go to game
    }
};
