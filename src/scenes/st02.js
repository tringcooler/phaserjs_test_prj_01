define(function(require) {

    function preload() {
        this.load.audio('tac', 'assets/aud/pedalhh.wav');
        this.load.audio('bpm120', 'assets/aud/120BPM.ogg');
    }

    function create() {
        let metro_marker = {
            name: 'metro',
            start: 0,
            duration: .499, // 1ms for sound, 499ms for wait.
            config: {
                loop: true
            }
        };
        let tac = this.sound.add('tac');
        let tac_r = this.sound.add('tac');
        let spc_met = this.sound.add('tac');
        let b120 = this.sound.add('bpm120');
        tac.addMarker(metro_marker);
        tac.play('metro', {
            delay: 1,
        });
        /*b120.play({
            delay: 1,
        });*/
        
        const thr = 0.2;
        spc_met.addMarker(metro_marker);
        spc_met.play('metro', {
            delay: .749 - thr / 2,
            mute: true,
        });
        let trigg_time = 0;
        spc_met.on('looped', snd => {
            trigg_time = this.time.now / 1000;
        });
        this.input.on('pointerdown', p => {
            let c_time = this.time.now / 1000;
            let delt_time = c_time - trigg_time;
            //delt_time = Math.min(delt_time, 0.5 - delt_time);
            let t = false;
            if(delt_time < thr) {
                tac_r.play({delay: 0});
                t = true;
            }
            console.log(t ? 'o' : 'x', (delt_time - thr / 2).toFixed(2), c_time.toFixed(2), trigg_time.toFixed(2));
        });
    }
    
    function update() {
    }
    
    return {
        key: 'st02',
        preload: preload,
        create: create,
        update: update,
    };
    
});