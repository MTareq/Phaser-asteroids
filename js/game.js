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

    this.key_left;
    this.key_right;
    this.key_thrust;
    this.key_fire;

    this.bulletGroup;
    this.bulletInterval = 0;

    this.asteroidGroup;
    this.asteroidCount = asteroidProperties.startingAsteroids;
    this.shipLives = shipProperties.startingLives;
    this.tf_lives;
};

var shipProperties = {
    startX: gameProperties.screenWidth * 0.5,
    startY: gameProperties.screenHight * 0.5,
    acceleration: 300,
    drag: 100,
    maxVelocity: 300,
    angularVelocity: 200,
    startingLives: 3,
    timeToReset: 3,
};

var bulletPoperties = {
    speed: 400,
    interval: 250,
    lifespan: 2000,
    maxCount: 30,
};

var asteroidProperties = {
    startingAsteroids: 4,
    maxAsteroids: 20,
    incrementAsteroids: 2,

    asteroidLarge: {minVelocity: 50, maxVelocity: 150, minAngularVelocity: 0, 
                    maxAngualrVelocity: 200, score: 20, 
                    nextSize: graphicAssets.asteroidMedium.name, pieces: 2},
    asteroidMedium: {minVelocity: 50, maxVelocity: 200, minAngularVelocity: 0,
                     maxAngualrVelocity: 200, score: 50, 
                     nextSize: graphicAssets.asteroidSmall.name, pieces: 2},
    asteroidSmall: {minVelocity: 50, maxVelocity: 300, minAngularVelocity: 0, maxAngualrVelocity: 200, score: 100}
};

var fontAssets = {

    counterFontStyle: {font: '20px Arial', fill: '#FFFFFF', align: 'center'},

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
        this.initPhysics();
        this.initKeyboard();
        this.resetAsteroids();
    
    },

    update: function(){
        this.checkPlayerInput();
        this.checkBoundries(this.shipSprite);
        this.bulletGroup.forEachExists(this.checkBoundries, this);
        this.asteroidGroup.forEachExists(this.checkBoundries, this);
        
        game.physics.arcade.overlap(this.bulletGroup, this.asteroidGroup, this.asteroidCollision, null, this);
        game.physics.arcade.overlap(this.shipSprite, this.asteroidGroup, this.asteroidCollision, null, this);
    
    },

    initGraphics: function(){

        this.shipSprite = game.add.sprite(shipProperties.startX, shipProperties.startY, graphicAssets.ship.name);
        this.shipSprite.angle = -90;
        this.shipSprite.anchor.set(0.5, 0.5);
        this.bulletGroup = game.add.group();
        this.asteroidGroup = game.add.group();
        this.tf_lives = game.add.text(20, 10, shipProperties.startingLives, fontAssets.counterFontStyle);
    },

    initPhysics: function(){

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.enable(this.shipSprite, Phaser.Physics.ARCADE);

        this.shipSprite.body.drag.set(shipProperties.drag);
        this.shipSprite.body.maxVelocity.set(shipProperties.maxVelocity);

        this.bulletGroup.enableBody = true;
        this.bulletGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.bulletGroup.createMultiple(30, graphicAssets.bullet.name);
        this.bulletGroup.setAll('anchor.x', 0.5);
        this.bulletGroup.setAll('anchor.y', 0.5);
        this.bulletGroup.setAll('lifeSpan', bulletPoperties.lifespan);

        this.asteroidGroup.enableBody = true;
        this.asteroidGroup.physicsBodyType = Phaser.Physics.ARCADE;
    },

    initKeyboard: function(){
    
        this.key_left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.key_right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.key_thrust = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.key_fire = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
    },

    checkPlayerInput:function(){
        
        if (this.key_left.isDown){
            this.shipSprite.body.angularVelocity = -shipProperties.angularVelocity;
        }else if (this.key_right.isDown){
            this.shipSprite.body.angularVelocity = shipProperties.angularVelocity;
        }else{
            this.shipSprite.body.angularVelocity = 0;
        }

        if (this.key_thrust.isDown){
            game.physics.arcade.accelerationFromRotation(this.shipSprite.rotation, shipProperties.acceleraion, this.shipSprite.body.acceleration);
        }else{
            this.shipSprite.body.acceleration.set(0); 
        }
        if(this.key_fire.isDown){
            this.fire()
        }
    
    },

    checkBoundries: function(sprite){
        if(sprite.x < 0 ){
            sprite.x = gameProperties.screenWidth;
        }else if(sprite.x > gameProperties.screenWidth){
           sprite.x = 0 ;
        }

        if(sprite.y < 0 ){
            sprite.y = gameProperties.screenHight;
        }else if(sprite.y >gameProperties.screenHight){
           sprite.y = 0 ;
        }
    
    }, 
    
    fire: function(){
        if (game.time.now > this.bulletInterval){
            var bullet = this.bulletGroup.getFirstExists(false);

            if (bullet){
                var length = this.shipSprite.width * 0.5;
                var x  = this.shipSprite.x + (Math.cos(this.shipSprite.rotation) *length);
                var y  = this.shipSprite.y + (Math.sin(this.shipSprite.rotation) *length);
                bullet.reset(x, y);
                bullet.lifespan = bulletPoperties.lifespan;
                bullet.rotation = this.shipSprite.rotation;

                game.physics.arcade.velocityFromRotation(this.shipSprite.rotation, bulletPoperties.speed, bullet.body.velocity);
                this.bulletInterval = game.time.now + bulletPoperties.interval;

            
            }
        
        }
    
    },

    createAsteroid: function(x, y, size, pieces){
        if(pieces === undefined){pieces = 1;}
        for(var i=0; i < pieces; i++){

            var asteroid = this.asteroidGroup.create(x, y, size);
            asteroid.anchor.set(0.5, 0.5);
            asteroid.angularVelocity = game.rnd.integerInRange(asteroidProperties[size].minAngularVelocity, 
                                                               asteroidProperties[size].maxAngualrVelocity);

            var randomAngle = game.math.degToRad(game.rnd.angle());
            var randomVelocity = game.rnd.integerInRange(asteroidProperties[size].minVelocity, 
                                                         asteroidProperties[size].maxVelocity);

            game.physics.arcade.velocityFromRotation(randomAngle, randomVelocity, asteroid.body.velocity);
        }
    },


    resetAsteroids: function(){
        for(var i=0; i < this.asteroidCount; i++){

            var side = Math.round(Math.random());
            var x;
            var y;

            if(side){
                x = Math.round(Math.random()) * gameProperties.screenWidth;
                y = Math.random() * gameProperties.screenHeight;

            }else{
                y = Math.round(Math.random()) * gameProperties.screenHeight;
                x = Math.random() * gameProperties.screenWidth;
            }

            this.createAsteroid(x, y, graphicAssets.asteroidLarge.name);
        }
    },

    asteroidCollision: function(target, asteroid){
        target.kill();
        asteroid.kill();

        if(target.key == graphicAssets.ship.name){
            this.destroyShip();
        }
        this.splitAsteroid(asteroid);
    },

    destroyShip: function(){
        this.shipLives--;
        this.tf_lives.text = this.shipLives;

        if(this.shipLives){
            game.time.events.add(Phaser.Timer.SECOND * shipProperties.timeToReset, this.resetShip, this);
        
        }
    },
    
    resetShip: function(){
        this.shipSprite.reset(shipProperties.startX, shipProperties.startY);
        this.shipSprite.angle = -90;
    },

    splitAsteroid: function(asteroid){
        key = asteroid.key;
        if(asteroidProperties[key].nextSize){
            this.createAsteroid(asteroid.x, asteroid.y, asteroidProperties[key].nextSize,
                                asteroidProperties[key].pieces);
        }
    
    
    },

}
var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHight, Phaser.AUTO, 'gameDiv');
game.state.add(states.game, gameState);
game.state.start(states.game);
