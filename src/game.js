define(function(require) {
    
    class game {
        
        constructor() {
            console.log('New Game');
        }
        
        start() {
            this.game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
                preload: this.preload,
                create: this.create,
            });
        }

        preload() {
            this.game.load.image('logo', 'assets/phaser.png');
        }

        create() {
            let logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
            logo.anchor.setTo(0.5, 0.5);
        }
        
    }
    
    return game;
    
});