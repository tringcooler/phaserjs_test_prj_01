define(function(require) {

    function preload() {
        this.load.audio('tac', 'assets/aud/pedalhh.wav');
        this.load.audio('bpm120', 'assets/aud/120BPM.ogg');
    }

    function create() {
        let bpm = 120,
            ldly = 60 / bpm;
        /*
        looped event triggered at audio's end, not start.
        so, when audio length less than loop length,
        looped event will trigger after start by audio length.
        here, it's 0.1 sec.
        */
        //let spc_len = 0.1;
        let metro_marker = {
            name: 'metro',
            start: 0,
            duration: ldly - .001, // 1ms for sound, 499ms for wait.
            config: {
                loop: true
            }
        };
        let tac = this.sound.add('tac');
        let tac_r = this.sound.add('tac');
        let spc_met = this.sound.add('tac');
        let b120 = this.sound.add('bpm120');
        tac.addMarker(metro_marker);
        let m_offset = 1;
        m_offset = Math.max(m_offset, ldly / 2); //avoid spc_met delay time be negtive
        tac.play('metro', {
            delay: m_offset,
        });
        /*b120.play({
            delay: 1,
        });*/
        
        let thr = 0.05;
        spc_met.addMarker(metro_marker);
        spc_met.play('metro', {
            delay: m_offset - ldly / 2,
            mute: true,
        });
        let trigg_time = 0;
        spc_met.on('looped', snd => {
            trigg_time = this.time.now / 1000 - snd.getCurrentTime();
            //console.log('.', snd.getCurrentTime());
        });
        let delt_cent =  (v, l) => (v % l + l * 3 / 2) % l - l / 2;
        this.input.on('pointerdown', p => {
            let c_time = this.time.now / 1000;
            let delt_time = delt_cent((c_time - trigg_time), ldly);
            let t = false;
            if(Math.abs(delt_time) < thr) {
                tac_r.play({delay: 0});
                t = true;
            }
            console.log(t ? 'o' : 'x', (delt_time).toFixed(4), c_time.toFixed(4), trigg_time.toFixed(4));
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