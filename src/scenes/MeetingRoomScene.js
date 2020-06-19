import 'phaser';
import 'firebase/firestore';

class MeetingRoomScene extends Phaser.Scene {
    constructor() {
        super('Meeting') 
    }

    preload () {
        this.load.image('meetingRoom', './src/assets/meeting-room-icon.png');
        this.load.image('transparentBox', './src/assets/transparent-rect.png');
        this.load.image('closeTraining', './src/assets/close-button.png');
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
        caseButton.on('pointerdown', () => this.scene.start('MeetingOptions'));
    }
}

export default MeetingRoomScene;
