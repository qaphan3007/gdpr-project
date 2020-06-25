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
import TestScene from './scenes/training-room/TestScene';
import TestScene2 from './scenes/training-room/TestScene2';
import TestScene3 from './scenes/training-room/TestScene3';
import LearnScene from './scenes/training-room/LearnScene';
import LunchScene from './scenes/lunch-room/LunchScene';
import LunchDialogue from './scenes/lunch-room/LunchDialogue';
import MeetingRoomScene from './scenes/meeting-room/MeetingRoomScene';
import CaseDescriptionScene from './scenes/meeting-room/CaseDescriptionScene';
import CaseQuestionScene from './scenes/meeting-room/CaseQuestionScene';
import ConferenceScene from './scenes/conference-room/ConferenceScene';

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
		this.scene.add('TestLevel2', TestScene2)
		this.scene.add('TestLevel3', TestScene3)
		this.scene.add('Learning', LearnScene);
		this.scene.add('Lunch', LunchScene);
		this.scene.add('LunchDialogue', LunchDialogue);
		this.scene.add('Meeting', MeetingRoomScene);
		this.scene.add('CaseDescription', CaseDescriptionScene);
		this.scene.add('CaseQuestion', CaseQuestionScene);
		this.scene.add('Conference', ConferenceScene);

		// Initialize the game on the first scene
		this.scene.start('Lunch');

		// Initialize the database
		const firebaseApp = firebase.initializeApp(firebaseConfig);

		// Initialize Cloud Firestore through Firebase
		// Access this variable through this.sys.game.db
		this.db = firebaseApp.firestore();

		/* 
			Player object:
			1. Role: Either "learner" or "trainer"
			2. Level: Advance in level by completing training 
			3. Achievements: a list of achievements, correspond to the achiement ID in the database
				Achievement 1: Finish one test in easy mode.
				Achievement 2: Finish one test in hard mode.
				Achievement 3: Finish learning and testing all levels of GDPR.
				Achievement 4: Finish solving a GDPR case 
			4. Objectives: Indicate the current objective the player currently need to complete.
				Objective 1: Choose a role at the reception. (unlock training room upon completion)
				Objective 2: Complete one level of learning and testing GDPR knowledge at the training room. (unlock meeting room upon completion)
				Objective 3: Solve one case at the meeting room.
				Objective 4: Congratulations, you finished all objectives.
			5. Case: Keep track of the current case, increase after solving current case
		*/
		this.player = {
            role: "",
            level: 1,
            achievements : [],
			objective: 1,
			case: 1,
			newObjective: true,
			newAchievement: false,
			adaDialogue: 1,
			statistics: {
				1: {
					attempts: "0",
					time: "None"
				},
				2: {
					attempts: "0",
					time: "None"
				},
				3: {
					attempts: "0",
					time: "None"
				},
			}
		}

		// An object containing all learning content. Used to prevent multiple readings from the DB
		this.learningContent = {};
	}
}

window.onload = function () {
	// Initialize the Phaser.Game object
	window.game = new Game();
}