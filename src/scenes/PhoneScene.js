import 'phaser';

class PhoneScene extends Phaser.Scene {

	constructor() {
		super('Phone');
	}

	init (data) {
		this.bgLocation = data.location;
		this.prevScene = data.prevScene;
		this.currentScreen = 'home';
		this.mapIcon = null;
	};

	preload () {
		this.load.image('background', this.bgLocation);
		this.load.image('phoneIcon', './src/assets/phone-icon.png'); // Load image traced from index.html
		this.load.image('phoneScreen', './src/assets/phone-screen.png');
		this.load.image('mapIcon', './src/assets/map-icon.png');
		this.load.image('mapScreen', './src/assets/map-screen.png');
		this.load.image('receptionIcon', './src/assets/reception-icon.png'); // Phone icons
		this.load.image('trainingRoomIcon', './src/assets/training-room-icon.png');

	}

	create () {
		const config = this.sys.game.config;
		
		// Add a new background as the previous scene's background
		/*
		const bg = this.add.image(config.width/2, config.height/2, 'background');
		bg.displayHeight = config.height;
		bg.scaleX = bg.scaleY;*/
		//this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#ffff00");
		this.cameras.main.setBackgroundColor('#A9A9A9');


		// Add phone screen and place it in the middle of the scene
        const phoneScreen = this.add.image(config.width/2, config.height/2, 'phoneScreen');
		phoneScreen.setScale(.9);

		// Create the home button
		const homeButton = this.add.circle(530.5, 507, 21, 0xFFFFFF);
		homeButton.setInteractive({ useHandCursor: true }); 
		homeButton.on('pointerdown', () => this.returnHome()); 

		
		// Resize and place phone icon on bottom right of screen
		const phoneIcon = this.add.image(1000, 530, 'phoneIcon');
        phoneIcon.setScale(.7);
        phoneIcon.setInteractive({ useHandCursor: true });  // Cursor style change when hovering 
        phoneIcon.on('pointerdown', () => this.closePhone()); // pointerdown = onClick event
		
		// Place the map icon where it is on the phone
		this.mapIcon = this.add.image(504, 180, 'mapIcon');
		this.mapIcon.setInteractive({ useHandCursor: true });
		this.mapIcon.on('pointerdown', () => this.openMap()); 
	}	


	openMap () {
		this.currentScreen = 'map';
		const mapScreen = this.add.image(this.sys.game.config.width/2, this.sys.game.config.height/2, 'mapScreen');
		mapScreen.setScale(.9);
		this.toggleInteractive(this.mapIcon); // Turn off inputs from button on home screen

		// Add in map icons
		const receptionIcon = this.add.image(471, 243, 'receptionIcon');
		receptionIcon.setScale(0.071);
		receptionIcon.setInteractive({ useHandCursor: true });
		if (this.prevScene == 'Reception') {
			receptionIcon.on('pointerdown', () => this.closePhone());
		} else {
			receptionIcon.on('pointerdown', () => this.scene.start('Reception'));
		}

		const trainingRoomIcon = this.add.image(589, 243, 'trainingRoomIcon');
		trainingRoomIcon.setScale(0.071);
		trainingRoomIcon.setInteractive({ useHandCursor: true });
		if (this.prevScene == 'Training') {
			trainingRoomIcon.on('pointerdown', () => this.closePhone());
		} else {
			trainingRoomIcon.on('pointerdown', () => this.scene.start('Training'));
		}
	}

	returnHome () {
		 // Does nothing if clicking home button while on home
		if (this.currentScreen != 'home') { // Otherwise, toggle buttons
			this.currentScreen = 'home';
			const phoneScreen = this.add.image(this.sys.game.config.width/2, this.sys.game.config.height/2, 'phoneScreen');
			phoneScreen.setScale(.9);
			this.toggleInteractive(this.mapIcon); // Enable buttons on home screen again
		}
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


	update () {
		
	}


	end () {
	
	}

}

export default PhoneScene;