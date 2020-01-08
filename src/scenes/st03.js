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
            this._fill_one(0, false, null, finfo);
            this._fill();
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
            return tile.x + tile._ground_off_x;
        }
        
        _get_finfo(tile) {
            tile = this._get_tile(tile);
            return tile._ground_finfo;
        }
        
        _fill_one(px, left = false, tiles = null, finfo = null) {
            if(!finfo) {
                finfo = this._get_finfo(left ? 0 : -1);
            }
            let tiles_idx = 0;
            for(let iy = 0; iy < finfo.fshape[1]; iy ++) {
                let y = (iy - (finfo.fshape[1] - 1) / 2) * this.cfg.tile_size[1];
                let frames_row = finfo.frames[iy];
                if(!frames_row) break;
                for(let ix = 0; ix < finfo.fshape[0]; ix ++) {
                    let x = (ix - (finfo.fshape[0] - 1) / 2) * this.cfg.tile_size[0];
                    let frame = frames_row[ix];
                    if(!frame) break;
                    let sp;
                    if(tiles) {
                        sp = tiles[tiles_idx ++];
                        sp.setPosition(px, y);
                    } else {
                        sp = this.scene.add.sprite(px + x, y, this.cfg.tiles, frame);
                    }
                    sp._ground_off_x = x;
                    sp._ground_finfo = finfo;
                    if(left) {
                        this.layer.co.addAt(sp, 0);
                    } else {
                        this.layer.co.add(sp);
                    }
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
            let sta_l = - _cs(- (top_n + 1) * t_w, - top_n * t_w)(x_l);
            let sta_r = _cs(top_n * t_w, (top_n + 1) * t_w)(x_r);
            return [[top_l, top_r], [sta_l, sta_r], [x_l, x_r]];
        }
        
        _fill(left = false, finfo = null) {
            let hd_idx = 1,
                tl_idx = 0;
            if(left) {
                hd_idx = 0;
                tl_idx = 1;
            }
            let [top_tiles, top_status, top_x] = this._filled_status();
            if(top_status[hd_idx] <= 0) return;
            if(!finfo) {
                finfo = this._get_finfo(top_tiles[hd_idx]);
            }
            let tiles = null;
            if(top_status[tl_idx] < 0
                && finfo === this._get_finfo(top_tiles[tl_idx])) {
                tiles = top_tiles[tl_idx];
            }
            let step_x = 24 * finfo.fshape[0];
            if(left) step_x = - step_x;
            this._fill_one(top_x[hd_idx] + step_x, left, tiles, finfo);
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
            repeat: -1,
            //onRepeat: () => console.log('.'),
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