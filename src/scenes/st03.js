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
            this._calc_frame_shape(frames);
            this.prev_frames = null;
            let width = cfg.tile_size[0] * cfg.len
            this.size = [width, cfg.tile_size[1] * frames.length];
            this.layer = new c_layer(this.scene, pos, [width, cfg.lim_h]);
            this.fill();
        }
        
        _calc_frame_shape(frames) {
            let _a = v => (v instanceof Array) ? v : [v];
            this.frames = [];
            this.fshape = [0, 0];
            frames = _a(frames);
            for(let frames_row of frames) {
                frames_row = _a(frames_row);
                this.frames.push(frames_row);
                this.fshape[1] ++;
                this.fshape[0] = Math.max(this.fshape[0], frames_row.length);
            }
        }
        
        _fill_one(px) {
            for(let iy = 0; iy < this.fshape[1]; iy ++) {
                let y = (iy - (this.fshape[1] - 1) / 2) * this.cfg.tile_size[1];
                let frames_row = this.frames[iy];
                if(!frames_row) break;
                for(let ix = 0; ix < this.fshape[0]; ix ++) {
                    let x = (ix - (this.fshape[0] - 1) / 2) * this.cfg.tile_size[0];
                    let frame = frames_row[ix];
                    if(!frame) break;
                    this.layer.co.add(this.scene.add.sprite(px + x, y, this.cfg.tiles, frame));
                }
            }
        }
        
        fill() {
            for(let x = -200; x < 200; x += 24 * this.fshape[0]) {
                this._fill_one(x);
            }
        }
        
    }

    function create() {
        ground1 = new c_ground(this, [[16, 18], [96, 98]], [320, 240]);
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