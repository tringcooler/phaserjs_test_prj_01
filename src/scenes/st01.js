define(function(require) {
    
    const 
        ASSETS = n => '../assets/' + n;
        IMGS = (n, ex) => ASSETS('img/' + n + (ex ? ex : '.png'));

    function preload() {
        this.load.spritesheet('player1', 
            IMGS('pl01'), {
                frameWidth: 72, frameHeight: 72,
            },
        );
        this.load.image('bg_tiles', IMGS('mp01'));
        this.load.tilemapTiledJSON('bg', ASSETS('map/st01.json'));
    }

    function create() {
        let bg_map = this.make.tilemap({key: 'bg'});
        let bg_tiles = bg_map.addTilesetImage('mp01', 'bg_tiles');
        let bg_layer = bg_map.createStaticLayer('background', 'mp01',
            this.cameras.main.centerX - bg_map.widthInPixels / 2,
            this.cameras.main.centerY - bg_map.heightInPixels / 2);
    }
    
    function update() {
    }
    
    return {
        key: 'st01',
        preload: preload,
        create: create,
        //update: update,
    };
    
});