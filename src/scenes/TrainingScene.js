import 'phaser';

class TrainingScene extends Phaser.Scene {
    constructor() {
        super('Training') 
    }

    preload () {
        this.load.image('trainingRoom', './src/assets/training-room.png');
        this.load.image('transparentBox', 'src/assets/transparent-rect.png');
        this.load.image('closeTraining', 'src/assets/close-button.png');
        this.load.image('trainButton', 'src/assets/train-button.png');
        this.load.image('greyTrainButton', 'src/assets/grey-train-button.png');
        this.load.image('phoneIcon', './src/assets/phone-icon.png');
        this.load.image('phoneScreen', './src/assets/phone-screen.png' );
    }

    create () {
        const config = this.sys.game.config;
        const bg = this.add.image(0, 0, 'trainingRoom');
        
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
        
        // Add the "train here" button
        const trainButton = this.add.image(418, 227.5, 'trainButton');
        trainButton.setScale(.75);
        trainButton.setInteractive({ useHandCursor: true }); 
        trainButton.on('pointerdown', function () { 
            // Disable all other buttons when training tab is on
            phoneIcon.disableInteractive(); 
            trainButton.disableInteractive();
            this.startTraining();
        }, this);


    }

    openPhone () {
        this.scene.start('Phone', { location : './src/assets/training-room.png' , prevScene : 'Training'});
    }

    startTraining () {
        const testBG = this.add.image(this.sys.game.config.width/2, this.sys.game.config.height/2, 'transparentBox');
        testBG.setScale(.75);

        // Welcome scene
        this.add.text(100, 160, 'Welcome to the GDPR training station! Please choose an option below:', { fontFamily: 'Myriad Pro', fontSize: '38px', color: '#4D4D4D'})
        const learnButton = this.add.image(300, 300, 'greyTrainButton');
        this.add.text(205, 285, 'LEARN ABOUT GDPR', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#ffffff'});
        learnButton.setScale(.75);
        learnButton.setInteractive({ useHandCursor: true });

        const testButton = this.add.image(720, 300, 'greyTrainButton');
        this.add.text(610, 285, 'TEST YOUR KNOWLEDGE', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#ffffff'});
        testButton.setScale(.75);
        testButton.setInteractive({ useHandCursor: true });


        // Closing the training tab simply restarts the scene to its initial state
        const closeTrainingButton = this.add.image(50, 50, 'closeTraining');
        closeTrainingButton.setInteractive({ useHandCursor: true }); 
        closeTrainingButton.on('pointerdown', () => this.scene.restart()); 
    }
    
}

export default TrainingScene;
