var game = new Phaser.Game(400, 490);
game.state.add('menu', menuState);
game.state.add('game', gameState);
game.state.start('menu');
