import Phaser from 'phaser';
import config from './config/config';
import firebaseConfig from './config/firebaseConfig';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'regenerator-runtime/runtime'
import ReceptionScene from './scenes/reception/ReceptionScene';
import ReceptionRoleScene from './scenes/reception/ReceptionRoleScene';
import PhoneScene from './scenes/PhoneScene';
import TrainingScene from './scenes/training-room/TrainingScene';
import TrainingOptionsScene from './scenes/training-room/TrainingOptionsScene';
import TestScene from './scenes/TestScene';
import LearnScene from './scenes/training-room/LearnScene';
import MeetingRoomScene from './scenes/meeting-room/MeetingRoomScene';
import CaseDescriptionScene from './scenes/meeting-room/CaseDescriptionScene';
import CaseQuestionScene from './scenes/meeting-room/CaseQuestionScene';

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
				Achievement 1: Finish learning one level of GDPR.
				Achievement 2: Finish testing one level of GDPR.
				Achievement 3: Finish learning and testing all levels of GDPR.
				Achievement 4: Finish solving a GDPR case 
			4. Objectives: Indicate the current objective the player currently need to complete.
				Objective 1: Choose a role at the reception.
				Objective 2: Complete one level of learning and testing GDPR knowledge at the training room.
				Objective 3: Solve one case at the meeting room.
		*/
		this.player = {
            role: "",
            level: 1,
            achievements : [],
            objective: 1,
        }
	}
}

window.onload = function () {
	// Initialize the Phaser.Game object
	window.game = new Game();
}