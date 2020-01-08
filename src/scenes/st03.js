define(function(require) {
    
    const 
        ASSETS = n => 'assets/' + n;
        IMGS = (n, ex) => ASSETS('img/' + n + (ex ? ex : '.png'));

    function preload() {
        this.load.image('logo', 'assets/img/tst01.png');
        this.load.spritesheet('player1', IMGS('pl01'),{
            frameWidth: 72, frameHeight: 72,
        });
        this.load.spritesheet('bg_tiles', IMGS('mp01'), {
            frameWidth: 24, frameHeight: 24,
        });
    }
    
    const
        ground_cfg = {
            tiles: 'bg_tiles',
            tile_size: [24, 24],
            len: 10,
            lim_h: 480,
        };
        
    function meta_bound(props) {
        
        let OBJS = Symbol();
        
        class c_bound {
            constructor(objs) {
                this[OBJS] = objs;
                for(let prop of props) {
                    Object.defineProperty(this, prop, {
                        get() {
                            return this[OBJS][0][prop];
                        },
                        set(v) {
                            for(let obj of this[OBJS]) {
                                obj[prop] = v;
                            }
                        },
                    });
                    this[prop] = this[prop];
                }
            }
        }
        
        return c_bound;
    }
    
    class c_layer extends meta_bound(
        ['x', 'y', 'angle', 'scaleX', 'scaleY', 'flipX', 'flipY', 'rotation']
    ){
        constructor(scene, pos, size) {
            let co = scene.add.container(...pos);
            let mo = scene.make.graphics({fillStyle: {color: 0 }, add: false})
                .fillRect(-size[0] / 2, -size[1] / 2, ...size);
            let msk = mo.createGeometryMask();
            co.setMask(msk);
            super([co, mo]);
            this.scene = scene;
            this.co = co;
            this.mo = mo;
        }
    }
    
    class c_ground {
        
        constructor(scene, frame, pos, cfg = ground_cfg) {
            this.scene = scene
            this.cfg = cfg;
            this.frame = frame;
            this.prev_frame = null;
            let width = cfg.tile_size[0] * cfg.len
            this.size = [width, cfg.tile_size[1]];
            this.layer = new c_layer(this.scene, pos, [width, cfg.lim_h]);
            this.fill();
        }
        
        fill() {
            for(let x = -200; x < 200; x += 24) {
                this.layer.co.add(this.scene.add.sprite(x, 0, this.cfg.tiles, 5));
            }
        }
        
    }

    function create() {
        ground1 = new c_ground(this, 5, [320, 240]);
        this.tweens.add({
            targets: ground1.layer,
            angle: 360,
            duration: 6000,
            yoyo: false,
            repeat: -1
        });
    }
    
    function update() {
    }
    
    return {
        key: 'st03',
        preload: preload,
        create: create,
        update: update,
    };
    
});