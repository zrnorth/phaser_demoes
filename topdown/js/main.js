var TopDown = TopDown || {};

TopDown.game = new Phaser.Game(240, 240, Phaser.AUTO, '');

TopDown.game.state.add('Boot', TopDown.Boot);
TopDown.game.state.add('Preload', TopDown.Preload);
TopDown.game.state.add('Game', TopDown.Game);

// Boot the game
TopDown.game.state.start('Boot');
