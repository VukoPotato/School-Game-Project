const battleBackgroundImageFirst = new Image()
battleBackgroundImageFirst.src = './img/battleSceneFirst.png'
const battleBackgroundFirst = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: battleBackgroundImageFirst
})

let enemy 
let playerBattle
let renderedSprites 
let battleAnimationId
let queue

function initBattle() {
    document.querySelector('#userInterface').style.display = 'block'
    document.querySelector('#dialogueBox').style.display = 'none'
    document.querySelector('#enemyHealthFull').style.width = '100%'
    document.querySelector('#playerHealthFull').style.width = '100%'
    document.querySelector('#attacks').replaceChildren()

    enemy = new Monster(monsters.enemy) //generowanie sprita przeciwnika na mapce
    playerBattle = new Monster(monsters.player) //generowanie sprita gracza na mapce
    renderedSprites = [enemy, playerBattle]
    queue = []

    playerBattle.attacks.forEach(attack => {
        const button = document.createElement('button')
        button.innerHTML = attack.name
        document.querySelector('#attacks').append(button)
    })

        //event listener dla przycisków (ataków)
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            playerBattle.attack({ 
                attack: selectedAttack,
                recipient: enemy,
                renderedSprites
            })

            if (enemy.health <= 0) {
                queue.push(() => {
                    enemy.faint()
                })
                queue.push(() => {
                    gsap.to('#cutscene', {
                        opacity: 1,
                        onComplete: () => {
                            cancelAnimationFrame(battleAnimationId)
                            animate()
                            document.querySelector('#userInterface').style.display = 'none'

                            gsap.to('#cutscene', {
                                opacity: 0
                            })

                            battle.initiated = false
                            audio.map.play()
                        }
                    })
                })
            }

            const randomAttack = enemy.attacks[Math.floor(Math.random() * enemy.attacks.length)]

            queue.push(() => {
                enemy.attack({ 
                    attack: randomAttack,
                    recipient: playerBattle,
                    renderedSprites
                })

                if (playerBattle.health <= 0) {
                    queue.push(() => {
                        playerBattle.faint()
                    })

                    queue.push(() => {
                        gsap.to('#cutscene', {
                            opacity: 1,
                            onComplete: () => {
                                cancelAnimationFrame(battleAnimationId)
                                animate()
                                document.querySelector('#userInterface').style.display = 'none'

                                gsap.to('#cutscene', {
                                    opacity: 0
                                })

                                battle.initiated = false
                                audio.map.play()
                            }
                        })
                    })
                }
            })
        })

        button.addEventListener('mouseenter', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            document.querySelector('#attackType').innerHTML = selectedAttack.type
            document.querySelector('#attackType').style.color = selectedAttack.color
        })
    })
    }

    function animateBattle () {
        battleAnimationId = window.requestAnimationFrame(animateBattle)
        battleBackgroundFirst.draw()

        renderedSprites.forEach((sprite) => {
            sprite.draw()
        })
}

animate()
//initBattle()
//animateBattle()

document.querySelector('#dialogueBox').addEventListener('click', (e) => {
    if (queue.length > 0) {
        queue[0]()
        queue.shift()
    } else e.currentTarget.style.display = 'none'
})