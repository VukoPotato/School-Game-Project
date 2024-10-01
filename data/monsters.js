const monsters = {
    player: {
        position: {
            x: 240,
            y: 210
        }, //pozycja gracza w pixelach 
        image: {
            src: './img/playerBattle.png'
        },
        frames: {
            max: 2,
            hold: 100
        },
        animate: true,
        name: 'Knight',
        attacks: [attacks.Kick, attacks.Fireball]
    },
    enemy: {
        position: {
            x: 800,
            y: 55
        }, //pozycja przeciwnika w pixelach
        image: {
            src: './img/enemy.png'
        },
        frames: {
            max: 2,
            hold: 100
        },
        animate: true,
        isEnemy: true,
        name: 'Orc',
        attacks: [attacks.Kick, attacks.Fireball]
    }
}