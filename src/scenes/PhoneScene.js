import 'phaser';

class PhoneScene extends Phaser.Scene {

	constructor() {
		super('Phone');
	}

	init (data) {
		this.config = this.sys.game.config;
		this.db = this.sys.game.db;
		this.player = this.sys.game.player;
		this.achievements = [''];
		this.objectives = [''];
		this.bgLocation = data.location;
		this.prevScene = data.prevScene;
		this.currentScreen = 'home';
		this.mapIcon = null;
	};

	preload () {
		this.load.image('background', this.bgLocation);
		this.load.image('phoneIcon', './src/assets/phone-icon.png'); // Load image traced from index.html
		this.load.image('phoneScreen', './src/assets/phone-screen.png');
		this.load.image('objectiveIcon', './src/assets/objective-icon.png');
		this.load.image('objectiveScreen', './src/assets/objective-screen.png');
		this.load.image('achievementIcon', './src/assets/achievement-icon.png');
		this.load.image('achievementScreen', './src/assets/achievement-screen.png');
		this.load.image('achievementTrophy', './src/assets/trophy.png');
		this.load.image('statisticsIcon', './src/assets/statistics-icon.png');
		this.load.image('statisticsScreen', './src/assets/statistics-screen.png');
		this.load.image('mapIcon', './src/assets/map-icon.png');
		this.load.image('mapScreen', './src/assets/map-screen.png');
		this.load.image('receptionIcon', './src/assets/reception-icon.png'); // Phone icons
		this.load.image('trainingRoomIcon', './src/assets/training-room-icon.png');
		this.load.image('officeRoomIcon', './src/assets/meeting-room-icon.png');
		this.load.image('lunchRoomIcon', './src/assets/lunch-room.png');
		this.load.image('lockRoomIcon', './src/assets/lock-room-icon.png');
		this.load.image('closePhone', './src/assets/close-phone.png')
	}

	create () {
		// Add a new background as the previous scene's background
		/*
		const bg = this.add.image(config.width/2, config.height/2, 'background');
		bg.displayHeight = config.height;
		bg.scaleX = bg.scaleY;*/
		//this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#ffff00");
		this.cameras.main.setBackgroundColor('#000000');

		// Add phone screen and place it in the middle of the scene
        const phoneScreen = this.add.image(this.config.width/2, this.config.height/2, 'phoneScreen');
		phoneScreen.setScale(.9);

		// Create the home button
		const homeButton = this.add.circle(530.5, 507, 21, 0xFFFFFF);
		homeButton.setInteractive({ useHandCursor: true }); 
		homeButton.on('pointerdown', () => this.scene.restart()); 
		
		// Resize and place phone icon on bottom right of screen
		const phoneIcon = this.add.image(1000, 530, 'closePhone');
        phoneIcon.setScale(.8);
        phoneIcon.setInteractive({ useHandCursor: true });  // Cursor style change when hovering 
        phoneIcon.on('pointerdown', () => this.closePhone()); // pointerdown = onClick event
		
		// Place the objective icon where it is on the phone
		this.objectiveIcon = this.add.image(445, 180, 'objectiveIcon');
		this.objectiveIcon.setInteractive({ useHandCursor: true });
		this.objectiveIcon.on('pointerdown', () => this.openObjective()); 

		// Place the map icon where it is on the phone
		this.mapIcon = this.add.image(504, 180, 'mapIcon');
		this.mapIcon.setInteractive({ useHandCursor: true });
		this.mapIcon.on('pointerdown', () => this.openMap()); 

		// Place the achievement icon where it is on the phone
		this.achievementIcon = this.add.image(562, 180, 'achievementIcon');
		this.achievementIcon.setInteractive({ useHandCursor: true });
		this.achievementIcon.on('pointerdown', () => this.openAchievement()); 

		// Place the statistics icon where it is on the phone
		this.statisticsIcon = this.add.image(618, 180, 'statisticsIcon');
		this.statisticsIcon.setInteractive({ useHandCursor: true });
		this.statisticsIcon.on('pointerdown', () => this.openStatistics()); 
		
		// Place notification circle if there is unseen objective
		if (this.player['newObjective']) {
			this.newObjectiveNotif = this.add.circle(463, 159, 7, 0xFD1818);
		} 
		if (this.player['newAchievement']) {
			this.newAchievementNotif = this.add.circle(583, 159, 7, 0xFD1818);
		}
	}	
	
	async getAchievementsFromDB () {
		var achievementArray = [];
		return new Promise((resolve, reject) => {
            this.db.collection("achievements").get().then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					achievementArray[doc.id] = doc.data()['achievement'];
				});
				return resolve(achievementArray);
			})
			.catch(function(error) {
                return reject(error);
            });
        });
	}
	
	async getObjectivesFromDB () {
		var objectiveArray = [];
		return new Promise((resolve, reject) => {
            this.db.collection("objectives").get().then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					objectiveArray[doc.id] = doc.data()['objective'];
				});
				return resolve(objectiveArray);
			})
			.catch(function(error) {
                return reject(error);
            });
        });
	}

	toggleHomeScreenIcon () {
		this.toggleInteractive(this.mapIcon); // Turn off inputs from buttons on home screen
		this.toggleInteractive(this.objectiveIcon); 
		this.toggleInteractive(this.achievementIcon); 
		this.toggleInteractive(this.statisticsIcon); 
	}

	openMap () {
		this.currentScreen = 'map';
		const mapScreen = this.add.image(this.config.width/2, this.config.height/2, 'mapScreen');
		mapScreen.setScale(.9);
		this.toggleHomeScreenIcon();

		const x1 = 471;
		const x2 = 589;
		const y1 = 243;
		const y2 = 373;
		const currentObjective = this.player['objective'];

		// Add in map icons
		const receptionIcon = this.add.image(x1, y1, 'receptionIcon');
		receptionIcon.setScale(0.071);
		receptionIcon.setInteractive({ useHandCursor: true });
		if (this.prevScene == 'Reception') {
			receptionIcon.on('pointerdown', () => this.closePhone());
		} else {
			receptionIcon.on('pointerdown', () => this.scene.start('Reception'));
		}

		// Training room is only unlocked after completing first objective
		const trainingRoomIcon = this.add.image(x2, y1, 'trainingRoomIcon');
		trainingRoomIcon.setScale(0.071);
		if (currentObjective > 1) {
			trainingRoomIcon.setInteractive({ useHandCursor: true });
			if (this.prevScene == 'Training') {
				trainingRoomIcon.on('pointerdown', () => this.closePhone());
			} else {
				trainingRoomIcon.on('pointerdown', () => this.scene.start('Training'));
			}
		} else {
			this.lockRoomOnMap(x2, y1);
		}

		// Adas office is only unlocked after completing second objective
		const officeRoom = this.add.image(x1, y2, 'officeRoomIcon');
		officeRoom.setScale(0.078);
		if (currentObjective > 2) {
			officeRoom.setInteractive({ useHandCursor: true });
			if (this.prevScene == 'Meeting') {
				officeRoom.on('pointerdown', () => this.closePhone());
			} else {
				officeRoom.on('pointerdown', () => this.scene.start('Meeting'));
			}
		} else {
			this.lockRoomOnMap(x1, y2);
		}

		// Lunch room is only unlocked after completing second objective
		const lunchRoom = this.add.image(x2, y2, 'lunchRoomIcon');
		lunchRoom.setScale(0.074);
		if (currentObjective > 2) {
			lunchRoom.setInteractive({ useHandCursor: true });
			if (this.prevScene == 'Lunch') {
				lunchRoom.on('pointerdown', () => this.closePhone());
			} else {
				lunchRoom.on('pointerdown', () => this.scene.start('Lunch'));
			}
		} else {
			this.lockRoomOnMap(x2, y2);
		}
	}

	lockRoomOnMap (x, y) {
		const lockRoom = this.add.image(x, y, 'lockRoomIcon');
		lockRoom.setScale(0.93);
	}

	async openAchievement () {
		this.currentScreen = 'achievement';
		// Ensure that achievements are only read once from the database
		if (this.achievements.length == 1) {
			this.achievements = await this.getAchievementsFromDB()
				.then((content) => { return content });
		}
		
		const achievementScreen = this.add.image(this.config.width/2, this.config.height/2, 'achievementScreen');
		achievementScreen.setScale(.9);
		this.toggleHomeScreenIcon();
		
		var counter = 0;
		// Display player achievements
		if (this.player['achievements'].length == 0) {
			this.add.text(445, 260, 'You have no achievements. Remember to complete the objectives!', { fontFamily: 'Myriad Pro', fontSize: '25px', color: '#A58348', align: 'left', wordWrap: { width: 190, useAdvanceWrap: true }});
		} else {
			this.player['achievements'].forEach((achievementIndex) => {
				counter += 1;
				this.add.text(465, 170 + 60 * counter, this.achievements[achievementIndex], { fontFamily: 'Myriad Pro', fontSize: '20px', color: '#A58348', align: 'left', wordWrap: { width: 170, useAdvanceWrap: true }});
				this.add.image(440, 190 + 60 * counter, 'achievementTrophy');
			});
		}
		if (this.player['newAchievement']){
			this.player['newAchievement'] = false; // Checked achievement no longer gives phone notif
			this.newAchievementNotif.visible = false;
		}
	}

	async openObjective () {
		this.currentScreen = 'objective';
		// Ensure that objectives are only read once from the database
		if (this.objectives.length == 1) {
			this.objectives = await this.getObjectivesFromDB()
				.then((content) => { return content });
		}
		const currentObjective = this.objectives[this.player['objective']];

		// Add background
		const objectiveScreen = this.add.image(this.config.width/2, this.config.height/2, 'objectiveScreen');
		objectiveScreen.setScale(.9);
		this.toggleHomeScreenIcon();

        this.add.text(445, 260, currentObjective, { fontFamily: 'Myriad Pro', fontSize: '25px', color: 'white', align: 'center', wordWrap: { width: 175, useAdvanceWrap: true }});
		if (this.player['newObjective']) {
			this.newObjectiveNotif.visible = false;
			this.player['newObjective'] = false;
		}
	}

	openStatistics () {
		// Add background
		const statisticsScreen = this.add.image(this.config.width/2, this.config.height/2, 'statisticsScreen');
		statisticsScreen.setScale(.9);
		this.toggleHomeScreenIcon();

		const statistics = this.player['statistics'];
		Object.keys(statistics).forEach((level) => {
			this.add.text(480, 140 + 85 * level, 'Attempts:', { fontFamily: 'Myriad Pro', fontSize: '25px', color: 'white', align: 'center', wordWrap: { width: 175, useAdvanceWrap: true }});
			this.add.text(570, 140 + 85 * level, statistics[level]['attempts'], { fontFamily: 'Myriad Pro', fontSize: '25px', color: 'white', align: 'center', wordWrap: { width: 175, useAdvanceWrap: true }});
			this.add.text(480, 170 + 85 * level, 'Time:', { fontFamily: 'Myriad Pro', fontSize: '25px', color: 'white', align: 'center', wordWrap: { width: 175, useAdvanceWrap: true }});
			this.add.text(540, 170 + 85 * level, statistics[level]['time'], { fontFamily: 'Myriad Pro', fontSize: '25px', color: 'white', align: 'center', wordWrap: { width: 175, useAdvanceWrap: true }});
		});
	}

	toggleInteractive (object) {
		if (object.input.enabled) {
			object.disableInteractive();
		} else {
			object.setInteractive({ useHandCursor: true });
		}
	}
	
	closePhone () {
		this.scene.switch(this.prevScene);
	}

}

export default PhoneScene;