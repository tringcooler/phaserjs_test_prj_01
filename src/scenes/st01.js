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
    
    class c_ball {
        
        constructor(scene, name, pos) {
            this.scene = scene;
            this.name = name;
            this.go = this.scene.matter.add.sprite(...pos, this.name, null, {
                ignoreGravity: false,//true,
                inertia: Infinity,
                shape: {
                    type: 'circle',
                    radius: 20,
                },
            });
            this._init_anims();
            this._init_status();
            this._init_gameobject();
        }
        
        _init_anims() {
            this.scene.anims.create({
                key: this.name + '_down',
                frames: this.scene.anims.generateFrameNumbers(this.name, {start: 0, end: 2}),
                frameRate: 10,
                repeat: -1
            });
            this.scene.anims.create({
                key: this.name + '_side',
                frames: this.scene.anims.generateFrameNumbers(this.name, {start: 5, end: 7}),
                frameRate: 10,
                repeat: -1
            });
            this.scene.anims.create({
                key: this.name + '_up',
                frames: this.scene.anims.generateFrameNumbers(this.name, {start: 10, end: 12}),
                frameRate: 10,
                repeat: -1
            });
        }
        
        _init_status() {
            this.speed = {
                x: 0,
                y: 0
            };
        }
        
        _init_gameobject() {
            this.go.anims.play(this.name + '_down');
            this.go.setBounce(.5);
        }
        
        update_anims() {
            if(!this.debug_txt) this.debug_txt = this.scene.add.text(20, 20, '');
            this.debug_txt.setText(
                'angle:' + this.go.body.angle +
                '\nspeed:' + this.go.body.speed.toString().slice(0, 5));
        }
        
    }
    
    function _init_player(scene, pos) {
        
        player.anims.play('pside');
        return player;
    }
    
    let opv = op => (a, b) => [op(a[0], b[0]), op(a[1], b[1])],
        addv = opv((a, b) => a + b),
        subv = opv((a, b) => a - b);
    
    //let player;
    player = null;

    function create() {
        let bg_map = this.make.tilemap({key: 'bg'});
        let bg_tiles = bg_map.addTilesetImage('mp01', 'bg_tiles');
        let c_center = [
            this.cameras.main.centerX,
            this.cameras.main.centerY];
        let center = subv(c_center, [
            bg_map.widthInPixels / 2,
            bg_map.heightInPixels / 2]);
        let bg_layer = bg_map.createStaticLayer('background', 'mp01', ...center);
        let walls_layer = bg_map.createStaticLayer('walls', 'mp01', ...center);
        walls_layer.setCollisionByExclusion([1]);
        this.matter.world.convertTilemapLayer(walls_layer);
        let coll_objs = _create_polygon_from_tiled_object_layer(bg_map, 'coll', this, ...center);
        this.matter.world.setBounds(...center, bg_map.widthInPixels, bg_map.heightInPixels);
        //this.matter.world.createDebugGraphic();
        //this.matter.world.drawDebug = false;
        player = new c_ball(this, 'player1', addv(c_center, [-100, 0]));
        console.log(player);
    }
    
    function update(time, delta) {
        player.update_anims()
    }
    
    return {
        key: 'st01',
        preload: preload,
        create: create,
        update: update,
    };
    
});