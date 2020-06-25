import 'phaser';

class ConferenceScene extends Phaser.Scene {
    constructor() {
        super('Conference') 
    }

    init() {
        this.player = this.sys.game.player;
    }
    
    preload () {
        this.load.image('conferenceRoom', './src/assets/training-room.png');
        this.load.image('transparentBox', './src/assets/transparent-rect.png');
        this.load.image('closeButton', './src/assets/close-button.png');
        this.load.image('trainButton', './src/assets/train-button.png');
        this.load.image('greyTrainButton', './src/assets/grey-train-button.png');
        this.load.image('phoneIcon', './src/assets/phone-icon.png');
        this.load.image('phoneScreen', './src/assets/phone-screen.png');
    }

    create () {
        this.createBackground();
        this.createIntroScreen();
    }

    createBackground () {
        const config = this.sys.game.config;
        const bg = this.add.image(0, 0, 'conferenceRoom');
        
        // Scale the background img to fit the height of the game height
        bg.displayHeight = config.height;
        bg.scaleX = bg.scaleY;
        // The coordinate of the background img is centered
        bg.y = config.height/2;
        bg.x = config.width/2;

        // Add the phone button as an image to make it interactive
        const phoneIcon = this.add.image(1000, 530, 'phoneIcon');
        phoneIcon.setScale(.7);
        phoneIcon.setInteractive({ useHandCursor: true });  // Cursor style change when hovering 
        // Open phone scene on click
        phoneIcon.on('pointerdown', () => this.scene.start('Phone', { location : './src/assets/training-room.png' , prevScene : 'Training'})); // pointerdown = onClick event
        
        // Make phone notification if there are new achievements or objectives
        if (this.player['newAchievement'] || this.player['newObjective']) {
            this.notifCircle = this.add.circle(1015, 505, 10, 0xFD1818);
            this.notifEvent = this.time.addEvent({ delay: 500, callback: () => {this.notifCircle.visible = !this.notifCircle.visible}, callbackScope: this, loop: true });    
        }

        // TODO: Add a button to call createIntroScreen()
    }

    createIntroScreen () {
        const container = this.add.container(0, 0);
        const testBG = this.add.image(this.sys.game.config.width/2, this.sys.game.config.height/2, 'transparentBox');
        testBG.setScale(.75);
        container.add(testBG);

        const closeButton = this.add.image(50, 50, 'closeButton');
        closeButton.setInteractive({ useHandCursor: true }); 
        closeButton.on('pointerdown', () => container.destroy());
        container.add(closeButton); 

        const text = 'Welcome to the conference room! You can learn in collaboration with others here. Please contact a trainer to start the training!';
        container.add(this.add.text(100, 140, text, { fontFamily: 'Myriad Pro', fontSize: '38px', color: '#4D4D4D', align: 'left', wordWrap: { width: 860, useAdvanceWrap: true }}));
        
        const backButton = this.add.image(525, 430, 'greyTrainButton');
        container.add(backButton);
        container.add(this.add.text(500, 415, 'BACK', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#ffffff'}));
        backButton.setScale(.75);
        backButton.setInteractive({ useHandCursor: true });
        backButton.on('pointerdown', () => container.destroy());
    }
}

export default ConferenceScene;
