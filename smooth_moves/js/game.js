var game = new Phaser.Game(1024, 512, Phaser.AUTO, 'game');

var PhaserGame = function(game) {
    this.map = null;
    this.backgroundLayer = null;
    this.wallsLayer = null;
    this.car = null;

    this.safetile = -1; // Tile indeces that are blank in our walls layer show up as -1
    this.gridsize = 32; //32x32px

    this.speed = 150;

    this.marker = new Phaser.Point();    // car's location for calcs
    this.turnPoint = new Phaser.Point(); // we store the point at which we want to change dir here.

    this.directions = [null, null, null, null, null]; // 1 extra bc 1-indexed.
    this.opposites = [ Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP ];

    this.current = Phaser.NONE;
    this.turning = Phaser.NONE;
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

        this.map.setCollisionBetween(1, 1000, true, this.wallsLayer); // as 0 indicates "free" space
        
        // Create car
        var playerSpawn = this.map.objects['objects'][0]; // only object on map lol
        this.car = this.add.sprite(playerSpawn.x, (playerSpawn.y - this.map.tileHeight) /* tiled measures from bot left*/, 'car');
        this.physics.arcade.enable(this.car);

        // Create cursors
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Move down
        this.move(Phaser.UP);
    },

    update: function() {
        this.physics.arcade.collide(this.car, this.wallsLayer);
        // Need to find out where the car is on grid.
        // Do this by calling math.snapToFloor on the floor of the decimal 
        // representation of our car's position. This gives the grid position.
        this.marker.x = this.math.snapToFloor(Math.floor(this.car.x), 32) / 32;
        this.marker.y = this.math.snapToFloor(Math.floor(this.car.y), 32) / 32;

        var i = this.wallsLayer.index;
        var x = this.marker.x;
        var y = this.marker.y;

        this.directions[Phaser.LEFT] = this.map.getTileLeft(i, x, y);
        this.directions[Phaser.RIGHT] = this.map.getTileRight(i, x, y);
        this.directions[Phaser.UP] = this.map.getTileAbove(i, x, y);
        this.directions[Phaser.DOWN] = this.map.getTileBelow(i, x, y);
    },

    // move the car
    move: function(direction) {
        var speed = this.speed;
        if (direction === Phaser.LEFT || direction === Phaser.UP) {
            speed = -speed;
        }

        if (direction === Phaser.LEFT || direction == Phaser.RIGHT) {
            this.car.body.velocity.x = speed;
        }
        else {
            this.car.body.velocity.y = speed;
        }

        this.current = direction;
    },

    // Check if we can turn this way. Can't turn into walls.
    // Moves the car if you can, and does nothing if you cannot turn.
    checkDirection: function(turnTo) {
        if (                 this.turning === turnTo ||         // Already turning that way.
                  this.directions[turnTo] === null ||           // No tile where you want to turn
            this.directions[turnTo].index !== this.safetile) {  // Tile is a wall
            
                return; // do nothing.
        }

        // If you want to turn around and can, do that
        if (this.current === this.opposites[turnTo]) {
            this.move(turnTo);
        }
        // If you want to turn sideways, set the turnpoints
        else { 
            this.turning = turnTo;
            this.turnPoint.x = (this.marker.x * this.gridsize) + (this.gridsize / 2);
            this.turnPoint.y = (this.marker.y * this.gridsize) + (this.gridsize / 2);
        }
    },

    // render: creates an overlay on the game tiles.
    // We want to manually show which tiles the car thinks is "safe"
    render: function() {
        for (var t = 1; t < 5; t++) {
            if (this.directions[t] === null) continue;

            var color = 'rgba(0,255,0,0.3)'; // green

            if (this.directions[t].index !== this.safetile) { // can't turn that way
                color = 'rgba(255,0,0,0.3)'; //red
            }

            if (t === this.current) { // The next tile we are moving towards
                color = 'rgba(255,255,255,0.3)'; // white
            }

            this.game.debug.geom(new Phaser.Rectangle(this.directions[t].worldX, this.directions[t].worldY, 32, 32), color, true);
        }
        this.game.debug.geom(this.turnPoint, '#ffff00');
    }
};

game.state.add('Game', PhaserGame, true);
