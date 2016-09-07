// This state is called after booting, it loads the assets for the game.
// When finished it calls the menu state
var loadState = {
    preload: function() {
        var loadingLabel = game.add.text(80, 150, 'Loading...', {
            font: '30px Courier',
            fill: '#ffffff'
        });
        game.load.image('player', 'assets/player.png');
        game.load.image('win', 'assets/win.png');
    },
    create: function() {
        game.state.start('menu');
    }
}
