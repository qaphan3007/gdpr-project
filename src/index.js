import Phaser from 'phaser';
import config from './config/config';
import firebaseConfig from './config/firebaseConfig';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'regenerator-runtime/runtime'
import ReceptionScene from './scenes/ReceptionScene';
import ReceptionRoleScene from './scenes/ReceptionRoleScene';
import PhoneScene from './scenes/PhoneScene';
import TrainingScene from './scenes/TrainingScene';
import TrainingOptionsScene from './scenes/TrainingOptionsScene';
import TestScene from './scenes/TestScene';
import LearnScene from './scenes/LearnScene';
import MeetingRoomScene from './scenes/MeetingRoomScene';
import CaseDescriptionScene from './scenes/CaseDescriptionScene';
import CaseQuestionScene from './scenes/CaseQuestionScene';

class Game extends Phaser.Game {
	constructor () {
		super(config); // This Game object has config loaded from config.js
		// Load all scenes		
		this.scene.add('Reception', ReceptionScene);
		this.scene.add('ReceptionRole', ReceptionRoleScene);
		this.scene.add('Phone', PhoneScene);
		this.scene.add('Training', TrainingScene);
		this.scene.add('TrainingOptions', TrainingOptionsScene);
		this.scene.add('Test', TestScene);
		this.scene.add('Learn', LearnScene);
		this.scene.add('Meeting', MeetingRoomScene);
		this.scene.add('CaseDescription', CaseDescriptionScene);
		this.scene.add('CaseQuestion', CaseQuestionScene);

		// Initialize the game on the first scene
		this.scene.start('Reception');

		// Initialize the database
		const firebaseApp = firebase.initializeApp(firebaseConfig);

		// Initialize Cloud Firestore through Firebase
		// Access this variable through this.sys.game.db
		this.db = firebaseApp.firestore();

		/* 
			Player object:
			1. Role: either "learner" or "trainer"
			2. Level: advance in level by completing training 
			3. Achievements: a list of achievements, correspond to the achiement ID in the database
			4. Objectives: complete objectives to unlock more rooms
				Objective 0: choose a role, unlock training room
				Objective 1: finish one level of learning and testing, unlock meeting room
				Objective 2: finish solving one case
		*/
		this.player = {
            role: "",
            level: 0,
            achievements : [],
            objectives: [],
        }
	}
}

window.onload = function () {
	// Initialize the Phaser.Game object
	window.game = new Game();
}