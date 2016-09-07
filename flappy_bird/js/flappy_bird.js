// Create the main state to contain the game
var mainState = {
    // Game state functions
    preload: function() {
        // Load bird sprite
        game.load.image('bird', 'assets/bird.png');
        // Load pipe sprite
        game.load.image('pipe', 'assets/pipe.png');
    },
    create: function() {
        // Setup the background and physics.
        game.stage.backgroundColor = '#71c5cf';
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Display the bird
        this.bird = game.add.sprite(100, 245, 'bird');

        // Bird physics
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000;

        // Call 'jump' when spacebar is hit
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        // Display the pipes
        this.pipes = game.add.group();
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this); // new row every 1.5 sec

        // Scoreboard
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", {
            font: "30px Arial",
            fill: "#ffffff"
        });
    },
    update: function() {
        // Kill the game if the bird is off the screen.
        if (this.bird.y < 0 || this.bird.y > 490) {
            this.restartGame();
        }
        // Kill the game if the player hits a pipe
        game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this);
    },
    // Helper functions
    jump: function() {
        this.bird.body.velocity.y = -350;
    },

    addOnePipe: function(x, y) {
        var pipe = game.add.sprite(x, y, 'pipe');
        this.pipes.add(pipe);
        game.physics.arcade.enable(pipe);
        // We add velocity to the pipe to make it move left, towards the bird.
        pipe.body.velocity.x = -200;
        // Delete the pipe when its no longer visible
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },
    // Add a row of pipes. A row consists of 6 pipes with a hole in the middle somewhere.
    addRowOfPipes: function() {
        // Randomly choose the hole position, from (top-1) to (bottom+1).
        // The hole will always be 2 pipes wide, so the range should be from 1-2 to 5-6.
        // So we get a random number from 1-5, and skip holePosition and holePosition+1.
        var holePosition = Math.floor(Math.random()*5 + 1); 

        // Add the pipes, leaving out the position where there should be a hole.
        for (var i = 0; i < 8; i++) {
            if (i != holePosition && i != holePosition+1) {
                var x = 400;
                var y = 60*i + 10;

                this.addOnePipe(x, y);
            }
        }
        // Increment the score
        this.score += 1;
        this.labelScore.text = this.score;
    },
    restartGame: function() {
        game.state.start('main');
    },
};

// Create a new game
var game = new Phaser.Game(400, 490);
game.state.add('main', mainState);
game.state.start('main');
