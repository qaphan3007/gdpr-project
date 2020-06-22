import 'phaser';

class TestScene extends Phaser.Scene {
    constructor() {
        super('Test') // this scene has the key 'Test' when initializing it
    }

    init () {
        this.currentAnswer = [];
        this.player = this.sys.game.player;
    }
 
    preload () {
        this.load.image('trainingRoom', './src/assets/training-room.png');
        this.load.image('transparentBox', './src/assets/transparent-rect.png');
        this.load.image('closeTraining', './src/assets/close-button.png');
        this.load.image('greyTrainButton', './src/assets/grey-train-button.png');
        this.load.image('phoneIcon', './src/assets/phone-icon.png');
    }

    create () {
    /* 
        *  How to create rounded edge buttons in the game ! With colors! No more manual image adding!
        *  Each graphics is one button object, so we would have to draw several for several buttons.
        
        const graphics = this.add.graphics();
        graphics.fillStyle(0x4DD9FF);
        graphics.fillRoundedRect(500, 150, 250, 80, 10);    // (x, y, width, height, rounded radius)
        // Add text inside rect with 'padding' of 20 pixels
        this.add.text(520, 170,'Button text here', textStyle);
    */
        const bg = this.add.image(this.sys.game.config.width/2, this.sys.game.config.height/2, 'trainingRoom');
        // Scale the background img to fit the height of the game height
        bg.displayHeight = this.sys.game.config.height;
        bg.scaleX = bg.scaleY;

        const phoneIcon = this.add.image(1000, 530, 'phoneIcon');
        phoneIcon.setScale(.7);
        
        const testBG = this.add.image(this.sys.game.config.width/2, this.sys.game.config.height/2, 'transparentBox');
        testBG.setScale(.75);

        const closeTrainingButton = this.add.image(50, 50, 'closeTraining');
        closeTrainingButton.setInteractive({ useHandCursor: true }); 
        closeTrainingButton.on('pointerdown', () => this.scene.start('Training')); 
        if (this.player['level'] == 1) {
            this.startLevelOne();
        } else {
            this.scene.start('TestLevel2');
        }
    }

    startLevelOne () {
        // Test information page / choosing difficulty
        const container = this.add.container(70, 70);

        container.add(this.add.text(290, 0, 'TEST YOUR KNOWLEDGE', { fontFamily: 'Myriad Pro Bold', fontSize: '38px', color: '#4D4D4D'}));
        container.add(this.add.text(0, 70, 'This test aims to test the knowledge you gained in the learning section of this level.', { fontFamily: 'Myriad Pro', fontSize: '25px', color: '#4D4D4D'}));
        container.add(this.add.text(0, 105, 'There are 2 different difficulty levels to choose from. In easy mode, there will be no timer. In hard mode, the timer starts', { fontFamily: 'Myriad Pro', fontSize: '25px', color: '#4D4D4D'}));
        container.add(this.add.text(0, 140, 'at 60 seconds for each question.', { fontFamily: 'Myriad Pro', fontSize: '25px', color: '#4D4D4D'}));
        container.add(this.add.text(0, 195, 'To begin the test, please choose a difficulty level:', { fontFamily: 'Myriad Pro', fontSize: '25px', color: '#4D4D4D'}));

        const easy = this.add.image(230, 330, 'greyTrainButton');
        container.add(easy);
        container.add(this.add.text(205, 315, 'EASY', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#ffffff'}));
        easy.setScale(.75);
        easy.setInteractive(({ useHandCursor: true }));
        easy.on('pointerdown', function () { 
            container.destroy();
            this.difficulty = 'Easy'
            this.chooseDifficulty(this.difficulty);
        }, this);

        const hard = this.add.image(650, 330, 'greyTrainButton');
        container.add(hard);
        container.add(this.add.text(630, 315, 'HARD', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#ffffff'}));
        hard.setScale(.75);
        hard.setInteractive({ useHandCursor: true });
        hard.on('pointerdown', function () { 
            container.destroy();
            this.difficulty = 'Hard'
            this.chooseDifficulty(this.difficulty);
        }, this);
    }

    chooseDifficulty (difficulty) {
        // Timer if hard mode, else no timer
        if (difficulty == 'Hard') {
            this.currentTimer = 60;
            this.timerCircle = this.add.circle(631, 53, 30, 0xBCBCBC);
            this.displayTime = this.add.text(620, 35, this.currentTimer,  { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#FFFFFF'} );

            // Each 1000 ms call countdown and set text to -1
            this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.countdown, callbackScope: this, loop: true });
        }
        this.container = this.add.container(0, 0);

        this.container.add(this.add.text(100, 32, 'LEVEL 1', { fontFamily: 'Myriad Pro Bold', fontSize: '38px', color: '#4D4D4D'} ));
        this.container.add(this.add.text(430, 31, 'Question 1', { fontFamily: 'Myriad Pro Bold', fontSize: '38px', color: '#4D4D4D'} ));

        this.container.add(this.add.text(100, 100, 'Match the term and definition:', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#4D4D4D'} ));

        var textStyle = {
            fontSize: '18px',
            fontFamily: 'Myriad Pro',
            color: '#4D4D4D',
            align: 'left',
            wordWrap: { width: 330, useAdvancedWrap: true }
        };

        this.container.add(this.add.ellipse(490, 350, 200, 100, 0x4D4D4D));
        this.container.add(this.add.text(430, 330, 'Personal data', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#FFFFFF'}));

        //  16px padding around all sides. Text with bg color and padding creates a rectangle around it
        const alt1 = this.add.text(120, 170, 'Any information which is related to an identified or identifiable natural person.', textStyle).setPadding(16).setBackgroundColor('#B3EEFF');
        this.container.add(alt1);
        alt1.setInteractive({ useHandCursor: true });
        alt1.on('pointerover', () => alt1.setBackgroundColor('#4DD9FF')); // Change color of button on hover
        alt1.on('pointerout', () => alt1.setBackgroundColor('#B3EEFF'));
        alt1.on('pointerdown', function () {
            this.currentAnswer[0] = alt1.text;
            this.container.destroy();
            this.nextQuestion();
        }, this);

        const alt2 = this.add.text(560, 200, 'A natural or legal person, public authority, agency or other body which, alone or jointly with others, determines the purposes and means of the processing of personal data.', textStyle).setPadding(16).setBackgroundColor('#B7EFB7');
        this.container.add(alt2);
        alt2.setInteractive({ useHandCursor: true });
        alt2.on('pointerover', () => alt2.setBackgroundColor('#33CC33'));
        alt2.on('pointerout', () => alt2.setBackgroundColor('#B7EFB7'));
        alt2.on('pointerdown', function () {
            this.currentAnswer[0] = alt2.text;
            this.container.destroy();
            this.nextQuestion();
        }, this);

        const alt3 = this.add.text(130, 450, 'A natural or legal person, public authority, agency or other body which processes personal data on behalf of the controller.', textStyle).setPadding(16).setBackgroundColor('#FFDAB3');
        this.container.add(alt3);
        alt3.setInteractive({ useHandCursor: true });
        alt3.on('pointerover', () => alt3.setBackgroundColor('#FF8000'));
        alt3.on('pointerout', () => alt3.setBackgroundColor('#FFDAB3'));
        alt3.on('pointerdown', function () {
            this.currentAnswer[0] = alt3.text;
            this.container.destroy();
            this.nextQuestion();
        }, this);
    }

    nextQuestion () {
        // Restart timer to 60
        this.currentTimer = 60;

        this.container = this.add.container(0, 0);

        this.container.add(this.add.text(100, 32, 'LEVEL 1', { fontFamily: 'Myriad Pro Bold', fontSize: '38px', color: '#4D4D4D'} ));
        this.container.add(this.add.text(430, 31, 'Question 2', { fontFamily: 'Myriad Pro Bold', fontSize: '38px', color: '#4D4D4D'} ));

        this.container.add(this.add.text(100, 120, 'What is a controller?', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#4D4D4D'} ));

        var textStyle = {
            fontSize: '25px',
            fontFamily: 'Myriad Pro',
            color: '#B3B3B3',
            align: 'left',
            wordWrap: { width: 800, useAdvancedWrap: true }
        };

        const alt1 = this.add.text(100, 180, '- Any operation or set of operations which is performed on personal data or on sets of personal data.', textStyle);
        this.container.add(alt1);
        alt1.setInteractive({ useHandCursor: true });
        alt1.on('pointerover', () => alt1.setColor('#4D4D4D') );  // Change text color on hover
        alt1.on('pointerout', () => alt1.setColor('#B3B3B3') );
        alt1.on('pointerdown', function () {
            this.currentAnswer[1] = alt1.text.substr(2);
            this.container.destroy();
            this.clearLevel();
        }, this);
        const alt2 = this.add.text(100, 240, '- A natural or legal person, public authority, agency or other body which, alone or jointly with others, determines the purposes and means of the processing of personal data.', textStyle);
        this.container.add(alt2);
        alt2.setInteractive({ useHandCursor: true });
        alt2.on('pointerover', () => alt2.setColor('#4D4D4D') );
        alt2.on('pointerout', () => alt2.setColor('#B3B3B3') );
        alt2.on('pointerdown', function () {
            this.currentAnswer[1] = alt2.text.substr(2);
            this.container.destroy();
            this.clearLevel();
        }, this);
        const alt3 = this.add.text(100, 320, '- A natural or legal person, public authority, agency or other body which processes personal data on behalf of the controller.', textStyle);
        this.container.add(alt3);
        alt3.setInteractive({ useHandCursor: true });
        alt3.on('pointerover', () => alt3.setColor('#4D4D4D') );
        alt3.on('pointerout', () => alt3.setColor('#B3B3B3') );
        alt3.on('pointerdown', function () {
            this.currentAnswer[1] = alt3.text.substr(2);
            this.container.destroy();
            this.clearLevel();
        }, this);
    }

    clearLevel () {
        // Destroy timer
        if (this.difficulty == 'Hard') {
            this.timedEvent.remove();
            this.timerCircle.destroy();
            this.displayTime.destroy();
        }

        // Check if correct answer
        const correctAnswer = ['Any information which is related to an identified or identifiable natural person.', 'A natural or legal person, public authority, agency or other body which, alone or jointly with others, determines the purposes and means of the processing of personal data.']
        var correctCount = 0;
        const correctMax = correctAnswer.length;

        const container = this.add.container(0, 0);
        container.add(this.add.text(430, 35, 'RESULTS', { fontFamily: 'Myriad Pro Bold', fontSize: '38px', color: '#4D4D4D'} ));
        container.add(this.add.text(100, 120, 'Question 1:', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#4D4D4D'} ));
        
        if (this.currentAnswer[0] == correctAnswer[0]) {
            container.add(this.add.text(240, 120, 'Correct', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#32CD32'} ));
            correctCount += 1;
        } else {
            container.add(this.add.text(240, 120, 'Incorrect', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#DC143C'} ));
        }
        container.add(this.add.text(100, 180, 'Question 2', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#4D4D4D'} ));
        if (this.currentAnswer[1] == correctAnswer[1]) {
            correctCount += 1;
            container.add(this.add.text(240, 180, 'Correct', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#32CD32'} ));
        } else {
            container.add(this.add.text(240, 180, 'Incorrect', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#DC143C'} ));
        }

        // If all answers correct, next level
        if (correctCount == correctMax) {
            container.add(this.add.text(120, 400, 'You have completed this level!', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#4D4D4D'} ));
            
            // Player gets an achievement for completing testing the first level, finish objective 2
            if (this.player['level'] == 1) {
                this.player['achievements'].push(2);
                this.player['newAchievement'] = true;
                this.player['objective'] = 3;
            }
            const clearButton = this.add.image(450, 500, 'greyTrainButton');
            container.add(clearButton);
            container.add(this.add.text(400, 485, 'NEXT LEVEL', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#ffffff'}));
            clearButton.setScale(.75);
            clearButton.setInteractive({ useHandCursor: true });
            clearButton.on('pointerdown', () => {
                this.player['level'] += 1;
                this.scene.start('Reception');
            });
        } else {  // Retry the level if not all answers are correct.
            container.add(this.add.text(120, 380, 'You need to answer all questions correctly to pass the level.', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#4D4D4D'} ));

            const retryButton = this.add.image(300, 500, 'greyTrainButton');
            container.add(retryButton);
            container.add(this.add.text(400, 485, 'RETRY LEVEL', { fontFamily: 'Myriad Pro', fontSize: '30px', color: '#ffffff'}));
            retryButton.setScale(.75);
            retryButton.setInteractive({ useHandCursor: true });
            retryButton.on('pointerdown', function () {
                container.destroy();
                this.startLevelOne();
            }, this);
        }

    }

    countdown () {
        if (this.currentTimer == 0) {
            this.container.destroy();
            this.clearLevel();
        } else {
            this.currentTimer -= 1; // One second
            this.displayTime.setText(this.currentTimer);
        }
    }
}

export default TestScene;
