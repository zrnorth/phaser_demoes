var Spessman = Spessman || {};

Spessman.MainMenu = function(){};

Spessman.MainMenu.prototype = {
    create: function() {
        // Show the space tile and repeat it
        this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');
        this.background.autoScroll(-20, -20);

        // Game text
        var text = "Tap to begin";
        var style = {
            font: "30px Arial",
            fill: "#ffffff",
            align: "center"
        };
        var t = this.game.add.text(this.game.width/2, this.game.height/2, text, style);
        t.anchor.set(0.5);

        // High score text
        text = "Highest score: " + this.highestScore;
        style = {
            font: "15px Arial", 
            fill: "#ffffff",
            align: "center"
        };
        var h = this.game.add.text(this.game.width/2, this.game.height/2 + 50, text, style);
        h.anchor.set(0.5);
    },
    update: function() {
        if (this.game.input.activePointer.justPressed()) {
            this.game.state.start("Game");
        }
    }
};
