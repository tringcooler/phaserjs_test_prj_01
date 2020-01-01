define(function(require) {

    function preload() {
        this.load.image('logo', '../assets/tst01.png');
    }

    function create() {
        let logo = this.add.image(320, 240, 'logo');
    }
    
    function update() {
    }
    
    return {
        preload: preload,
        create: create,
        update: update,
    };
    
});