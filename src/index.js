import Phaser from 'phaser';
import config from './config/config';
import ReceptionScene from './scenes/ReceptionScene';
import TrainingScene from './scenes/TrainingScene';
import PhoneScene from './scenes/PhoneScene';

class Game extends Phaser.Game {
	constructor () {
		super(config); // This Game object has config loaded from config.js
		// Load all scenes		
		this.scene.add('Reception', ReceptionScene);
		this.scene.add('Training', TrainingScene);
		this.scene.add('Phone', PhoneScene);

		// Initialize the game on the first scene
		this.scene.start('Training');
	}
}

window.onload = function () {
	// Initialize the Phaser.Game object
	window.game = new Game();
}