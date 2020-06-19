import 'phaser';
import 'firebase/firestore';

class CaseQuestionScene extends Phaser.Scene {
    constructor() {
        super('CaseQuestion') 
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
        this.setBackground();
    }

    setBackground () {
        const config = this.sys.game.config;
        const bg = this.add.image(0, 0, 'meetingRoom');
        
        // Scale the background img to fit the height of the game height
        bg.displayHeight = config.height;
        bg.scaleX = bg.scaleY;
        // The coordinate of the background img is centered
        bg.y = config.height/2;
        bg.x = config.width/2;

        const phoneIcon = this.add.image(1000, 530, 'phoneIcon');
        phoneIcon.setScale(.7);

        const testBG = this.add.image(this.sys.game.config.width/2, this.sys.game.config.height/2, 'transparentBox');
        testBG.setScale(.75);

        const closeMeetingButton = this.add.image(50, 50, 'closeMeeting');
        closeMeetingButton.setInteractive({ useHandCursor: true }); 
        closeMeetingButton.on('pointerdown', () => this.scene.start('Meeting')); 
    }

}

export default CaseQuestionScene;
