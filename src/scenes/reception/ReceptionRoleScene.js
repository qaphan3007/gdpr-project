import 'phaser';

class ReceptionRoleScene extends Phaser.Scene {
    constructor() {
        super('ReceptionRole') 
    }

    init () {
        this.player = this.sys.game.player;
        this.db = this.sys.game.db;
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
        this.createBackground();
        this.chooseRole();
    }

    createBackground () {
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

        const testBG = this.add.image(this.sys.game.config.width/2, this.sys.game.config.height/2, 'transparentBox');
        testBG.setScale(.75);
        
        const closeMeetingButton = this.add.image(50, 50, 'closeScreen');
        closeMeetingButton.setInteractive({ useHandCursor: true }); 
        closeMeetingButton.on('pointerdown', () => this.scene.start('Reception')); 
    }

    chooseRole () {
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
            this.player['role'] = 'learner';
            this.player['objective'] = 2;
            this.addPlayerToDB(this.player);
            container.destroy();
            this.noticeObjectiveComplete();
        }, this);  

        const trainerButton = this.add.image(680, 400, 'greyTrainButton');
        container.add(trainerButton);
        container.add(this.add.text(650, 385, 'TRAINER', { fontFamily: 'Myriad Pro', fontSize: '25px', color: '#ffffff'}));
        trainerButton.setScale(.6);
    }

    addPlayerToDB (newPlayer) {
        this.db.collection("players").add(newPlayer)
            .then(function() {})
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
    }

    noticeObjectiveComplete () {
        const container = this.add.container(70, 70);
        container.add(this.add.text(70, 150, 'You have finished choosing your role and completed the first objective. Check out the next objective on your phone!', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#4D4D4D', align: 'center', wordWrap: { width: 800, useAdvanceWrap: true }}));
        
        const completeButton = this.add.image(460, 300, 'greyTrainButton');
        container.add(completeButton);
        container.add(this.add.text(405, 288, 'CLOSE WINDOW', { fontFamily: 'Myriad Pro', fontSize: '25px', color: '#ffffff'}));
        completeButton.setScale(.6);
        completeButton.setInteractive({ useHandCursor: true });
        completeButton.on('pointerdown', function () { 
            this.player['newObjective'] = true;
            this.scene.start('Reception')
        }, this);  
    }
}

export default ReceptionRoleScene;
