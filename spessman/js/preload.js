var Spessman = Spessman || {};

Spessman.Preload = function() {};

Spessman.Preload.prototype = {
    preload: function() {
        // Show logo in loading screen
        this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        this.splash.anchor.setTo(0.5);

        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadBar');
        this.splash.anchor.setTo(0.5);

        this.load.setPreloadSprite(this.preloadBar);// auto sizes in realtime!
        // Now load game assets
        this.load.image('space', 'assets/images/space.png');
        this.load.image('rock', 'assets/images/rock.png');
        this.load.image('playerParticle', 'assets/images/player-particle.png');
        this.load.spritesheet('playership', 'assets/images/player.png', 12, 12);
        this.load.spritesheet('power', 'assets/images/power.png', 12, 12);
        this.load.audio('collect', 'assets/audio/collect.ogg');
        this.load.audio('explosion', 'assets/audio/explosion.ogg');
    },
    create: function() {
        // go to menu state
        this.state.start('MainMenu');
    }
}
