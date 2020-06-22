import 'phaser';

class ReceptionScene extends Phaser.Scene {
    constructor() {
        super('Reception') // this scene has the key 'Reception' when initializing it
    }

    init() {
        this.player = this.sys.game.player;
    }

    preload () {
        this.load.image('reception', './src/assets/reception.png' );
        this.load.image('dialogueBox', './src/assets/dialogue-box.png');
        this.load.image('receptionist', './src/assets/receptionist.png');
        this.load.image('phoneIcon', './src/assets/phone-icon.png');
        this.load.image('phoneScreen', './src/assets/phone-screen.png');
    }

    create () {
        const config = this.sys.game.config;
        const bg = this.add.image(0, 0, 'reception');
        
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

        const dialogueBox = this.add.image(560, 150, 'dialogueBox');
        dialogueBox.setScale(.9);
        const receptionist = this.add.image(430, 290, 'receptionist');
        receptionist.setScale(.8);

        // Initialize position and styling of dialogue text
        this.dialogueText = this.add.text(470, 110, ' ', { fontFamily: 'Myriad Pro', fontSize: '22px', color: '#4D4D4D', align: 'left', wordWrap: { width: 190, useAdvancedWrap: true }})
        
        // Make phone notification if there are new achievements or objectives
        if (this.player['newAchievement'] || this.player['newObjective']) {
            this.notifCircle = this.add.circle(1015, 505, 10, 0xFD1818);
            // notifCircle alternates between visible/invisible every 0.5 seconds
            this.notifEvent = this.time.addEvent({ delay: 500, callback: () => {this.notifCircle.visible = !this.notifCircle.visible}, callbackScope: this, loop: true });    
        }
        
        // Player can only choose role once
        if (this.player['role'] == '') {
            this.dialogueText.setText('Welcome! You can press on me to choose a role.');
            receptionist.setInteractive({ useHandCursor: true })
            receptionist.on('pointerdown', () => {
                this.scene.start('ReceptionRole');
            });   
        } else {
            // Dialogue changes depending on how many levels the player have compelted
            if (this.player['level'] == 1) {
                // this.dialogueText.setPosition(470, 101);
                this.dialogueText.setText('If you are lost, how about consulting your phone?');
            } else if (this.player['level']  == 2) {
                this.dialogueText.setText('You beat level 1! What about level 2?')
            } else if (this.player['level']  == 3) {
                this.dialogueText.setText('You beat level 2! What about level 3?')
            } else if (this.player['level'] > 2 && this.player['objective'] == 4) {
                this.dialogueText.setText('Congratulations! You have beat all levels in this demo!')
            } else {
                this.dialogueText.setText('You can consult your phone for the next objective.')
            }
        }
    }

    openPhone () {
        this.scene.start('Phone', { location : './src/assets/reception.png' , prevScene : 'Reception'});
    }
}

export default ReceptionScene;
