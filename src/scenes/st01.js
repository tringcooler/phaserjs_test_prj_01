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
            console.log(offset_x, obj.x, offset_y, obj.y);
            let p_ref = new Phaser.Geom.Polygon(obj.polygon);
            console.log('p_ref', p_ref);
            let p_aabb = Phaser.Geom.Polygon.GetAABB(p_ref);
            let pos = [obj.x + offset_x + p_aabb.width / 2, obj.y + offset_y + p_aabb.height / 2];
            //let polygon = scene.matter.add.fromVertices(...pos, obj.polygon, {isStatic: true});
            let polygon_g = scene.add.polygon(...pos, obj.polygon, 128);
            polygon_g.setRotation(obj.rotation);
            scene.matter.add.gameObject(polygon_g, {isStatic: true, shape: {type: 'fromVertices', verts: polygon_g.geom.points/*obj.polygon*/}});
            //console.log(pos, obj.polygon, polygon.vertices);
            console.log(polygon_g);
            //polygons.push(polygon);
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
        //let coll_layer = bg_map.getObjectLayer('coll');
        //this.matter.world.convertTilemapLayer(coll_layer);
        //let coll_objs = bg_map.createFromObjects('coll', 'colls');
        let coll_objs = _create_polygon_from_tiled_object_layer(bg_map, 'coll', this, ...center);
        /*coll_objs.forEach(co => {
            this.matter.add.gameObject(co, {isStatic: true});
        });*/
        console.log(bg_map);
        console.log(coll_objs);
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