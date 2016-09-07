var menuState = {
    create: function() {
        game.stage.backgroundColor = '#ffffff';
        var header = game.add.text(20, 20, 'Wlecom to flap brid', {
            font: '25px Arial',
            fill: '#000000'
        });
        var startGame = game.add.text(20, game.world.height - 80, 'Press w to start', {
            font: '25px Arial',
            fill: '#000000'
        });
        var hardMode = game.add.text(20, game.world.height - 40, 'Press h for hard', {
            font: '25px Arial',
            fill: '#000000'
        });
        var wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        wKey.onDown.addOnce(this.startEasy, this);
        var hKey = game.input.keyboard.addKey(Phaser.Keyboard.H);
        hKey.onDown.addOnce(this.startHard, this);
    },
    startEasy: function() {
        game.state.start('game', true, false, {
            'hard': false
        });
    },
    startHard: function() {
        game.state.start('game', true, false, {
            'hard': true
        });
    },
}
