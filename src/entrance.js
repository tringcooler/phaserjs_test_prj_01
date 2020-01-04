requirejs.config({
    baseUrl: 'src',
    paths: {
        jquery: '../lib/jquery-1.12.4.min',
        Phaser: location.hostname == '127.0.0.1' ? '../lib/phaser.min' : '//cdn.jsdelivr.net/npm/phaser@3.21.0/dist/phaser.min',
        core: 'core',
        graph: 'graph',
        scenes: 'scenes',
    },
    shim: {
        'main': ['core/base', 'jquery', 'Phaser'],
    },
});

requirejs(['jquery', 'Phaser', 'core/base', 'main']);
