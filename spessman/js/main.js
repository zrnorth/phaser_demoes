var Spessman = Spessman || {}; // create a namespace so we avoid conflicts with other libs

Spessman.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '');
Spessman.game.state.add('Boot', Spessman.Boot);
Spessman.game.state.add('Preload', Spessman.Preload);
Spessman.game.state.add('MainMenu', Spessman.MainMenu);
Spessman.game.state.add('Game', Spessman.Game);

Spessman.game.state.start('Boot');
