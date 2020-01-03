define(function(require) {
    
    return {
        type: Phaser.AUTO,
        width: 640,
        height: 480,
        physics: {
            default: 'arcade',
            arcade: {
                //gravity: { y: 0 },
                debug: true
            }
        },
        scene: [
            require('scenes/title'),
            require('scenes/st01'),
        ],
    };
    
});