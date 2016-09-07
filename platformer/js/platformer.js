var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

// Globals
var player, baddies, diamond, stars;
var platforms;

// Keep track of the score in the game
var score = 0;
var scoreText;
// Keep track of number of stars left to collect and baddies
var NUM_BADDIES = 2;
var NUM_STARS = 12;

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.image('diamond', 'assets/diamond.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32);
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0,0,'sky');
    platforms = game.add.group(); // ground + 2 ledges
    platforms.enableBody = true;  // physics enabled for the platform

    // Create platforms
    var ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.scale.setTo(2, 2); 
    ground.body.immovable = true;
    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;
    var ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;

    // Create player
    player = game.add.sprite(32, game.world.height - 150, 'dude');
    game.physics.arcade.enable(player);
    // Give the player a slight bounce
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    // Walk left and right anims
    player.animations.add('left', [0, 1, 2, 3], 10, true); // uses anim frams 0-3
    player.animations.add('right', [5, 6, 7, 8], 10, true);// anim frams 5-8. 4 is standing facing forward

    // Create baddies
    baddies = game.add.group();
    baddies.enableBody = true;

    for (var i = 0; i < NUM_BADDIES; i++) {
        var baddie = baddies.create(100 + (i*200), 50, 'baddie');
        baddie.body.gravity.y = 200;
        baddie.body.bounce.y = 0.05;
        baddie.animations.add('left', [0, 1], 10, true);
        baddie.animations.add('right', [2, 3], 10, true);
    }

    // Create stars for collection
    stars = game.add.group();
    stars.enableBody = true;

    for (var i = 0; i < NUM_STARS; i++) {
        var star = stars.create(i*70, 0, 'star');
        star.body.gravity.y = 100;
        star.body.bounce.y = 0.7 + (Math.random() * 0.2);
    }

    // Create diamond for collection
    diamond = game.add.sprite(game.world.width / 2, game.world.height / 2, 'diamond');
    game.physics.arcade.enable(diamond);
    diamond.body.bounce.x = 0.1;
    diamond.body.bounce.y = 0.1;
    diamond.body.collideWorldBounds = true;
    diamond.body.gravity.y = 0;

    // Scoreboard
    scoreText = game.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#000' });
}

function update() {
    // players, baddies, and stars should collide with platforms.
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(baddies, platforms);
    game.physics.arcade.collide(stars, platforms);

    // Baddies should overlap with each other
    game.physics.arcade.collide(baddies, baddies);

    // player should collect a star or diamond if he touches it
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    game.physics.arcade.overlap(player, diamond, collectDiamond, null, this);

    // player should die if he hits a baddie
    game.physics.arcade.overlap(player, baddies, die, null, this);

    // Diamond should move
    var x_delta = player.x - diamond.x;
    var y_delta = player.y - diamond.y;
    var distance = Math.sqrt(x_delta*x_delta + y_delta*y_delta);
    if (distance > 200) {
        diamond.body.velocity.x = -distance / 5;
        diamond.body.velocity.y = distance / 5;
    }
    else { // run away
        diamond.body.velocity.x = 5000 / distance 
        diamond.body.velocity.y = 5000 / -distance;
    }

    // Baddies should move towards player
    for (var i = 0; i < baddies.children.length; i++) {
        var baddie = baddies.children[i];
        if (player.x < baddie.x) {
            baddie.body.velocity.x = -50 * (i+1);
            baddie.animations.play('left');
        }
        else {
            baddie.body.velocity.x = 50 * (i+1);
            baddie.animations.play('right');
        }
    }

    // Get the cursor being held down
    cursors = game.input.keyboard.createCursorKeys();

    player.body.velocity.x = 0;

    if (cursors.left.isDown) {
        player.body.velocity.x = -150;
        player.animations.play('left');
    }
    else if (cursors.right.isDown) {
        player.body.velocity.x = 150;
        player.animations.play('right');
    }
    else { // stand
        player.animations.stop();
        player.frame = 4;
    }

    // Allow jumps
    if (cursors.up.isDown && player.body.touching.down) {
        player.body.velocity.y = -350;
    }
}

// This is called when a player intersects a star.
function collectStar(player, star) {
    star.kill();
    score += 10;
    NUM_STARS -= 1;
    if (NUM_STARS > 0) {
        scoreText.text = 'Score: ' + score;
    }
    else { // Done
        scoreText.text = 'You win! Final score: ' + score;
        game.paused = true;
    }
}

// This is called when a player intersects a diamond.
function collectDiamond(player, diamond) {
    diamond.kill();
    score += 50;
    scoreText.text = 'Got a diamond!';
}

// Called when player should die
function die(player, baddie) {
    scoreText.text = 'You lose :(';
    game.paused = true;
}
