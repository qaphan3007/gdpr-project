import 'phaser';
import 'firebase/firestore';

class LearnScene extends Phaser.Scene {
    constructor() {
        super('Learning') 
    }

    init (data) {
        this.db = this.sys.game.db;
        this.learningContent = this.sys.game.learningContent;
        this.player = this.sys.game.player;
        this.level = data.level;
        console.log('Data level ' + this.level)
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
        this.setBackground();
        this.displayLearningContent(0);
    }

    setBackground () {
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
    }

    displayLearningContent (index) {
        console.log(this.level)
        const content = this.learningContent[this.level]

        const topic = content[index]['topic'];
        const description = content[index]['description'];
        
        const container = this.add.container(70, 70);
        container.add(this.add.text(370, 0, topic, { fontFamily: 'Myriad Pro Bold', fontSize: '38px', color: '#4D4D4D', align: 'center', wordWrap: { width: 400, useAdvanceWrap: true }}));
        container.add(this.add.text(0, 70, description, { fontFamily: 'Myriad Pro', fontSize: '25px', color: '#4D4D4D', align: 'left', wordWrap: { width: 930, useAdvanceWrap: true }}));
        
        if (index < content.length - 1) {
            const nextButton = this.add.image(750, 430, 'greyTrainButton');
            container.add(nextButton);
            container.add(this.add.text(730, 415, 'NEXT', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#ffffff'}));
            nextButton.setScale(.75);
            nextButton.setInteractive({ useHandCursor: true });
            nextButton.on('pointerdown', function () { 
                container.destroy();
                this.displayLearningContent(index + 1, content);
            }, this);            
        } else {
            // Finish learning for this level and continue to test
            var nextScene = '';
            if (this.level == 1) {
                nextScene = 'Test';
            } else if (this.level == 2) {
                nextScene = 'TestLevel2';
            } else {
                nextScene = 'TestLevel3';
            }
            const completeButton = this.add.image(750, 430, 'greyTrainButton');
            container.add(completeButton);
            container.add(this.add.text(708, 415, 'START TEST', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#ffffff'}));
            completeButton.setScale(.75);
            completeButton.setInteractive({ useHandCursor: true });
            completeButton.on('pointerdown', function () { 
                container.destroy();
                this.scene.start(nextScene);
            }, this); 
        }
        if (index > 0) {
            const backButton = this.add.image(150, 430, 'greyTrainButton');
            container.add(backButton);
            container.add(this.add.text(130, 415, 'BACK', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#ffffff'}));
            backButton.setScale(.75);
            backButton.setInteractive({ useHandCursor: true });
            backButton.on('pointerdown', function () { 
                container.destroy();
                this.displayLearningContent(index - 1, content);
            }, this);
        }
    }
}

export default LearnScene;
