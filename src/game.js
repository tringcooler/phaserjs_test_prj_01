define(function(require) {
    
    return {
        type: Phaser.AUTO,
        width: 640,
        height: 480,
        physics: {
            default: 'matter',
            matter: {
                //gravity: { y: 0 },
                debug: true
            }
        },
        scene: [
            require('scenes/title'),
            require('scenes/menu'),
            require('scenes/st01'),
        ],
    };
    
});