import 'phaser';

class TrainingOptionsScene extends Phaser.Scene {
    constructor() {
        super('TrainingOptions') // this scene has the key 'Test' when initializing it
    }

    init () {
        this.player = this.sys.game.player;
        this.learningContent = this.sys.game.learningContent;
        this.hasLoaded = false;
    }
 
    preload () {
        this.load.image('trainingRoom', './src/assets/training-room.png');
        this.load.image('transparentBox', './src/assets/transparent-rect.png');
        this.load.image('closeTraining', './src/assets/close-button.png');
        this.load.image('trainButton', './src/assets/train-button.png');
        this.load.image('greyTrainButton', './src/assets/grey-train-button.png');
        this.load.image('phoneIcon', './src/assets/phone-icon.png');
        this.load.image('phoneScreen', './src/assets/phone-screen.png');
        this.load.image('lockIcon', './src/assets/padlock.png');
    }

    create () {
        this.createBackground();
        this.displayKnowledgeMap();
    }

    createBackground () {
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
    
    displayKnowledgeMap () {
        this.add.text(100, 130, 'Welcome to the GDPR training station! Choose a level to start training.', { fontFamily: 'Myriad Pro', fontSize: '38px', color: '#4D4D4D'});
        
        const unlockedLevelColor = 0xF9AF90; 
        const lockedLevelColor = 0xD2D2D2; 
        const topicYCoord = 230;
        const circleYCoord = 300;

        this.add.text(100, topicYCoord, 'Objectives and definitions of GDPR', { fontFamily: 'Myriad Pro Bold', fontSize: '22px', color: '#4D4D4D'});
        this.add.text(440, topicYCoord, 'Key principles of GDPR', { fontFamily: 'Myriad Pro Bold', fontSize: '22px', color: '#4D4D4D'});
        this.add.text(780, topicYCoord, 'Privacy by Design', { fontFamily: 'Myriad Pro Bold', fontSize: '22px', color: '#4D4D4D'});
        
        const levelOneButton = this.add.circle(200, circleYCoord, 30, unlockedLevelColor);
        this.add.text(194, 285, '1', { fontFamily: 'Myriad Pro Bold', fontSize: '30px', color: '#4D4D4D'});
        levelOneButton.setInteractive({ useHandCursor: true }); 
        levelOneButton.on('pointerdown', () => this.scene.start('Learning', { level: 1 })); 

        // Lock level 2 if the current level is below
        if (this.player['level'] < 2) {
            this.add.circle(520, circleYCoord, 30, lockedLevelColor);
            this.add.rectangle(360, circleYCoord, 230, 5, lockedLevelColor);
            const lockIcon = this.add.image(520, circleYCoord, 'lockIcon');
            lockIcon.setScale(0.05);
        } else {
            const levelTwoButton = this.add.circle(520, circleYCoord, 30, unlockedLevelColor);
            levelTwoButton.setInteractive({ useHandCursor: true }); 
            levelTwoButton.on('pointerdown', () => this.scene.start('Learning', { level: 2 })); 
            this.add.rectangle(360, circleYCoord, 230, 5, unlockedLevelColor);
            this.add.text(514, 285, '2', { fontFamily: 'Myriad Pro Bold', fontSize: '30px', color: '#4D4D4D'});
        }

        // Lock level 3 if the current level is below
        if (this.player['level'] < 3) {
            this.add.circle(840, circleYCoord, 30, lockedLevelColor);
            this.add.rectangle(680, circleYCoord, 230, 5, lockedLevelColor);
            const lockIcon = this.add.image(840, circleYCoord, 'lockIcon');
            lockIcon.setScale(0.05);
        } else {
            const levelThreeButton = this.add.circle(840, circleYCoord, 30, unlockedLevelColor);
            levelThreeButton.setInteractive({ useHandCursor: true }); 
            levelThreeButton.on('pointerdown', () => this.scene.start('Learning', { level: 3 })); 
            this.add.rectangle(680, circleYCoord, 230, 5, unlockedLevelColor);
            this.add.text(834, 285, '3', { fontFamily: 'Myriad Pro Bold', fontSize: '30px', color: '#4D4D4D'});
        }
    }

    displayTopicByLevel () {
        if (Object.keys(this.learningContent).length > 0) {
            const levels = ['1', '2', '3'];
            levels.forEach(level => {
                var startXCoord = 0;
                if (level == 1) {
                    startXCoord = 50;
                } else if (level == 2) {
                    startXCoord = 370;
                } else {
                    startXCoord = 680;
                }
                const container = this.add.container(startXCoord, 0);
                this.hasLoaded = true; 
                const topicByLevel = this.learningContent[level].map(content => { return content['topic']; })
                topicByLevel.forEach((topic, id) => {
                    container.add(this.add.text(100, 350 + 25 * id, '* ' + topic, { fontFamily: 'Myriad Pro', fontSize: '22px', color: '#4D4D4D'}));
                });    
            });
        } 
    } 
    
    update () {
        if (Object.keys(this.learningContent).length > 0 && this.hasLoaded == false) {
            this.displayTopicByLevel();
        }
    }
}
export default TrainingOptionsScene;
