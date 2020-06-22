import 'phaser';
import 'firebase/firestore';

class CaseQuestionScene extends Phaser.Scene {
    constructor() {
        super('CaseQuestion') 
    }
    
    init () {
        this.db = this.sys.game.db;
        this.player = this.sys.game.player;
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
        this.displayQuestions();
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

    async displayQuestions () {
        const caseNum = this.player['case'].toString();
        const questions = await this.loadQuestionsFromDB(caseNum)
            .then((questions) => { return questions });
        this.showQuestion(0, questions);
    }

    async loadQuestionsFromDB (caseNum) {
        var questionArray = [];
        return new Promise((resolve, reject) => {
            this.db.collection('scenarios').doc(caseNum).collection('questions')
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    questionArray[doc.id - 1] = doc.data();
                });
                return resolve(questionArray);
            })
            .catch(function(error) {
                return reject(error);
            });
        });
    }

    notifyNoCase () {
        const container = this.add.container(70, 70);
        container.add(this.add.text(70, 150, 'You have finished solving all cases. Check back later to see if a trainer has added more cases!', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#4D4D4D', align: 'center', wordWrap: { width: 800, useAdvanceWrap: true }}));
        
        const completeButton = this.add.image(460, 300, 'greyTrainButton');
        container.add(completeButton);
        container.add(this.add.text(405, 288, 'CLOSE WINDOW', { fontFamily: 'Myriad Pro', fontSize: '25px', color: '#ffffff'}));
        completeButton.setScale(.6);
        completeButton.setInteractive({ useHandCursor: true });
        completeButton.on('pointerdown', function () { 
            this.scene.start('Meeting')
        }, this);  
    }

    showQuestion (questionNum, questions) {
        const question = questions[questionNum]['question'];
        
        const container = this.add.container(70, 70);
        container.add(this.add.text(390, 0, 'Question ' + (questionNum + 1).toString(), { fontFamily: 'Myriad Pro Bold', fontSize: '38px', color: '#4D4D4D'}));
        container.add(this.add.text(0, 70, question, { fontFamily: 'Myriad Pro', fontSize: '25px', color: '#4D4D4D', align: 'left', wordWrap: { width: 930, useAdvanceWrap: true }}));
        
        const alternatives = Object.values(questions[questionNum]['alts']);

        alternatives.forEach((alternative, currentIndex) => {
            const altText = (currentIndex + 1).toString() + ') ' + alternative['alt']
            const alt = this.add.text(20, 100 + (currentIndex + 1) * 40, altText, { fontFamily: 'Myriad Pro', fontSize: '25px', color: '#B3B3B3', align: 'left', wordWrap: { width: 930, useAdvanceWrap: true }});
            container.add(alt);
            alt.setInteractive({ useHandCursor: true });
            alt.on('pointerover', () => alt.setColor('#4D4D4D') );  // Change text color on hover
            alt.on('pointerout', () => alt.setColor('#B3B3B3') );
            alt.on('pointerdown', () => {
                container.destroy();
                this.showFeedback(questionNum, questions, currentIndex);
            });
        })
    }

    showFeedback (questionNum, questions, answerIndex) {
        const question = questions[questionNum]['question'];
        
        const container = this.add.container(70, 70);
        container.add(this.add.text(390, 0, 'Question ' + (questionNum + 1).toString(), { fontFamily: 'Myriad Pro Bold', fontSize: '38px', color: '#4D4D4D'}));
        container.add(this.add.text(0, 70, question, { fontFamily: 'Myriad Pro', fontSize: '25px', color: '#4D4D4D', align: 'left', wordWrap: { width: 930, useAdvanceWrap: true }}));
        
        const alternatives = Object.values(questions[questionNum]['alts']);

        // Show the alternatives with correct answer marked with colors, chosen answer has bold font
        alternatives.forEach((alternative, currentIndex) => {
            const altText = (currentIndex + 1).toString() + ') ' + alternative['alt']
            const correctColor = '#32CD32'; // Green
            const incorrectColor = '#DC143C'; // Red
            const altColor = alternative['correct'] ? correctColor : incorrectColor;
            const altFont = currentIndex == answerIndex ? 'Myriad Pro Bold' : 'Myriad Pro';
            const alt = this.add.text(20, 100 + (currentIndex + 1) * 40, altText, { fontFamily: altFont, fontSize: '25px', color: altColor, align: 'left', wordWrap: { width: 870, useAdvanceWrap: true }});
            container.add(alt);
        })
        
        // Show the feedback of the current answer
        const feedbackText = 'Feedback on your answer:';
        var feedbackYPosition = 130 + (alternatives.length + 1) * 40;
        container.add(this.add.text(0, feedbackYPosition, feedbackText, { fontFamily: 'Myriad Pro', fontSize: '25px', color: '#4D4D4D', align: 'left', wordWrap: { width: 870, useAdvanceWrap: true }}));
        container.add(this.add.text(20, feedbackYPosition + 40, alternatives[answerIndex]['feedback'], { fontFamily: 'Myriad Pro', fontSize: '25px', color: '#4D4D4D', align: 'left', wordWrap: { width: 870, useAdvanceWrap: true }}));

        // Press on the button to go to the next question
        if (questionNum < questions.length - 1) {
            const nextButton = this.add.image(795, 10, 'greyTrainButton');
            container.add(nextButton);
            container.add(this.add.text(740, 0, 'NEXT QUESTION', { fontFamily: 'Myriad Pro', fontSize: '25px', color: '#ffffff'}));
            nextButton.setScale(.6);
            nextButton.setInteractive({ useHandCursor: true });
            nextButton.on('pointerdown', function () { 
                container.destroy();
                this.showQuestion(questionNum + 1, questions);
            }, this);            
        } else {
            // Finish the case if there are no more questions
            const finishButton = this.add.image(795, 10, 'greyTrainButton');
            container.add(finishButton);
            container.add(this.add.text(745, 0, 'FINISH CASE', { fontFamily: 'Myriad Pro', fontSize: '25px', color: '#ffffff'}));
            finishButton.setScale(.6);
            finishButton.setInteractive({ useHandCursor: true });
            finishButton.on('pointerdown', function () { 
                container.destroy();
                this.player['case'] += 1;
                if (! this.player['achievements'].includes(4)) {
                    this.finishSolvingFirstCase();
                } else {
                    this.scene.start('Meeting');
                }
            }, this);     
        }
    }
    
    finishSolvingFirstCase () {
        // Player gets an achievement for solving a case and finish objective 3
        this.player['achievements'].push(4);
        this.player['objective'] = 4;
        this.player['newAchievement'] = true;
        this.player['newObjective'] = true;
        
        const container = this.add.container(70, 70);
        container.add(this.add.text(70, 150, 'You have finished solving a case and got an achievement. Check out your achievements on your phone! You also finished all objectives and unlocked all rooms available in this demo. Congratulations!', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#4D4D4D', align: 'center', wordWrap: { width: 800, useAdvanceWrap: true }}));
        
        const completeButton = this.add.image(460, 300, 'greyTrainButton');
        container.add(completeButton);
        container.add(this.add.text(405, 288, 'CLOSE WINDOW', { fontFamily: 'Myriad Pro', fontSize: '25px', color: '#ffffff'}));
        completeButton.setScale(.6);
        completeButton.setInteractive({ useHandCursor: true });
        completeButton.on('pointerdown', function () { 
            this.scene.start('Meeting')
        }, this);  
    }
}

export default CaseQuestionScene;
