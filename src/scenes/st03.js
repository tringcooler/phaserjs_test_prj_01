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
            let width = cfg.tile_size[0] * cfg.len
            this.size = [width, cfg.tile_size[1] * frames.length];
            this.layer = new c_layer(this.scene, pos, [width, cfg.lim_h]);
            let finfo = this._calc_finfo(frames);
            this.fshape = finfo.fshape;
            this.next_frames = [null, null];
            this._fill_one(0, false, null, finfo.frames);
            this.fill();
            this._init_rollx();
        }
        
        _calc_finfo(sframes) {
            let _a = v => (v instanceof Array) ? v : [v];
            let frames = [];
            let fshape = [0, 0, 0];
            sframes = _a(sframes);
            for(let frames_row of sframes) {
                frames_row = _a(frames_row);
                frames.push(frames_row);
                fshape[1] ++;
                fshape[0] = Math.max(fshape[0], frames_row.length);
                fshape[2] += frames_row.length;
            }
            return {frames: frames, fshape: fshape};
        }
        
        _get_tiles(idx) {
            return this.layer.co.list.slice(
                idx * this.fshape[2]).slice(0, this.fshape[2]);
        }
        
        _get_tile(tile) {
            if(typeof tile == 'number') tile = this._get_tiles(tile);
            if(tile instanceof Array) tile = tile[0];
            return tile;
        }
        
        _get_x(tile) {
            tile = this._get_tile(tile);
            return tile.x - tile._ground_off_x;
        }
        
        _get_frames(tile) {
            tile = this._get_tile(tile);
            return tile._ground_frames;
        }
        
        _debug_refcnt(name, delt) {
            if(!this._dbg_rc_text) this._dbg_rc_text = this.scene.add.text(20, 20, '');
            if(!this._dbg_rc_pool) this._dbg_rc_pool = {};
            if(!this._dbg_rc_pool[name]) this._dbg_rc_pool[name] = 0;
            this._dbg_rc_pool[name] += delt;
            this._dbg_rc_text.setText(Object.entries(this._dbg_rc_pool).map(v=>v.join(': ')).join('\n'));
        }
        
        _fill_one(px, left = false, tiles = null, frames = null) {
            if(!frames) {
                frames = this._get_frames(left ? 0 : -1);
            }
            let tiles_idx = 0;
            for(let iy = 0; iy < this.fshape[1]; iy ++) {
                let y = (iy - (this.fshape[1] - 1) / 2) * this.cfg.tile_size[1];
                let frames_row = frames[iy];
                if(!frames_row) break;
                for(let ix = 0; ix < this.fshape[0]; ix ++) {
                    let x = (ix - (this.fshape[0] - 1) / 2) * this.cfg.tile_size[0];
                    let frame = frames_row[ix];
                    if(!frame) break;
                    let sp;
                    if(tiles) {
                        sp = tiles[tiles_idx];
                        sp.setPosition(px + x, y);
                    } else {
                        sp = this.scene.add.sprite(px + x, y, this.cfg.tiles, frame);
                        sp.once('destroy', go => this._debug_refcnt('sp', -1));
                        this._debug_refcnt('sp', 1);
                    }
                    sp._ground_off_x = x;
                    sp._ground_frames = frames;
                    if(left) {
                        this.layer.co.addAt(sp, tiles_idx);
                    } else {
                        this.layer.co.add(sp);
                    }
                    tiles_idx ++;
                }
            }
        }
        
        _filled_status() {
            let top_l = this._get_tiles(0);
            let top_r = this._get_tiles(-1);
            let _cs = (lx, rx) => px =>(px > rx) ? 1 : (px < lx) ? -1 : 0;
            let top_n = (this.cfg.len - 1) / 2,
                t_w = this.cfg.tile_size[0];
            let [x_l, x_r] = [this._get_x(top_l), this._get_x(top_r)];
            let sta_l = - _cs(- (top_n + this.fshape[0]) * t_w, - top_n * t_w)(x_l);
            let sta_r = _cs(top_n * t_w, (top_n + this.fshape[0]) * t_w)(x_r);
            return [[top_l, top_r], [sta_l, sta_r], [x_l, x_r]];
        }
        
        fill() {
            let [top_tiles, top_status, top_x] = this._filled_status();
            let left;
            if(top_status[0] < 0) {
                left = true;
            } else if(top_status[1] < 0) {
                left = false;
            } else {
                return;
            }
            let hd_idx = 1,
                tl_idx = 0;
            if(left) {
                hd_idx = 0;
                tl_idx = 1;
            }
            let frames = this.next_frames[hd_idx];
            if(!frames) {
                frames = this._get_frames(top_tiles[hd_idx]);
            } else {
                this.next_frames[hd_idx] = null;
            }
            let tiles = null;
            if(top_status[tl_idx] > 0) {
                let destroy = true;
                if(frames === this._get_frames(top_tiles[tl_idx])) {
                    tiles = top_tiles[tl_idx];
                    destroy = false;
                }
                top_tiles[tl_idx].forEach(t => {
                    this.layer.co.remove(t, destroy);
                });
            }
            let step_x = 24 * this.fshape[0];
            if(left) step_x = - step_x;
            this._fill_one(top_x[hd_idx] + step_x, left, tiles, frames);
            this.fill();
        }
        
        prep_frames(frames, left = false) {
            this.next_frames[left ? 0 : 1] = this._calc_finfo(frames).frames;
        }
        
        roll(sx) {
            this.layer.co.iterate(sp => {
                sp.x += sx;
            });
            this.fill();
        }
        
        _init_rollx() {
            Object.defineProperty(this, 'rollx', {
                get: () => this._rollx,
                set: v => {
                    if(v === null) {
                        this._rollx = 0;
                    } else {
                        this.roll(v - this._rollx);
                        this._rollx = v;
                    }
                }
            });
            this.rollx = null;
        }
        
    }

    function create() {
        let frames_list = [
            [[16, 18], [96, 98]],
            [[136, 138], [216, 218]],
        ];
        let _fidx = 0;
        let fidx = () => (_fidx ++) % 2;
        ground1 = new c_ground(this, frames_list[fidx()], [320, 240]);
        this.add.circle(320, 240, 5, 0xff0000);
        this.tweens.add({
            targets: ground1.layer,
            angle: 360,
            duration: 6000,
            yoyo: false,
            repeat: -1,
            //onRepeat: () => console.log('.'),
        });
        this.tweens.add({
            targets: ground1,
            rollx: -500,
            duration: 5000,
            repeat: -1,
            onRepeat: (tw, tar) => {tar.rollx = null; tar.prep_frames(frames_list[fidx()])},
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