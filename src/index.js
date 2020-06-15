import Phaser from 'phaser';
import config from './config/config';
import firebaseConfig from './config/firebaseConfig';
import firebase from 'firebase/app';
import 'firebase/firestore';
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

	create () {
		const firebaseApp = firebase.initializeApp(firebaseConfig);

		 // Initialize Cloud Firestore through Firebase
		var db = firebaseApp.firestore();
		db.settings({
			timestampsInSnapshots: true
		})
		console.log('AAAAHHHH')
		console.log(db)
	}
}

window.onload = function () {
	// Initialize the Phaser.Game object
	window.game = new Game();
}