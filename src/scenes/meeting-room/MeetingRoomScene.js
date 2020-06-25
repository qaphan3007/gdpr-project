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
        this.load.image('bill', './src/assets/bill.png');
        this.load.image('framedDialogueBox', './src/assets/framed-dialogue-box.png');
    }

    create () {
        const config = this.sys.game.config;
        const bg = this.add.image(config.width/2, config.height/2, 'meetingRoom');
        const container = this.add.container(0, 0);
        
        // Scale the background img to fit the height of the game height
        bg.displayHeight = config.height;
        bg.scaleX = bg.scaleY;

        // Add the phone button as an image to make it interactive
        const phoneIcon = this.add.image(1000, 530, 'phoneIcon');
        container.add(phoneIcon);
        phoneIcon.setScale(.7);
        phoneIcon.setInteractive({ useHandCursor: true });  

        // Open phone scene on click
        phoneIcon.on('pointerdown', () => this.scene.start('Phone', { location : './src/assets/meeting-room.png' , prevScene : 'Meeting'})); // pointerdown = onClick event

        // Make phone notification if there are new achievements or objectives
        if (this.player['newAchievement'] || this.player['newObjective']) {
            this.notifCircle = this.add.circle(1015, 505, 10, 0xFD1818);
            container.add(this.notifCircle);
            this.notifEvent = this.time.addEvent({ delay: 500, callback: () => {this.notifCircle.visible = !this.notifCircle.visible}, callbackScope: this, loop: true });    
        }      
  
        // Le ada's assistant NPC mr. bill
        const bill = this.add.image(220, 400, 'bill');
        container.add(bill);
        bill.setScale(.9);
        bill.setInteractive({ useHandCursor: true }); 
        if (this.player['billDialogue'] == 28) { // Bill's final convo loops through dialogue 28
            bill.on('pointerdown', () => this.scene.start('MeetingDialogue', { nextDialogue : 28 })); 
        } else { // Bill's all other convo initializes with ada's progress
            bill.on('pointerdown', () => this.scene.start('MeetingDialogue', { nextDialogue : this.player['adaDialogue'] })); 
        }

        const dialogueBox = this.add.image(320, 200, 'framedDialogueBox');
        container.add(dialogueBox);
        // Bill has different chat dialogues in this scene based on his MeetingRoomDialogue progress
        const billChat = this.add.text(300, 173, '', { fontFamily: 'Myriad Pro', fontSize: '22px', color: '#4D4D4D', align: 'left', wordWrap: { width: 150, useAdvancedWrap: true }})
        if (this.player['billDialogue'] == 0 ) { // Automatically open the case file
            this.player['billDialogue'] = 28; // This happens only once
            container.destroy();
            this.createIntroScreen();
        }
        else if (this.player['billDialogue'] == 1 ) {
            billChat.setText('Hello!');
        }
        else if (this.player['billDialogue'] > 1 && this.player['billDialogue'] < 5 ) {
            billChat.setPosition(260, 166);
            billChat.setText('Ada is in the lunch room!');
        } 
        else if (this.player['billDialogue'] > 5 && this.player['billDialogue'] < 24 ) {
            billChat.setPosition(260, 166);
            billChat.setText('Come back later if you need help.');
        } 
        else if (this.player['billDialogue'] > 24 ) {
            dialogueBox.setScale(1.2);
            dialogueBox.setPosition(330,190);
            billChat.setPosition(260, 146);
            billChat.setText('Talk to me again if you want to read the case files.');
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
        const text = 'This file contains a summary of the “Goggle Maps GDPR compliance” project. Press on the button below to start reading the case.';
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
