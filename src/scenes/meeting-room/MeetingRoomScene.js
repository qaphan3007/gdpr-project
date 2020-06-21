import 'phaser';
import 'firebase/firestore';

class MeetingRoomScene extends Phaser.Scene {
    constructor() {
        super('Meeting') 
    }

    preload () {
        this.load.image('meetingRoom', './src/assets/meeting-room-icon.png');
        this.load.image('transparentBox', './src/assets/transparent-rect.png');
        this.load.image('closeMeeting', './src/assets/close-button.png');
        this.load.image('greyTrainButton', './src/assets/grey-train-button.png');
        this.load.image('phoneIcon', './src/assets/phone-icon.png');
        this.load.image('phoneScreen', './src/assets/phone-screen.png');
    }

    create () {
        const config = this.sys.game.config;
        const bg = this.add.image(0, 0, 'meetingRoom');
        
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
        phoneIcon.on('pointerdown', () => this.scene.start('Phone', { location : './src/assets/meeting-room.png' , prevScene : 'Meeting'})); // pointerdown = onClick event

        const caseButton = this.add.text(515, 175, 'PRESS HERE TO START', { fontFamily: 'Myriad Pro', fontSize: '25px', color: '#ffffff'}).setPadding(64, 16).setBackgroundColor('#442E55').setInteractive({ useHandCursor: true });
        caseButton.on('pointerdown', () => {
            caseButton.destroy();
            this.createIntroScreen();
        });        
    }

    createIntroScreen () {
        const testBG = this.add.image(this.sys.game.config.width/2, this.sys.game.config.height/2, 'transparentBox');
        testBG.setScale(.75);

        const closeMeetingButton = this.add.image(50, 50, 'closeMeeting');
        closeMeetingButton.setInteractive({ useHandCursor: true }); 
        closeMeetingButton.on('pointerdown', () => this.scene.start('Meeting')); 

        const container = this.add.container(0, 0);
        const text = 'Welcome to the meeting room! Here you can learn about practical uses of GDPR by solving cases. While the characters in these cases are fictional, the cases are inspired by situations related to GDPR in the real world! Press on the button below to start reading a case. You will be asked a series of questions at the end. Remember: GDPR compliance is the key!';
        container.add(this.add.text(100, 140, text, { fontFamily: 'Myriad Pro', fontSize: '38px', color: '#4D4D4D', align: 'left', wordWrap: { width: 860, useAdvanceWrap: true }}));
        
        const startButton = this.add.image(525, 430, 'greyTrainButton');
        container.add(startButton);
        container.add(this.add.text(500, 415, 'START', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#ffffff'}));
        startButton.setScale(.75);
        startButton.setInteractive({ useHandCursor: true });
        startButton.on('pointerdown', function () {
            container.destroy();
            this.scene.start('CaseDescription');
        }, this); 

    }
}

export default MeetingRoomScene;
