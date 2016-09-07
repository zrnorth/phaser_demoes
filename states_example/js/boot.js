// This state simply starts the physics system and then calls the load state.

var bootState = {
    create: function() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.state.start('load');
    }
};
