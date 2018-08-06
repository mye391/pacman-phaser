import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';
import PlayingState from './GameStates/Playing';

var config = {
    width: 640,
    height: 640,
    renderer: Phaser.AUTO,
    parent: 'game',
    antialias: true,
    multiTexture: true,
};

var game = new Phaser.Game(config);


game.state.add('Playing', PlayingState);

game.state.start('Playing');

