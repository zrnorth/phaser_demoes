var game = new Phaser.Game(1024, 512, Phaser.AUTO, 'game');

var PhaserGame = function(game) {
    this.map = null;
    this.backgroundLayer = null;
    this.wallsLayer = null;
    this.car = null;

    this.safetile = 1;
    this.gridsize = 32;
};

PhaserGame.prototype = {

    init: function() {
        this.physics.startSystem(Phaser.Physics.ARCADE);
    },

    preload: function() {
        // Load the tileset and map
        this.load.tilemap('road', 'assets/tilemap/roads.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', 'assets/images/tiles.png');
        this.load.image('car', 'assets/images/car.png');
    },

    create: function() {
        // Create map + tiles
        this.map = this.add.tilemap('road');
        this.map.addTilesetImage('tiles', 'tiles'); // first is the name in Tiled, second is the loader image key.
        this.backgroundLayer = this.map.createLayer('background');
        // Add collisions for walls
        this.wallsLayer = this.map.createLayer('walls');

        this.map.setCollision(100, true, this.wallsLayer);
        
        // Create car
        var playerSpawn = this.map.objects['objects'][0]; // only object on map lol
        this.car = this.add.sprite(playerSpawn.x, (playerSpawn.y - this.map.tileHeight) /* tiled measures from bot left*/, 'car');
        this.physics.arcade.enable(this.car);

        // Create cursors
        this.cursors = this.input.keyboard.createCursorKeys();
    },

    update: function() {
        this.physics.arcade.collide(this.car, this.wallsLayer);
    },
};

game.state.add('Game', PhaserGame, true);
