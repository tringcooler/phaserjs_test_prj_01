define(function(require) {
    
    const 
        ASSETS = n => '../assets/' + n;
        IMGS = (n, ex) => ASSETS('img/' + n + (ex ? ex : '.png'));
    
    let opv = op => (a, b) => [op(a[0], b[0]), op(a[1], b[1])],
        addv = opv((a, b) => a + b),
        subv = opv((a, b) => a - b),
        nf = n => f => ((b, f) => Math.round(f * b) / b)(10 ** n, f),
        nf3 = nf(3);
    
    let ball_pool = [];
    let bar_pool = [];

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
                ignoreGravity: false,
                inertia: Infinity,
                friction: 0.00001,
                frictionAir: 0.01,
                restitution: .5,
                shape: {
                    type: 'circle',
                    radius: 20,
                },
            });
            this.go.body._collflag_ball = true;
            this._init_anims();
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
        
        _update_debug() {
            if(!this.debug_txt) this.debug_txt = this.scene.add.text(20, 20, '');
            this.debug_txt.setText(
                'angle:' + this.go.body.angle +
                '\nspeed:' + nf3(this.go.body.speed) +
                '\nvx:' + nf3(this.go.body.velocity.x) +
                '\nvy:' + nf3(this.go.body.velocity.y));
        }
        
        _check_direct() {
            let vx = nf3(this.go.body.velocity.x),
                vy = nf3(this.go.body.velocity.y);
            if(Math.abs(vy) < Math.abs(vx)) {
                if(vx < 0) {
                    return [this.name + '_side', false];
                } else {
                    return [this.name + '_side', true];
                }
            } else {
                if(vy < 0) {
                    return [this.name + '_up', false];
                } else {
                    return [this.name + '_down', false];
                }
            }
        }
        
        _update_anims() {
            let [aname, aflip] = this._check_direct();
            this.go.anims.play(aname, -1);
            this.go.flipX = aflip;
        }
        
        update() {
            this._update_anims();
            this._update_debug();
        }
        
    }
    
    class c_bar {
        
        constructor(scene, pos, dir, ang, dur = 100, size = [95, 10], color = 128) {
            this.scene = scene;
            this.pos = pos;
            this.dir = Math.sign(dir);
            this.ang = ang;
            this.dur = dur;
            this.size = size;
            this.color = color;
            this._init_status();
            this._create_gameobject();
            this._init_controll();
            this._init_flip_event();
        }
        
        _cur_ang() {
            return this.dir * this.go.rotation;
        }
        
        _rotate(ang) {
            let c_ang = this._cur_ang()
            let r_ang = ang + c_ang;
            r_ang = Math.min(Math.max(r_ang, -this.ang), this.ang);
            ang = r_ang - c_ang;
            Phaser.Physics.Matter.Matter.Body.rotate(this.go.body, this.dir * ang,
                {x: this.pos[0], y: this.pos[1]});
            this.status.sta = - Math.sign(ang);
        }
        
        _create_gameobject() {
            this.mass = addv(this.pos, [this.dir * this.size[0] / 2, 0]);
            this.go = this.scene.add.rectangle(...this.mass, ...this.size, this.color);
            this.scene.matter.add.gameObject(this.go, {
                isStatic: true,
                //restitution: 150,
            });
            this._rotate(this.ang);
            /* static object's restitution is always 0, need to set after create.
               but, the real pair restitution between 2 objects is the Max of them,
               so, this is not worked when set to 0. */
            //this.go.setBounce(0);
        }
        
        _init_status() {
            this.status = {
                act: -1,
                sta: 0,
            }
        }
        
        _init_controll() {
            this.scene.input.on('pointerdown', p => {
                this.status.act = 1;
            });
            this.scene.input.on('pointerup', p => {
                this.status.act = -1;
            });
        }
        
        _init_flip_event() {
            this.scene.matter.world.on('collisionactive', (event, body_a, body_b) => {
                let src, dst;
                if(body_a === this.go.body) {
                    src = body_a;
                    dst = body_b;
                } else if(body_b === this.go.body) {
                    src = body_b;
                    dst = body_a;
                } else {
                    return;
                }
                if(dst._collflag_ball && this.status.sta > 0) {
                    console.log('.');
                    dst.gameObject.thrust(2000);
                }
            });
        }
        
        _update_debug() {
            if(!this.debug_txt) this.debug_txt = this.scene.add.text(20, 120, '');
            this.debug_txt.setText(
                'act:' + this.status.act +
                '\nsta:' + this.status.sta);
        }
        
        _delt_angle(delt) {
            return this.ang * 2 / this.dur * delt;
        }
        
        _update_angle(delt) {
            this._rotate(- this.status.act * this._delt_angle(delt));
        }
        
        update(delt) {
            this._update_angle(delt);
            this._update_debug();
        }
        
    }

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
        this.matter.add.mouseSpring();
        let bar1 = new c_bar(this, addv(center, [70, 403]), 1, 0.5);
        let bar2 = new c_bar(this, addv(center, [289, 403]), -1, 0.5);
        bar_pool.push(bar1);
        bar_pool.push(bar2);
        player = new c_ball(this, 'player1', addv(c_center, [-100, 0]));
        ball_pool.push(player);
    }
    
    function update(time, delta) {
        for(let ball of ball_pool) {
            ball.update();
        }
        for(let bar of bar_pool) {
            bar.update(delta);
        }
    }
    
    return {
        key: 'st01',
        preload: preload,
        create: create,
        update: update,
    };
    
});