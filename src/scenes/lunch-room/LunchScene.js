
import 'phaser';

class LunchScene extends Phaser.Scene {
    constructor() {
        super('Lunch');
    }

    init() {
        this.db = this.sys.game.db;
        this.player = this.sys.game.player;
    }
    
    preload () {
        this.load.image('lunchRoom', './src/assets/lunch-room.png');
        this.load.image('ada', './src/assets/lady-and-coffee.png');
        this.load.image('phoneIcon', './src/assets/phone-icon.png');
        this.load.image('phoneScreen', './src/assets/phone-screen.png');
    }

    create () {
        const config = this.sys.game.config;
        const bg = this.add.image(config.width/2, config.height/2, 'lunchRoom');
        
        // Scale the background img to fit the height of the game height
        bg.displayHeight = config.height;
        bg.scaleX = bg.scaleY;
        
        // Render ada only if we have not finished all dialogues
        if (this.player['adaDialogue'] != 36) {
            const ada = this.add.image(520, 440, 'ada').setScale(.8).setInteractive({ useHandCursor: true });
            ada.on('pointerdown', () => this.scene.start('LunchDialogue'));
        }

        // Add the phone button as an image to make it interactive
        const phoneIcon = this.add.image(1000, 530, 'phoneIcon');
        phoneIcon.setScale(.7);
        phoneIcon.setInteractive({ useHandCursor: true });  // Cursor style change when hovering 
        // Open phone scene on click
        phoneIcon.on('pointerdown', () => this.scene.start('Phone', { location : './src/assets/lunch-room.png' , prevScene : 'Lunch'})); // pointerdown = onClick event
    }
}

export default LunchScene;
