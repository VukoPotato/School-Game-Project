const playerImage = new Image()
playerImage.src = './img/playerBattle.png'

const enemyImage = new Image()
enemyImage.src = './img/enemy.png'

const monsters = {
    player: {
        position: {
            x: 240,
            y: 210
        }, //pozycja gracza w pixelach 
        image: playerImage,
        frames: {
            max: 3,
            hold: 50
        },
        animate:true,
        name: 'Knight',
        attacks: [attacks.Kick, attacks.Fireball]
    },
    enemy: {
        position: {
            x: 800,
            y: 55
        }, //pozycja przeciwnika w pixelach
        image: enemyImage,
        frames: {
            max: 3,
            hold: 50
        },
        animate: true,
        isEnemy: true,
        name: 'Orc',
        attacks: [attacks.Kick, attacks.Fireball]
    }
}