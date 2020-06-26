import 'phaser';

class LunchDialogue extends Phaser.Scene {
    constructor() {
        super('LunchDialogue');
    }

    init () { 
        this.player = this.sys.game.player; 
        // Ada's progress is updated at four points: 5, 17, 24, 36
        this.nextDialogue = this.player['adaDialogue']; // Default dialogue progress is 1
        this.savePoint = 1;
        this.dialogues = {
            1: 'Hello! How are you doing? Anything exciting to gossip about?',
            2: 'Actually, I might need a little consulting. Do you know anything about GDPR?',
            3: 'Oh! How exciting! Actually, I may need a little consulting for my current project. It is related to the GDPR. Maybe you can offer some insight about it since you have just undergone GDPR training?', 
            4: 'Okay! Please talk to me anytime if you change your mind.',
            5: 'Welcome back! Let us continue, shall we?',
            6: 'I’m in a project called the “Goggle Maps GDPR compliance” project, and involves Goggle. Have you heard of the company Goggle before?',
            7: 'Haha, of course! I mean, who hasn’t heard of Goggle?',
            8: 'Goggle is one of the biggest tech companies today, with many services such as the popular browser Goggle Chrome, and the mapping service Goggle Maps. The latter service is the focus of our project this time.',
            9: 'Currently, their Goggle Maps application is collecting personal data from their users, such as location data. With the installment of GDPR, actions must be taken in order to make this data collection compliance with the new regulation.',
            10: 'Goggle has been asked to define the data collected and create a consent form with predefined settings that a user must accept before they can continue to use the service. Here is where we come in.',
            11: 'Location data is a type of personal data. I’m sure you are familiar with this term from your GDPR training.',
            12: 'Location data is one of the most important types of data for Goggle Maps to provide useful, meaningful experiences while using the app. From driving directions, to making sure your search results include things near you, to showing you when a restaurant is typically busy.',
            13: 'Location can make your experiences across Goggle more relevant and helpful.',
            14: 'Haha! In case of emergencies, it is indeed very helpful to filter out results local to you. Additionally, location information also helps with some core product functionality, like providing a website in the right language or helping to keep Goggle’s services secure.',
            15: 'The main problem of our project is more specific than this, though. Would you like to hear about it now?',
            16: 'Okay! Please talk to me anytime if you want to hear more about it.',
            17: ' Welcome back! Let’s hear about our problem.',
            18: 'Our case mostly pertains to the Goggle Maps services. By collecting the location data, users are able to see their location history. This is central in a service called “Timeline” offered by Goggle Maps, which shows users a map of where they have been in the past based on time.',
            19: 'This is where the problem comes in. As location data is a type of personal data, Goggle must have consent from the user before tracking their location.',
            20: 'Yes. My team has drafted a proposal that describes what part of the system requires consent from the users. Based on this, we have created a prototype of the settings of the service as a pop-up that will automatically appear on screen for every user that uses the page.',
            21: 'Currently, we’re in the process of reviewing the prototype. There are several choices taken during the implementation of the prototype that needed to be discussed.',
            22: 'Yes. I have a few questions if you don’t mind. Are you up to it?',
            23: 'Okay. There is a case file in my office if you want to review the entire case before we proceed.',
            24: 'Welcome back, ready to begin?',
            25: 'Okay! First question. How do you think we should inform the users of the app we’re tracking their data?',
            26: 'That sounds smart. Location history collects the data of the user, and therefore the user should have a way to manage this. Having this in the settings will ensure that the user at any time may change the way the app gathers their personal data.',
            27: 'That sounds smart. As location data is a type of personal data, Goggle Maps should explain what it is and how it is used through the Privacy Policy.',
            28: 'However, as it is not needed for Goggle Maps to collect this data for the app to perform its core function, it should be optional for the user to share their location with the app.',
            29: 'That’s incorrect! Goggle Maps actually doesn’t really need to collect their users’ location data in order to perform the core function functionality of the app, which is to provide a map of the world',
            30: ' Tracking the location of the users would only serve to help Goggle develop better algorithms and provide “Timeline”, which is not a core function of the app.',
            31: 'Next question: If we include this “Location History” setting so the user can toggle between enabling and disabling it, what do you think the default value of it should be?',
            32: 'That doesn’t sound right. Collecting data of the users may be beneficial for them as it provides better user experience during app use. But according to GDPR, privacy should be protected by default. The user should not need to do anything extra to protect their privacy.',
            33: 'That sounds right. According to the GDPR, privacy should be set by default. Having the setting off in default will protect the privacy of the user, and complies with GDPR.',
            34: 'Hmm, I think that was all the concerns I had for now. Thank you for talking to me; it helped me to reflect over the problem better. I better finish my lunch and then continue to work now.',
            35: 'Feel free to talk to me again if you have any questions. The case file will always be available in my office if you wish to review it, just ask my assistant Bill! See you around!'
        }
        this.choices = {
            '1-1' : '(Tell Ada about your new GDPR training)',
            '1-2' : 'Nothing much, what about you?',
            '2-1' : 'Yes, I actually just went through GDPR training not too long ago.',
            '3-1' : 'Sure! I’ll hear you out.',
            '3-2' : 'Maybe later. I still have other things to do. (Leave conversation)',
            '6-1' : 'Yes.',
            '6-2' : 'No.',
            '10-1' : 'What is location data? Why is it so important?',
            '13-1' : 'You’re right. It was very helpful when I traveled to Spain last summer and had to find a nearby restaurant for a quick bite so I could make the train to the next city.',
            '15-1' : 'Sure!',
            '15-2' : 'Maybe later. I still have other things to do. (Leave conversation)',
            '19-1' : 'So this is your main task?',
            '21-1' : 'The choices made during the implementation?',
            '22-1' : 'Sure! I’m ready.',
            '22-2' : 'Maybe later. (Leave conversation)',
            '24-1' : 'Absolutely!',
            '25-1' : 'Include “Location History” as a setting in the prototype.',
            '25-2' : 'Describe how Goggle Maps gathers and uses the location data of the users in the Privacy Policy.',
            '25-3' : 'Location data is a core service of Goggle Maps, and therefore consent is not really needed.',
            '31-1' : 'On.',
            '31-2' : 'Off'
        }
    }
    
    preload () {
        this.load.image('lunchRoom', './src/assets/faded-lunch-room.png');
        this.load.image('adaPortrait', './src/assets/ada-portrait.png');
        this.load.image('adaNameBox', './src/assets/ada-nameBox.png')
    }

    create () {
        // Render background
        const config = this.sys.game.config;
        const bg = this.add.image(config.width/2, config.height/2, 'lunchRoom');
        bg.displayHeight = config.height;
        bg.scaleX = bg.scaleY;

        // Render potrait and dialogue box
        this.add.image(180, 230, 'adaPortrait').setScale(.6);

        this.dialogueBox = this.add.rectangle(config.width/2, 4*config.height/5, 1000, 200, 0xF2F2F2).setStrokeStyle(1, 0x4D4D4D);
        this.dialogueBox.setInteractive({ useHandCursor: true });
        this.dialogueBox.on('pointerdown', () => this.setDialogue(this.nextDialogue));
        
        this.add.image(180, 380, 'adaNameBox').setScale(.75);

        this.currentDialogue = this.add.text(90, 420, this.dialogues[this.nextDialogue], { lineSpacing: '10', fontFamily: 'Myriad Pro', fontSize: '30px', color: '#4D4D4D',  align: 'left', wordWrap: { width: 930, useAdvancedWrap: true }});
        
        // Option boxes are rendered once, then toggle between visible and invisible when needed in showChoice
        this.renderOptionBoxes(); 
    }

    renderOptionBoxes () {
        this.optionContainer = this.add.container(0, 0);
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width*2/3;
        var choiceStyle = {
            fontSize: '30px',
            fontFamily: 'Myriad Pro',
            color: '#4D4D4D',
            backgroundColor: '#F2F2F2',
            align: 'left',
            wordWrap: { width: 600, useAdvancedWrap: true }
        };

        this.option1 = this.add.text(screenCenterX, 120, '', choiceStyle).setOrigin(0.5).setPadding(16).setInteractive({ useHandCursor: true });
        this.optionContainer.add(this.option1);
        this.option1.on('pointerover', () => this.option1.setColor('#F2F2F2').setBackgroundColor('#4D4D4D'));
        this.option1.on('pointerout', () => this.option1.setColor('#4D4D4D').setBackgroundColor('#F2F2F2'));

        this.option2 = this.add.text(screenCenterX, 250, '', choiceStyle).setOrigin(0.5).setPadding(16).setInteractive({ useHandCursor: true });
        this.optionContainer.add(this.option2);
        this.option2.on('pointerover', () => this.option2.setColor('#F2F2F2').setBackgroundColor('#4D4D4D'));
        this.option2.on('pointerout', () => this.option2.setColor('#4D4D4D').setBackgroundColor('#F2F2F2'));
        
        this.option3 = this.add.text(screenCenterX, 310, '', choiceStyle).setOrigin(0.5).setPadding(16).setInteractive({ useHandCursor: true });
        this.optionContainer.add(this.option3);
        this.option3.on('pointerover', () => this.option3.setColor('#F2F2F2').setBackgroundColor('#4D4D4D'));
        this.option3.on('pointerout', () => this.option3.setColor('#4D4D4D').setBackgroundColor('#F2F2F2'));

        this.optionContainer.setVisible(false); // Renders option boxes then hides it to fill in text later
    }

    showChoice (option1text, option1next, option2text, option2next = 0, option3text = '', option3next = 0) {
        this.dialogueBox.disableInteractive();
        this.optionContainer.setVisible(true);

        // If there is a third option (only happens once in this scene)
        if (option3text != '') {
            this.option1.setY(50);
            this.option2.setY(180);
            this.option2.setVisible(true);
            this.option3.setVisible(true);
            this.option3.setText(this.choices[option3text]); 
            this.option3.on('pointerdown', () => {
                this.optionContainer.setVisible(false);
                this.dialogueBox.setInteractive({ useHandCursor: true });
                this.currentDialogue.setText(this.dialogues[option3next]); // Render the next dialogue's text before next click
                this.nextDialogue = option3next;  // dialogueBox button click will go to the next dialogue
            });
        }
         // When there is only one option, move option 1 to the middle and hides option 2
        else if (option2text == '') {
            this.option1.setY(200);  
            this.option2.setVisible(false);
            this.option3.setVisible(false);
        } 
         // By default there are 2 options
        else { 
            this.option1.setY(120);
            this.option2.setY(250);
            this.option2.setVisible(true);
            this.option3.setVisible(false);
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
        if (ID == 1) {
            this.showChoice('1-1', 3, '1-2', 2);
        } else if (ID == 2) {
            this.showChoice('2-1', 3, '');
        } else if (ID == 3) {
            this.showChoice('3-1', 6, '3-2', 4);
        } else if (ID == 4) {   // Player has chosen to leave the dialogue
            this.player['adaDialogue'] = 5;  // Player resumes from next dialogue when they return
            this.scene.start('Lunch');
        } else if (ID == 5) {  // This is a returning point with a welcome message
            this.nextDialogue = 6;  
            this.currentDialogue.setText(this.dialogues[this.nextDialogue]);
        } else if (ID == 6) {
            this.showChoice('6-1', 7, '6-2', 8);
        } else if (ID == 7) { // Renders the next text here since we're not calling showChoice to render
            this.nextDialogue = 9; 
            this.currentDialogue.setText(this.dialogues[this.nextDialogue]);
        } else if (ID == 8) {
            this.nextDialogue = 9;
            this.currentDialogue.setText(this.dialogues[this.nextDialogue]);
        } else if (ID == 9) {  
            this.nextDialogue = 10;
            this.currentDialogue.setText(this.dialogues[this.nextDialogue]); 
        } else if (ID == 10) {
            this.nextDialogue = 11;
            this.currentDialogue.setText(this.dialogues[this.nextDialogue]); 
        } else if (ID == 11) {
            this.nextDialogue = 12;
            this.currentDialogue.setText(this.dialogues[this.nextDialogue]); 
        } else if (ID == 12) {
            this.nextDialogue = 13;
            this.currentDialogue.setText(this.dialogues[this.nextDialogue]); 
        } else if (ID == 13) {
            this.showChoice('13-1', 14, '');
        } else if (ID == 14) {
            this.nextDialogue = 15;
            this.currentDialogue.setText(this.dialogues[this.nextDialogue]); 
        } else if (ID == 15) {
            this.showChoice('15-1', 18, '15-2', 16);
        } else if (ID == 16) {  // This is a save point
            this.player['adaDialogue'] = 17;  // Player resumes from next dialogue when they return
            this.scene.start('Lunch');
        } else if (ID == 17) { 
            this.nextDialogue = 18;  
            this.currentDialogue.setText(this.dialogues[this.nextDialogue]); 
        } else if (ID == 18) {
            this.nextDialogue = 19;
            this.currentDialogue.setText(this.dialogues[this.nextDialogue]); 
        } else if (ID == 19) {
            this.showChoice('19-1', 20, '');
        } else if (ID == 20) {
            this.nextDialogue = 21;
            this.currentDialogue.setText(this.dialogues[this.nextDialogue]); 
        } else if (ID == 21) {
            this.showChoice('21-1', 22, ''); 
        } else if (ID == 22) {
            this.showChoice('22-1', 25, '22-2', 23); 
        } else if (ID == 23) {
            this.player['adaDialogue'] = 24;  // Player resumes from next dialogue when they return
            this.scene.start('Lunch');
        } else if (ID == 24) {  
            this.showChoice('24-1', 25, ''); 
        } else if (ID == 25) {  
            this.showChoice('25-1', 26, '25-2', 27, '25-3', 29); 
        } else if (ID == 26) {
            this.nextDialogue = 31;
            this.currentDialogue.setText(this.dialogues[this.nextDialogue]); 
        } else if (ID == 27) {
            this.nextDialogue = 28;
            this.currentDialogue.setText(this.dialogues[this.nextDialogue]); 
        } else if (ID == 28) {
            this.nextDialogue = 31;
            this.currentDialogue.setText(this.dialogues[this.nextDialogue]); 
        } else if (ID == 29) {
            this.nextDialogue = 30;
            this.currentDialogue.setText(this.dialogues[this.nextDialogue]); 
        } else if (ID == 30) {
            this.nextDialogue = 31;
            this.currentDialogue.setText(this.dialogues[this.nextDialogue]); 
        } else if (ID == 31) {
            this.showChoice('31-1', 32, '31-2', 33); 
        } else if (ID == 32) {
            this.nextDialogue = 34;
            this.currentDialogue.setText(this.dialogues[this.nextDialogue]); 
        } else if (ID == 33) {
            this.nextDialogue = 34;
            this.currentDialogue.setText(this.dialogues[this.nextDialogue]); 
        } else if (ID == 34) {
            this.nextDialogue = 35;
            this.currentDialogue.setText(this.dialogues[this.nextDialogue]); 
        } else if (ID == 35) {
            this.player['adaDialogue'] = 36;  // 36 marks the end of the lunch convo
            this.scene.start('Lunch');
            this.player['objective'] += 1;
        }
    }
}

export default LunchDialogue;
