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

        if (this.player.role == '') {
            const caseButton = this.add.text(515, 175, 'PRESS HERE TO START', { fontFamily: 'Myriad Pro', fontSize: '25px', color: '#ffffff'}).setPadding(64, 16).setBackgroundColor('#442E55').setInteractive({ useHandCursor: true });
            caseButton.on('pointerdown', () => {
                caseButton.destroy();
                this.scene.start('ReceptionRole');
            });   
        }
    }

    openPhone () {
        this.scene.start('Phone', { location : './src/assets/reception.png' , prevScene : 'Reception'});
    }
}

export default ReceptionScene;
