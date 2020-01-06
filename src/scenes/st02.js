define(function(require) {

    function preload() {
        this.load.audio('tac', 'assets/aud/pedalhh.wav');
        this.load.audio('bpm120', 'assets/aud/120BPM.ogg');
    }

    function create() {
        let bpm = 60,
            ldly = 60 / bpm;
        /*
        looped event triggered at audio's end, not start.
        so, when audio length less than loop length,
        looped event will trigger after start by audio length.
        here, it's 0.1 sec.
        */
        let idly = 0.1;
        let metro_marker = {
            name: 'metro',
            start: 0,
            duration: ldly / 2 - .001, // 1ms for sound, 499ms for wait.
            config: {
                loop: true
            }
        };
        let tac = this.sound.add('tac');
        let tac_r = this.sound.add('tac');
        spc_met = this.sound.add('tac');
        let b120 = this.sound.add('bpm120');
        tac.addMarker(metro_marker);
        tac.play('metro', {
            delay: 1,
        });
        /*b120.play({
            delay: 1,
        });*/
        
        let thr = 0.1;
        spc_met.addMarker(metro_marker);
        spc_met.play('metro', {
            delay: 1 - ldly / 2 - .001 - thr / 2,// - idly,
            mute: true,
        });
        let trigg_time = 0;
        spc_met.on('looped', snd => {
            trigg_time = this.time.now / 1000 - snd.getCurrentTime();
        });
        this.input.on('pointerdown', p => {
            let c_time = this.time.now / 1000;
            let delt_time = c_time - trigg_time;
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