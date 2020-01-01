requirejs.config({
    baseUrl: 'src',
    paths: {
        jquery: '../lib/jquery-1.12.4.min',
        Phaser: '../lib/phaser.min',
        core: 'core',
        graph: 'graph',
        scenes: 'scenes',
    },
    shim: {
        'main': ['core/base', 'jquery', 'Phaser'],
    },
});

requirejs(['jquery', 'Phaser', 'core/base', 'main']);
