const battleBackgroundImageFirst = new Image()
battleBackgroundImageFirst.src = './img/battleSceneFirst.png'
const battleBackgroundFirst = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: battleBackgroundImageFirst
})

const enemy = new Monster(monsters.enemy) //generowanie sprita przeciwnika na mapce

const playerBattle = new Monster(monsters.player) //generowanie sprita gracza na mapce

const renderedSprites = [enemy, playerBattle]

playerBattle.attacks.forEach(attack => {
    const button = document.createElement('button')
    button.innerHTML = attack.name
    document.querySelector('#attacks').append(button)
})

function animateBattle () {
    window.requestAnimationFrame(animateBattle)
    battleBackgroundFirst.draw()

    renderedSprites.forEach((sprite) => {
        sprite.draw()
    })
}

//animate()
animateBattle()

const queue = []

//event listener dla przycisków (ataków)
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', (e) => {
        const selectedAttack = attacks[e.currentTarget.innerHTML]
        playerBattle.attack({ 
            attack: selectedAttack,
            recipient: enemy,
            renderedSprites
        })

        const randomAttack = enemy.attacks[Math.floor(Math.random() * enemy.attacks.length)]

        queue.push(() => {
            enemy.attack({ 
            attack: randomAttack,
            recipient: playerBattle,
            renderedSprites
            })
        })
    })
})

document.querySelector('#dialogueBox').addEventListener('click', (e) => {
    if (queue.length > 0) {
        queue[0]()
        queue.shift()
    } else e.currentTarget.style.display = 'none'
})