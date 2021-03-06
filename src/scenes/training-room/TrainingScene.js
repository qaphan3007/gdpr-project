import 'phaser';
import 'firebase/firestore';

class TrainingScene extends Phaser.Scene {
    constructor() {
        super('Training') 
    }

    init() {
        this.db = this.sys.game.db;
        this.player = this.sys.game.player;
        this.learningContent = this.sys.game.learningContent;
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
        this.updateLearningContent();
        this.createBackground();
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

        // Add the phone button as an image to make it interactive
        const phoneIcon = this.add.image(1000, 530, 'phoneIcon');
        phoneIcon.setScale(.7);
        phoneIcon.setInteractive({ useHandCursor: true });  // Cursor style change when hovering 
        // Open phone scene on click
        phoneIcon.on('pointerdown', () => this.scene.start('Phone', { location : './src/assets/training-room.png' , prevScene : 'Training'})); // pointerdown = onClick event
        
        // Make phone notification if there are new achievements or objectives
        if (this.player['newAchievement'] || this.player['newObjective']) {
            this.notifCircle = this.add.circle(1015, 505, 10, 0xFD1818);
            this.notifEvent = this.time.addEvent({ delay: 500, callback: () => {this.notifCircle.visible = !this.notifCircle.visible}, callbackScope: this, loop: true });    
        }

        // Add the "train here" button
        const trainButton = this.add.image(418, 227.5, 'trainButton');
        trainButton.setScale(.75);
        trainButton.setInteractive({ useHandCursor: true }); 
        trainButton.on('pointerdown', function () { 
            // Disable all other buttons when training tab is on
            phoneIcon.disableInteractive(); 
            trainButton.disableInteractive();
            this.scene.start('TrainingOptions');
        }, this);
    }

    // Load learning content from DB in this scene to ensure it is loaded before TrainingOptions
    updateLearningContent () {
        const levels = ['1', '2', '3'];
        if (Object.keys(this.learningContent).length == 0 ) {
            levels.forEach(async (level) => {
                var contentArray = await this.getLearningContentFromDB(level)
                    .then((content) => { return content });
                this.learningContent[level] = contentArray;
            });
        } 
    }

    async getLearningContentFromDB(level) {
        /* 
            Get all learning content and save it to send to LearnScene
         */
        var contentArray = [];
        return new Promise((resolve, reject) => {
            this.db.collection('learning-content').doc('levels').collection(level)
                .get()
                .then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        contentArray[doc.id-1] = doc.data();
                    });
                    return resolve(contentArray);
                })
                .catch(function(error) {
                    return reject(error);
                });
        });
    }
}

export default TrainingScene;
