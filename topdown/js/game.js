var TopDown = TopDown || {};

TopDown.Game = function() {};

TopDown.Game.prototype = {
    create: function() {
        this.map = this.game.add.tilemap('level1');

        // first param: tileset name from tiled, second: asset key
        this.map.addTilesetImage('tiles', 'gameTiles');
        
        // create layer
        this.backgroundLayer = this.map.createLayer('backgroundLayer');
        this.blockedLayer = this.map.createLayer('blockedLayer');

        // Set collisions on blockedLayer
        this.map.setCollisionBetween(1, 3522, true, 'blockedLayer'); 
        // 100000 = range for all tiles that should enable collision. we want all of em.
        // in theory you could just use 1 layer and define collisions based on
        // their index. Our method uses a different background layer, so the range doesn't matter.

        // Resize to match the background layer size
        this.backgroundLayer.resizeWorld();

        // Spawn the items
        this.createItems();
        this.createDoors();

        this.createPlayer();
    },

    createItems: function() {
        this.items = this.game.add.group();
        this.items.enableBody = true;
        var result = this.findObjectsByType('item', this.map, 'objectsLayer');
        result.forEach(function(element) {
            this.createFromTiledObject(element, this.items);  
        }, this); 
        // need the final 'this' in forEach so the interior 'this' call has our object context.
        // without it, this.createFromTiledObject would refer to the js context's this
    },

    createDoors: function() {
        this.doors = this.game.add.group();
        this.doors.enableBody = true;
        var result = this.findObjectsByType('door', this.map, 'objectsLayer');

        result.forEach(function(element) {
            this.createFromTiledObject(element, this.doors);
        }, this)
    },

    createPlayer: function() {
        var result = this.findObjectsByType('playerStart', this.map, 'objectsLayer');
        // There should only ever be one result, obviously
        this.player = this.game.add.sprite(result[0].x, result[0].y, 'player', 4);

        // Add player animations
        this.player.animations.add('up', [0, 1, 2, 3], 10, true);
        this.player.animations.add('down', [4, 5, 6, 7], 10, true);
        this.player.animations.add('left', [8, 9, 10, 11], 10, true);
        this.player.animations.add('right', [12, 13, 14, 15], 10, true);

        // Add physics and camera
        this.game.physics.arcade.enable(this.player);
        this.game.camera.follow(this.player);
        // Add controls
        this.cursors = this.game.input.keyboard.createCursorKeys();
    },

    // Find objects in a tiled layer that contain {"type": value}
    findObjectsByType: function(type, map, layerName) {
        var result = new Array();
        map.objects[layerName].forEach(function(element) {
            if (element.properties.type === type) {
                // Phaser uses top left, tiled bottom left. so adjust y pos.
                element.y -= map.tileHeight;
                result.push(element);
            }
        });
        return result;
    },

    // Create a sprite from an object
    createFromTiledObject: function(element, group) {
        var sprite = group.create(element.x, element.y, element.properties.sprite);

        // copy all props to the sprite
        Object.keys(element.properties).forEach(function(key) {
            sprite[key] = element.properties[key];
        });
    },

    update: function() {
        // Player movement
        this.player.body.velocity.x = this.player.body.velocity.y = 0;
        var animationIsPlaying = false;

        if (this.cursors.left.isDown) {
            this.player.body.velocity.x -= 50;
            if (!animationIsPlaying) {
                this.player.animations.play('left');
                animationIsPlaying = true;
            }
        }
        if (this.cursors.right.isDown) {
            this.player.body.velocity.x += 50;
            if (!animationIsPlaying) {
                this.player.animations.play('right');
                animationIsPlaying = true;
            }
        }
        if (this.cursors.up.isDown) {
            this.player.body.velocity.y -= 50;
            if (!animationIsPlaying) {
                this.player.animations.play('up');
                animationIsPlaying = true;
            }
        }
        if (this.cursors.down.isDown) {
            this.player.body.velocity.y += 50;
            if (!animationIsPlaying) {
                this.player.animations.play('down');
                animationIsPlaying = true;
            }
        }

        // if all else down, stop animations.
        if (this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0) {
            this.player.animations.stop();
        }

        // Collisions
        this.game.physics.arcade.collide(this.player, this.blockedLayer);
        this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
        this.game.physics.arcade.overlap(this.player, this.doors, this.enterDoor, null, this);
    },

    collect: function(player, collectable) {
        console.log("yummy!");
        collectable.destroy();
    },
    enterDoor: function(player, door) {
        console.log("Entering this door will take you to " + door.targetTilemap + " to coords: (" + door.targetX + ", " + door.targetY + ").");
    },
};
