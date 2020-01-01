define(function (require) {$(document).ready(function() {
    console.log('start');
    
    (function() {
        const c_game = require('game');
        let game = new c_game();
        game.start();
    })();
    
});});
