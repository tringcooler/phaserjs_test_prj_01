requirejs.config({
    baseUrl: 'src',
    paths: {
        jquery: '../lib/jquery-1.12.4.min',
        //Phaser: '../lib/phaser.min',
        Phaser: '//cdn.jsdelivr.net/npm/phaser@3.21.0/dist/phaser.min',
        core: 'core',
        graph: 'graph',
        scenes: 'scenes',
    },
    shim: {
        'main': ['core/base', 'jquery', 'Phaser'],
    },
});

requirejs(['jquery', 'Phaser', 'core/base', 'main']);
