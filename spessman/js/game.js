var Spessman = Spessman || {};

Spessman.Game = function() {};

Spessman.Game.prototype = {
    create: function() {
        // Set world dimensions
        this.game.world.setBounds(0, 0, 1920, 1920);
        this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'space');

        // Create player
        this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'playership');
        this.player.scale.setTo(2);
        this.player.animations.add('fly', [0, 1, 2, 3], 5, true);
        this.player.animations.play('fly');

        // Set score
        this.playerScore = 0;

        // Set physics
        this.game.physics.arcade.enable(this.player);
        this.playerSpeed = 120;
        this.player.body.collideWorldBounds = true;

        // Get the game sounds
        this.explosionSound = this.game.add.audio('explosion');
        this.collectSound = this.game.add.audio('collect');

        // Create some asteroids and collectables
        this.generateAsteroids();
        this.generateCollectables();

    },

    update: function() {
        if (this.game.input.activePointer.justPressed()) {
            // move in the dir of the input
            this.game.physics.arcade.moveToPointer(this.player, this.playerSpeed);
        }
        // make sure camera follows player
        this.game.camera.follow(this.player);

        // If player hits an asteroid, should track collision
        this.game.physics.arcade.collide(this.player, this.asteroids, this.hitAsteroid, null, this);

        // if player picks up a collectable, should delete collectable and update score
        this.game.physics.arcade.overlap(this.player, this.collectables, this.collect, null, this);
    },

    generateAsteroids: function() {
        this.asteroids = this.game.add.group();
        this.setObjectPhysics(this.asteroids);

        // Create an rng for each asteroid to determine its movement.
        var numAsteroids = this.game.rnd.integerInRange(150, 200);
        var asteroid;

        for (var i = 0; i < numAsteroids; i++) {
            // first create the sprite
            asteroid = this.asteroids.create(this.game.world.randomX, this.game.world.randomY, 'rock');
            asteroid.scale.setTo(this.game.rnd.integerInRange(10, 40)/10); // 1.0f - 4.0f

            // now set physics
            asteroid.body.velocity.x = this.game.rnd.integerInRange(-20, 20);
            asteroid.body.velocity.y = this.game.rnd.integerInRange(-20, 20);
            asteroid.body.immovable = true;
            asteroid.body.collideWorldBounds = true;
        }
    },

    generateCollectables: function() {
        this.collectables = this.game.add.group();
        this.setObjectPhysics(this.collectables);
        
        var numCollectables = this.game.rnd.integerInRange(100, 150);
        var collectable;

        for (var i = 0; i < numCollectables; i++) {
            collectable = this.collectables.create(this.game.world.randomX, this.game.world.randomY, 'power');
            collectable.animations.add('fly', [0, 1, 2, 3], 5, true);
            collectable.animations.play('fly');
        }
    },

    // helper to handle setting physics
    setObjectPhysics: function(objects) {
        objects.enableBody = true;
        objects.physicsBodyType = Phaser.Physics.ARCADE;
    },

    hitAsteroid: function(player, asteroid) {
        this.explosionSound.play();

        // Player explodes
        var emitter = this.game.add.emitter(this.player.x, this.player.y, 100);
        emitter.makeParticles('playerParticle');
        emitter.minParticleSpeed.setTo(-200, -200);
        emitter.maxParticleSpeed.setTo(200, 200);
        emitter.gravity = 0;
        emitter.start(true, 1000, null, 100);
        this.player.kill();

        // In 0.8sec, call gameOver 
        this.game.time.events.add(800, this.gameOver, this);
    },

    collect: function(player, collectable) {
        this.collectSound.play();
        this.playerScore++;
        collectable.kill();
    },

    gameOver: function() { // return to main menu
        this.game.state.start('MainMenu', true, false);
    }
};
