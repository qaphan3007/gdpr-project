import 'phaser';
import 'firebase/firestore';

class MeetingRoomDialogue extends Phaser.Scene {
    constructor() {
        super('MeetingDialogue');
    }

    // If ini does not have any parameter, it defaults as ada's dialogueBox
    // However, if this scene is initialized with a dialogue, it will be bill's dialogue progress (28)
    init (data) {
        this.player = this.sys.game.player;
        // Bill's dialogues is based on ada's progress
        // At progress 1, bill will direct the player to ada's location
        // At progress 5 and 17, bill asks whether the player has found ada's location and to come back later
        // At progress 24 and 36, bill will show the player ada's case files
        // If initialized with dialogue, bill will start talking at dialogue 28
        this.nextDialogue = data.nextDialogue;

        // Ada's last dialogue always the same as 24th dialogue
        if (this.nextDialogue == 36) {
            this.nextDialogue = 24;
        } 
        // If ada's dialogue has progressed and bill has not
        if (this.player['billDialogue'] == 1) {
            if (this.nextDialogue == 5 ) { 
                this.nextDialogue = 7;  // Pretend this is our first time talking
            } // 5 and 17 will give the player the same conversation
            else if (this.nextDialogue == 17) { 
                this.nextDialogue = 7;
            }
        } 
        // If bill has progressed past 1 in his dialogue (player has been here to find ada)
        else if (this.nextDialogue == 17) { 
            this.nextDialogue = 5;
        }

        this.dialogues = {
            1 : 'Hey, you looking for something?', 
            2 : 'Oh. She was mentioning about how she neeeded some GDPR help. Must be you, huh?',
            3 : 'I think she must still be in the lunch room taking her break. Off you go!',
            5 : 'Did you find Ada like you needed to?',
            6 : 'No problem! Just let me know if you need anything. See you around.',
            7: 'You need anything?',
            8: 'Just let me know if you need anything later. See you around.',
            24 : 'Hey! You need anything?',
            25: 'I have them here. You need to take a look at them?',
            26: 'Here you go.',
            27: 'Okay, feel free to come back if you decide to change your mind.',
            28: 'Still want a look at the case files?'
        } 
        this.choices = {
            '1-1' : 'Have you seen Ada?',
            '5-1' : 'Yeah I did. Thanks for your help.',
            '7-1' : 'Not really.',
            '24-1' : 'Ada mentioned something about her case files?',
            '25-1' : 'Yes, please.',
            '25-2' : 'No, maybe later. (Leave conversation)'
        }
    }

    preload () {
        this.load.image('meetingRoom', './src/assets/faded-meeting-room.png');
        this.load.image('billPortrait', './src/assets/bill-portrait.png');
        this.load.image('billNameBox', './src/assets/bill-nameBox.png');
        this.load.image('handPointer', './src/assets/hand-pointer.png');
    }

    create () {
        const config = this.sys.game.config;
        const bg = this.add.image(config.width/2, config.height/2,'meetingRoom');
        
        // Scale the background img to fit the height of the game height
        bg.displayHeight = config.height;
        bg.scaleX = bg.scaleY;

        // Render potrait and dialogue box
        this.add.image(180, 230, 'billPortrait').setScale(.6);

        this.dialogueBox = this.add.rectangle(config.width/2, 4*config.height/5, 1000, 200, 0xF2F2F2).setStrokeStyle(1, 0x4D4D4D);
        this.dialogueBox.setInteractive({ useHandCursor: true });
        this.dialogueBox.on('pointerdown', () => this.setDialogue(this.nextDialogue));

        this.handPointer = this.add.image(990, 550, 'handPointer').setScale(.03);
        this.notifEvent = this.time.addEvent({ delay: 500, callback: () => {this.handPointer.visible = !this.handPointer.visible}, callbackScope: this, loop: true });    
        
        
        this.add.image(180, 380, 'billNameBox').setScale(.75);

        this.currentDialogue = this.add.text(90, 420, this.dialogues[this.nextDialogue], { lineSpacing: '10', fontFamily: 'Myriad Pro', fontSize: '30px', color: '#4D4D4D',  align: 'left', wordWrap: { width: 930, useAdvancedWrap: true }});
        
        this.renderOptionBoxes();
    }
    
    renderOptionBoxes () {
        this.optionContainer = this.add.container(0, 0);
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width*2/3;
        var choiceStyle = {
            fontSize: '30px',
            fontFamily: 'Myriad Pro',
            color: '#F2F2F2',
            backgroundColor: '#4D4D4D',
            align: 'left',
            wordWrap: { width: 600, useAdvancedWrap: true }
        };

        this.option1 = this.add.text(screenCenterX, 120, '', choiceStyle).setOrigin(0.5).setPadding(16).setInteractive({ useHandCursor: true });
        this.optionContainer.add(this.option1);
        this.option1.on('pointerover', () => this.option1.setColor('#4D4D4D').setBackgroundColor('#F2F2F2'));
        this.option1.on('pointerout', () => this.option1.setColor('#F2F2F2').setBackgroundColor('#4D4D4D'));

        this.option2 = this.add.text(screenCenterX, 250, '', choiceStyle).setOrigin(0.5).setPadding(16).setInteractive({ useHandCursor: true });
        this.optionContainer.add(this.option2);
        this.option2.on('pointerover', () => this.option2.setColor('#4D4D4D').setBackgroundColor('#F2F2F2'));
        this.option2.on('pointerout', () => this.option2.setColor('#F2F2F2').setBackgroundColor('#4D4D4D'));
        
        this.optionContainer.setVisible(false); // Renders option boxes then hides it to fill in text later
    }

    
    showChoice (option1text, option1next, option2text, option2next = 0) {
        this.dialogueBox.disableInteractive();
        this.optionContainer.setVisible(true);
        
        // If there is only one option
        if (option2text == '') {
            this.option1.setY(200);  
            this.option2.setVisible(false);
        } 
         // By default there are 2 options
        else { 
            this.option1.setY(120);
            this.option2.setY(250);
            this.option2.setVisible(true);
        } 
        
        // After an option is chosen, remove option boxes and render the next dialogue text
        this.option1.setText(this.choices[option1text]);
        this.option1.on('pointerdown', () => {
            this.optionContainer.setVisible(false);
            this.dialogueBox.setInteractive({ useHandCursor: true });
            this.currentDialogue.setText(this.dialogues[option1next]); // Render the next dialogue's text before next click
            this.nextDialogue = option1next;  // dialogueBox button click will go to the next dialogue
        });

        this.option2.setText(this.choices[option2text]);
        this.option2.on('pointerdown', () => {
            this.optionContainer.setVisible(false);
            this.dialogueBox.setInteractive({ useHandCursor: true });
            this.currentDialogue.setText(this.dialogues[option2next]);
            this.nextDialogue = option2next; 
        });
    }

    setDialogue (ID) {
        console.log('Bill progress: ' + this.player['billDialogue']);
        if (ID == 1) {
            this.showChoice('1-1', 2, '');
        } else if (ID == 2) {
            this.nextDialogue = 3;  
            this.currentDialogue.setText(this.dialogues[this.nextDialogue]);
        } else if (ID == 3) {
            // End first convo with bill
            this.player['billDialogue'] = ID;
            this.scene.start('Meeting');
        } else if (ID == 5) {
            // New starting point
            this.showChoice('5-1', 6, '');
        } else if (ID == 6) {
            // End second convo with bill
            this.player['billDialogue'] = ID;
            this.scene.start('Meeting');
        } else if (ID == 7) {
            this.showChoice('7-1', 8, '');
        } else if (ID == 8) {
            // End second convo with bill (version 2)
            this.player['billDialogue'] = ID;
            this.scene.start('Meeting');
        }
        else if (ID == 24) {
            this.showChoice('24-1', 25, '');
        } else if (ID == 25) {
            this.showChoice('25-1', 26, '25-2', 27);
        } else if (ID == 26) {
            // Show case files
            this.player['billDialogue'] = 0;  // Bill dialogue 0 will automatically show the case files.
            this.scene.start('Meeting');
        } else if (ID == 27) {
            // End final convo with bill
            this.scene.start('Meeting');
        } else if (ID == 28) {
            this.showChoice('25-1', 26, '25-2', 27);
        }
    }

}

export default MeetingRoomDialogue;
