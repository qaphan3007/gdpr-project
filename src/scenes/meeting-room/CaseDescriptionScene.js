import 'phaser';
import 'firebase/firestore';

class CaseDescriptionScene extends Phaser.Scene {
    constructor() {
        super('CaseDescription') 
    }

    init () {
        this.caseDescriptionFramework = [
            'Introduction to the company',
            'The cause of the project',
            'Role in project',
            'Project description',
            'Case description'
        ];
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
        this.displayCaseDescription();
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

    async displayCaseDescription () {
        const caseDescription = await this.loadCaseDescriptionFromDB('1')
            .then((content) => { return content });
        this.startDisplay(1, caseDescription);
    }

    async loadCaseDescriptionFromDB (caseNum) {
        return new Promise((resolve, reject) => {
            this.sys.game.db.collection('scenarios').doc(caseNum)
            .get()
            .then(function(doc) {
                if (doc.exists) {
                    return resolve(doc.data()['description']);
                } 
            })
            .catch(function(error) {
                return reject(error);
            });
        });
    }

    startDisplay (descriptionNum, descriptions) {
        const title = this.caseDescriptionFramework[descriptionNum - 1]
        const description = descriptions[descriptionNum.toString()]
        
        const container = this.add.container(70, 70);
        container.add(this.add.text(300, 0, title, { fontFamily: 'Myriad Pro Bold', fontSize: '38px', color: '#4D4D4D'}));
        container.add(this.add.text(0, 70, description, { fontFamily: 'Myriad Pro', fontSize: '25px', color: '#4D4D4D', align: 'left', wordWrap: { width: 930, useAdvanceWrap: true }}));
        
        
        if (descriptionNum < Object.keys(descriptions).length) {
            const nextButton = this.add.image(750, 430, 'greyTrainButton');
            container.add(nextButton);
            container.add(this.add.text(730, 415, 'NEXT', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#ffffff'}));
            nextButton.setScale(.75);
            nextButton.setInteractive({ useHandCursor: true });
            nextButton.on('pointerdown', function () { 
                container.destroy();
                this.startDisplay(descriptionNum + 1, descriptions);
            }, this);            
        } else {
            // Finish reading the case and go back to meeting room
            const completeButton = this.add.image(750, 430, 'greyTrainButton');
            container.add(completeButton);
            container.add(this.add.text(720, 415, 'FINISH', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#ffffff'}));
            completeButton.setScale(.75);
            completeButton.setInteractive({ useHandCursor: true });
            completeButton.on('pointerdown', function () { 
                this.scene.start('Meeting');
            }, this); 
        }
        if (descriptionNum > 1) {
            const backButton = this.add.image(150, 430, 'greyTrainButton');
            container.add(backButton);
            container.add(this.add.text(130, 415, 'BACK', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#ffffff'}));
            backButton.setScale(.75);
            backButton.setInteractive({ useHandCursor: true });
            backButton.on('pointerdown', function () { 
                container.destroy();
                this.startDisplay(descriptionNum - 1, descriptions);
            }, this);
        }
    }
}

export default CaseDescriptionScene;
