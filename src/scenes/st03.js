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
    
    const
        ground_cfg = {
            tiles: 'bg_tiles',
            tile_size: [24, 24],
            len: 10,
            lim_h: 480,
        };
    
    class c_ground {
        
        constructor(scene, frames, pos, cfg = ground_cfg) {
            this.scene = scene
            this.cfg = cfg;
            this.frames = frames;
            this.prev_frame = null;
            let width = cfg.tile_size[0] * cfg.len
            this.size = [width, cfg.tile_size[1] * frames.length];
            this.layer = new c_layer(this.scene, pos, [width, cfg.lim_h]);
            this.fill();
        }
        
        _calc_frame_shape() {
        }
        
        _fill_one(px) {
            let flen = this.frames.length;
            for(let i = 0; i < flen; i++) {
                let py = (i - flen / 2) * this.cfg.tile_size[1];
                this.layer.co.add(this.scene.add.sprite(px, py, this.cfg.tiles, this.frames[i]));
            }
        }
        
        fill() {
            for(let x = -200; x < 200; x += 24) {
                this._fill_one(x);
            }
        }
        
    }

    function create() {
        ground1 = new c_ground(this, [5, 6, 7], [320, 240]);
        this.add.circle(320, 240, 5, 0xff0000);
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