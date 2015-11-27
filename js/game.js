var gameProperties = {
    screenWidth: 640,
    screenHight: 480,
};

var states = {
    game: 'game',
};

var graphicAssets = {
    ship: {URL: 'assets/ship.png', name: 'ship'},
    bullet: {URL: 'assets/bullet.png', name: 'bullet'},
    asteroidLarge: {URL: 'assets/asteroidLarge.png', name: 'asteroidLarge'},
    asteroidMedium: {URL: 'assets/asteroidMedium.png', name: 'asteroidMedium'},
    asteroidSmall: {URL: 'assets/asteroidSmall.png', name: 'asteroidSmall'},
};

var gameState = function(game){
    this.shipSprite;
};

var shipProperties = {
    startX: gameProperties.screenWidth * 0.5,
    startY: gameProperties.screenHight * 0.5,
};


gameState.prototype = {
     
    preload: function(){
        game.load.image(graphicAssets.asteroidLarge.name, graphicAssets.asteroidLarge.URL);
        game.load.image(graphicAssets.asteroidMedium.name, graphicAssets.asteroidMedium.URL);
        game.load.image(graphicAssets.asteroidSmall.name, graphicAssets.asteroidSmall.URL);
        game.load.image(graphicAssets.ship.name, graphicAssets.ship.URL);
        game.load.image(graphicAssets.bullet.name, graphicAssets.bullet.URL);
    },

    create: function(){
        this.initGraphics();
    
    },

    update: function(){},

    initGraphics: function(){
        this.shipSprite = game.add.sprite(shipProperties.startX, shipProperties.startY, graphicAssets.ship.name);
        this.shipSprite.angle = -90;
        this.shipSprite.anchor.set(0.5, 0.5);
    },

};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHight, Phaser.AUTO, 'gameDiv');
game.state.add(states.game, gameState);
game.state.start(states.game);
