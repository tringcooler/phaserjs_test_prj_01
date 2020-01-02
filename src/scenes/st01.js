define(function(require) {
    
    const IMGS = (n, ex) => '../assets/img/' + n + (ex ? ex : '.png');

    function preload() {
        this.load.spritesheet('player1', 
            IMGS('pl01'), {
                frameWidth: 72, frameHeight: 72,
            },
        );
    }

    function create() {
        //let logo = this.add.image(320, 240, 'logo');
    }
    
    function update() {
    }
    
    return {
        key: 'st01',
        preload: preload,
        create: create,
        update: update,
    };
    
});