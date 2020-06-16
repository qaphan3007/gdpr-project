import 'phaser';

class TestScene extends Phaser.Scene {
    constructor() {
        super('Test') // this scene has the key 'Test' when initializing it
    }
 
    preload () {
        this.load.image('trainingRoom', './src/assets/training-room.png');
        this.load.image('transparentBox', './src/assets/transparent-rect.png');
        this.load.image('closeTraining', './src/assets/close-button.png');
        this.load.image('trainButton', './src/assets/train-button.png');
        this.load.image('greyTrainButton', './src/assets/grey-train-button.png');
        this.load.image('phoneIcon', './src/assets/phone-icon.png');
        this.load.image('phoneScreen', './src/assets/phone-screen.png');
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

        const phoneIcon = this.add.image(1000, 530, 'phoneIcon');
        phoneIcon.setScale(.7);
        
        const testBG = this.add.image(this.sys.game.config.width/2, this.sys.game.config.height/2, 'transparentBox');
        testBG.setScale(.75);

        const closeTrainingButton = this.add.image(50, 50, 'closeTraining');
        closeTrainingButton.setInteractive({ useHandCursor: true }); 
        closeTrainingButton.on('pointerdown', () => this.scene.start('Training')); 

        // Welcome page
        const container = this.add.container(0, 0);

        container.add(this.add.text(100, 160, 'Welcome to the GDPR training station! Please choose an option below:', { fontFamily: 'Myriad Pro', fontSize: '38px', color: '#4D4D4D'}));
        const learnButton = this.add.image(300, 300, 'greyTrainButton');
        container.add(learnButton);
        container.add(this.add.text(205, 285, 'LEARN ABOUT GDPR', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#ffffff'}));
        learnButton.setScale(.75);

        const testButton = this.add.image(720, 300, 'greyTrainButton');
        container.add(testButton);
        container.add(this.add.text(610, 285, 'TEST YOUR KNOWLEDGE', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#ffffff'}));
        testButton.setScale(.75);
        testButton.setInteractive({ useHandCursor: true });
        testButton.on('pointerdown', function () {
            container.destroy();
            this.startTest();
        }, this); 

        
    }

    startTest () {
        // Test information page / choosing difficulty
        const container = this.add.container(70, 70);

        container.add(this.add.text(290, 0, 'TEST YOUR KNOWLEDGE', { fontFamily: 'Myriad Pro Bold', fontSize: '38px', color: '#4D4D4D'}));
        container.add(this.add.text(0, 70, 'This test aims to test the knowledge you gained in the learning section of this level.', { fontFamily: 'Myriad Pro', fontSize: '25px', color: '#4D4D4D'}));
        container.add(this.add.text(0, 105, 'There are 2 different difficulty levels to choose from. In easy mode, there will be no timer. In hard mode, the timer starts', { fontFamily: 'Myriad Pro', fontSize: '25px', color: '#4D4D4D'}));
        container.add(this.add.text(0, 140, 'at 60 seconds for each question, decreasing with 3 seconds after each question.', { fontFamily: 'Myriad Pro', fontSize: '25px', color: '#4D4D4D'}));
        container.add(this.add.text(0, 195, 'To begin the test, please choose a difficulty level:', { fontFamily: 'Myriad Pro', fontSize: '25px', color: '#4D4D4D'}));

        const learnButton = this.add.image(230, 330, 'greyTrainButton');
        container.add(learnButton);
        container.add(this.add.text(205, 315, 'EASY', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#ffffff'}));
        learnButton.setScale(.75);

        const testButton = this.add.image(650, 330, 'greyTrainButton');
        container.add(testButton);
        container.add(this.add.text(630, 315, 'HARD', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#ffffff'}));
        testButton.setScale(.75);
        testButton.setInteractive({ useHandCursor: true });
        testButton.on('pointerdown', function () { 
            container.destroy();
            this.scene.add('HardMode', HardMode, true);
        }, this);
    }
}

class HardMode extends Phaser.Scene {
    constructor () {
        super('HardMode');
    }

    preload () {
        this.load.image('transparentBox', './src/assets/transparent-rect.png');
    }

    create () {
        
    }
}

export default TestScene;
