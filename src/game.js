define(function(require) {
    
    return {
        type: Phaser.AUTO,
        width: 640,
        height: 480,
        scene: [
            require('scenes/title'),
            require('scenes/st01'),
        ],
    };
    
});