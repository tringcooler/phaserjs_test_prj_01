define(function(require) {
    
    let n0 = n => v => ('00000000' + parseInt(v)).slice(-n);

    function preload() {
    }

    function create() {
        const 
            st_num = 2,
            butt_ht = 50,
            butt_off = 250;
        for(let st = 1; st <= st_num; st ++) {
            let text_butt = this.add.text(0, 0, 'stage ' + st, { fontSize: '32px', fill: '#fff' }).setInteractive();
            Phaser.Display.Align.In.Center(
                text_butt,
                this.add.zone(320, butt_ht * (st - 1) + butt_off, 640, butt_ht));
            text_butt.on('pointerdown', p => {
                let st_name = 'st' + n0(2)(st);
                console.log('goto ' + st_name);
                this.scene.start(st_name);
            });
        }
    }
    
    function update() {
    }
    
    return {
        key: 'menu',
        preload: preload,
        create: create,
        update: update,
    };
    
});