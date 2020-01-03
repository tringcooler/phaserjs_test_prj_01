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
    
    function _create_polygon_from_tiled_object_layer(map, name, scene, offset_x, offset_y) {
        let obj_layer = map.getObjectLayer(name);
        let objs = obj_layer.objects;
        let polygons = [];
        for(let obj of objs) {
            let center = Phaser.Physics.Matter.Matter.Vertices.centre(obj.polygon);
            let pos = [obj.x + offset_x + center.x, obj.y + offset_y + center.y];
            let polygon = scene.matter.add.fromVertices(...pos, obj.polygon, {isStatic: true});
            polygons.push(polygon);
        }
        return polygons;
    }

    function create() {
        let bg_map = this.make.tilemap({key: 'bg'});
        let bg_tiles = bg_map.addTilesetImage('mp01', 'bg_tiles');
        let center = [
            this.cameras.main.centerX - bg_map.widthInPixels / 2,
            this.cameras.main.centerY - bg_map.heightInPixels / 2];
        let bg_layer = bg_map.createStaticLayer('background', 'mp01', ...center);
        let walls_layer = bg_map.createStaticLayer('walls', 'mp01', ...center);
        walls_layer.setCollisionByExclusion([-1]);
        let coll_objs = _create_polygon_from_tiled_object_layer(bg_map, 'coll', this, ...center);
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