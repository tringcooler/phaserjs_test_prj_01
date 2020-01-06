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
        let b120 = this.sound.add('bpm120');
        tac.addMarker(metro_marker);
        tac.play('metro', {
            delay: 1,
        });
        b120.play({
            delay: 1,
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