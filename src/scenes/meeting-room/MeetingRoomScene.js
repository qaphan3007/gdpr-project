import 'phaser';
import 'firebase/firestore';

class MeetingRoomScene extends Phaser.Scene {
    constructor() {
        super('Meeting') 
    }

    init () {
        this.player = this.sys.game.player;
    }

    preload () {
        this.load.image('meetingRoom', './src/assets/meeting-room-icon.png');
        this.load.image('transparentBox', './src/assets/transparent-rect.png');
        this.load.image('closeMeeting', './src/assets/close-button.png');
        this.load.image('greyTrainButton', './src/assets/grey-train-button.png');
        this.load.image('phoneIcon', './src/assets/phone-icon.png');
        this.load.image('phoneScreen', './src/assets/phone-screen.png');
        this.load.image('npc', './src/assets/meeting-room-npc.png');
        this.load.image('framedDialogueBox', './src/assets/framed-dialogue-box.png');
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

        // Add assistant NPC and speech
        const dialogueBox = this.add.image(670, 200, 'framedDialogueBox');
        dialogueBox.setScale(0.8);
        const dialogueText = this.add.text(648, 183, 'Hello!', { fontFamily: 'Myriad Pro', fontSize: '22px', color: '#4D4D4D', align: 'left', wordWrap: { width: 190, useAdvancedWrap: true }})
        const npc = this.add.image(540, 420, 'npc');
        npc.setScale(1.4);
        npc.setInteractive({ useHandCursor: true });  
        npc.on('pointerdown', () => {
            dialogueBox.destroy();
            this.createIntroScreen();
        });        

        // Add the phone button as an image to make it interactive
        const phoneIcon = this.add.image(1000, 530, 'phoneIcon');
        phoneIcon.setScale(.7);
        phoneIcon.setInteractive({ useHandCursor: true });  

        // Open phone scene on click
        phoneIcon.on('pointerdown', () => this.scene.start('Phone', { location : './src/assets/meeting-room.png' , prevScene : 'Meeting'})); // pointerdown = onClick event

        // Make phone notification if there are new achievements or objectives
        if (this.player['newAchievement'] || this.player['newObjective']) {
            this.notifCircle = this.add.circle(1015, 505, 10, 0xFD1818);
            this.notifEvent = this.time.addEvent({ delay: 500, callback: () => {this.notifCircle.visible = !this.notifCircle.visible}, callbackScope: this, loop: true });    
        }      
    }

    createIntroScreen () {
        const testBG = this.add.image(this.sys.game.config.width/2, this.sys.game.config.height/2, 'transparentBox');
        testBG.setScale(.75);

        const closeMeetingButton = this.add.image(50, 50, 'closeMeeting');
        closeMeetingButton.setInteractive({ useHandCursor: true }); 
        closeMeetingButton.on('pointerdown', () => this.scene.start('Meeting')); 

        const container = this.add.container(0, 0);
        // const text = 'Welcome to the meeting room! Here you can learn about practical uses of GDPR by solving cases. While the characters in these cases are fictional, the cases are inspired by situations related to GDPR in the real world! Press on the button below to start reading a case. You will be asked a series of questions at the end. Remember: GDPR compliance is the key!';
        const text = 'Welcome! Here you can read about the case that Ada needed help on. Press on the button below to start reading the case.';
        container.add(this.add.text(100, 140, text, { fontFamily: 'Myriad Pro', fontSize: '38px', color: '#4D4D4D', align: 'left', wordWrap: { width: 860, useAdvanceWrap: true }}));
        
        const startButton = this.add.image(525, 430, 'greyTrainButton');
        container.add(startButton);
        container.add(this.add.text(500, 415, 'READ', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#ffffff'}));
        startButton.setScale(.75);
        startButton.setInteractive({ useHandCursor: true });
        startButton.on('pointerdown', function () {
            container.destroy();
            this.scene.start('CaseDescription');
        }, this); 

    }
}

export default MeetingRoomScene;
