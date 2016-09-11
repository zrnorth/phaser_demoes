var game = new Phaser.Game(1024, 512, Phaser.AUTO, 'game');

var PhaserGame = function(game) {
    this.map = null;
    this.backgroundLayer = null;
    this.wallsLayer = null;
    this.car = null;

    this.safetile = -1; // Tile indeces that are blank in our walls layer show up as -1
    this.gridsize = 32; //32x32px

    this.speed = 150;
    this.threshold = 3; // for fuzzy position matching. must be within these # of px
    this.turnSpeed = 75; // in ms

    this.marker = new Phaser.Point();    // car's location for calcs
    this.turnPoint = new Phaser.Point(); // we store the point at which we want to change dir here.

    this.directions = [null, null, null, null, null]; // 1 extra bc 1-indexed.
    this.opposites = [ Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP ];

    this.current = Phaser.UP;
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
        // Need to add gridsize/2 to it because we're moving the anchor.
        this.car = this.add.sprite(playerSpawn.x+(this.gridsize/2), playerSpawn.y-this.map.tileHeight+(this.gridsize/2), 'car');
        this.car.anchor.setTo(0.5);
        this.physics.arcade.enable(this.car);

        // Create cursors
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Move down
        this.move(Phaser.DOWN);
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

        // Get player input
        this.checkKeys();

        // If player wants to turn, attempt to turn
        if (this.turning !== Phaser.NONE) {
            this.turn();
        }
    },

    checkKeys: function() {
        if (this.cursors.left.isDown && this.current !== Phaser.LEFT) {
            this.checkDirection(Phaser.LEFT);
        }
        else if (this.cursors.right.isDown && this.current !== Phaser.RIGHT) {
            this.checkDirection(Phaser.RIGHT);
        }
        else if (this.cursors.up.isDown && this.current !== Phaser.UP) {
            this.checkDirection(Phaser.UP);
        }
        else if (this.cursors.down.isDown && this.current !== Phaser.DOWN) {
            this.checkDirection(Phaser.DOWN);
        }
        else { // this prevents turning if no key held down.
            this.turning = Phaser.NONE;
        }
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

        this.add.tween(this.car).to({ angle: this.getAngle(direction)}, this.turnSpeed, "Linear", true);

        this.current = direction;
    },

    // Helper for move(), gets the direction we want to point the car when we turn.
    getAngle: function(to) {
        // Turning around
        if (this.current === this.opposites[to]) {
            return "180";
        }
        if ((this.current === Phaser.UP && to === Phaser.LEFT)    || 
            (this.current === Phaser.LEFT && to === Phaser.DOWN)  || 
            (this.current === Phaser.DOWN && to === Phaser.RIGHT) || 
            (this.current === Phaser.RIGHT && to === Phaser.UP)) {
                return "-90";
        }
        return "90";
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
            // Our ideal turning point is the dead center of the tile we are currently entering.
            // This is where we will begin our turn
            this.turnPoint.x = (this.marker.x * this.gridsize) + (this.gridsize / 2);
            this.turnPoint.y = (this.marker.y * this.gridsize) + (this.gridsize / 2);
        }
    },

    // Perform the turn if we can. Return true if turn performed.
    turn: function() {
        var cx = Math.floor(this.car.x);
        var cy = Math.floor(this.car.y);

        // haven't gotten to the turn point yet. keep going straight til you're there
        if (!this.math.fuzzyEqual(cx, this.turnPoint.x, this.threshold) ||
            !this.math.fuzzyEqual(cy, this.turnPoint.y, this.threshold)) {
            return false;
        }

        // Ready to turn. lock to the turn point
        this.car.x = this.turnPoint.x;
        this.car.y = this.turnPoint.y; 

        this.car.body.reset(this.turnPoint.x, this.turnPoint.y);

        this.move(this.turning);
        this.turning = Phaser.NONE;

        return true;
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
