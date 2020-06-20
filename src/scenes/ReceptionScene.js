import 'phaser';

class ReceptionScene extends Phaser.Scene {
    constructor() {
        super('Reception') // this scene has the key 'Reception' when initializing it
    }
 
    init () {
        this.player = {
            role: "",
            level: 0,
            achievements : [],
            objectives: [],
            hasChosenRole: false
        }
    }
    
    preload () {
        this.load.image('reception', './src/assets/reception.png' );
        this.load.image('transparentBox', './src/assets/transparent-rect.png');
        this.load.image('closeScreen', './src/assets/close-button.png');
        this.load.image('greyTrainButton', './src/assets/grey-train-button.png');
        this.load.image('phoneIcon', './src/assets/phone-icon.png');
        this.load.image('phoneScreen', './src/assets/phone-screen.png');
    }

    create () {
        const config = this.sys.game.config;
        const bg = this.add.image(0, 0, 'reception');
        
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
        phoneIcon.on('pointerdown', () => this.openPhone()); // pointerdown = onClick event

        const caseButton = this.add.text(515, 175, 'PRESS HERE TO START', { fontFamily: 'Myriad Pro', fontSize: '25px', color: '#ffffff'}).setPadding(64, 16).setBackgroundColor('#442E55').setInteractive({ useHandCursor: true });
        caseButton.on('pointerdown', () => {
            caseButton.destroy();
            this.chooseRole();
        });   
    }

    openPhone () {
        this.scene.start('Phone', { location : './src/assets/reception.png' , prevScene : 'Reception'});
    }

    chooseRole () {
        const testBG = this.add.image(this.sys.game.config.width/2, this.sys.game.config.height/2, 'transparentBox');
        testBG.setScale(.75);
        
        const closeMeetingButton = this.add.image(50, 50, 'closeScreen');
        closeMeetingButton.setInteractive({ useHandCursor: true }); 
        closeMeetingButton.on('pointerdown', () => this.scene.start('Reception')); 
        
        const container = this.add.container(70, 70);
        container.add(this.add.text(280, 0, 'WELCOME TO GDPR AT WORK!', { fontFamily: 'Myriad Pro Bold', fontSize: '42px', color: '#4D4D4D'}));
        container.add(this.add.text(0, 100, 'GDPR At Work is a game that can help you learn GDPR. What is your purpose here?', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#4D4D4D', align: 'left', wordWrap: { width: 930, useAdvanceWrap: true }}));
        container.add(this.add.text(0, 150, 'Are you here to learn GDPR? Or are you here to manage the GDPR training content to help train employees?', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#4D4D4D', align: 'left', wordWrap: { width: 930, useAdvanceWrap: true }}));
        container.add(this.add.text(0, 300, 'Please choose your role below according to your purpose.', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#4D4D4D', align: 'left', wordWrap: { width: 930, useAdvanceWrap: true }}));
        
        const learnerButton = this.add.image(255, 400, 'greyTrainButton');
        container.add(learnerButton);
        container.add(this.add.text(220, 385, 'LEARNER', { fontFamily: 'Myriad Pro', fontSize: '25px', color: '#ffffff'}));
        learnerButton.setScale(.6);
        learnerButton.setInteractive({ useHandCursor: true });
        learnerButton.on('pointerdown', function () { 
            container.destroy();
            testBG.destroy();
            closeMeetingButton.destroy();
            this.player['role'] = 'learner';
            this.addPlayerToDB(this.player);
            this.hasChosenRole = true;
        }, this);  

        const trainerButton = this.add.image(680, 400, 'greyTrainButton');
        container.add(trainerButton);
        container.add(this.add.text(650, 385, 'TRAINER', { fontFamily: 'Myriad Pro', fontSize: '25px', color: '#ffffff'}));
        trainerButton.setScale(.6);
        trainerButton.setInteractive({ useHandCursor: true });
        trainerButton.on('pointerdown', function () { 
            container.destroy();
            testBG.destroy();
            closeMeetingButton.destroy();
            this.player['role'] = 'trainer';
            this.addPlayerToDB(this.player);
            this.hasChosenRole = true;
        }, this);  
    }

    addPlayerToDB (newPlayer) {
        this.sys.game.db.collection("players").add(newPlayer)
            .then(function() {})
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
    }
}

export default ReceptionScene;
