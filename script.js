const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 48) {
    collisionsMap.push(collisions.slice(i, 48 + i))
}

const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i += 48) {
    battleZonesMap.push(battleZonesData.slice(i, 48 + i))
}

const endingZoneMap = []
for (let i = 0; i < endingZoneData.length; i += 48) {
    endingZoneMap.push(endingZoneData.slice(i, 48 + i))
}

const offset = {
    x: -1500, // -448 temporary
    y: -1815
}

const endingZone = []

endingZoneMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 66) { 
            endingZone.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y 
                    }
                })
            )
        }
    })
})

const boundaries = []

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 578) { 
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y 
                    }
                })
            )
        }
    })
})

const battleZones = []

battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 567) { 
            battleZones.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y 
                    }
                })
            )
        }
    })
})

const image = new Image()
image.src = './img/mapa.png'

const foregroundImage = new Image()
foregroundImage.src = './img/foreground.png'

const playerDownImage = new Image()
playerDownImage.src = './img/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './img/playerRight.png'

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 256 / 4 / 2,
        y: canvas.height / 2 - 80 / 2
    },
    image: playerUpImage,
    frames: {
        max: 4,
        hold: 10
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        down: playerDownImage,
        right: playerRightImage
    }
})

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
})

const keys = {
    w: {
        pressed: false
    },

    a: {
        pressed: false
    },

    s: {
        pressed: false
    },

    d: {
        pressed: false
    }
}

const movables = [background, ...boundaries, foreground, ...battleZones, ...endingZone]

function rectangularCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x && 
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    )

}

const battle = {
    initiated: false
}

function animate() {
    const animationId = window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach(boundary => {
        boundary.draw()
    })
    battleZones.forEach(battleZone => {
        battleZone.draw()
    })
    endingZone.forEach(endingZone => {
        endingZone.draw()
    })
    player.draw()
    foreground.draw()

    var battleChance = 0

    let moving = true
    player.animate = false
    
    if (battle.initiated) return

    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
        for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i]
            const overlappingArea = 
            (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width) - 
                Math.max(player.position.x, battleZone.position.x)) * 
            (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height) -
                Math.max(player.position.y, battleZone.position.y))
            if(
                rectangularCollision({
                 rectangle1: player,
                 rectangle2: battleZone
                }) &&
                overlappingArea > (player.width * player.height) / 2
                && Math.random () < battleChance
            )   {
                window.cancelAnimationFrame(animationId)

                audio.map.stop()
                audio.initBattle.play()
                audio.battle.play()
                
                battle.initiated = true
                gsap.to('#cutscene', {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.4,
                    onComplete() {
                        gsap.to('#cutscene', {
                        opacity: 1,
                        duration: 0.4,
                        onComplete() {
                            initBattle()
                            animateBattle()
                            gsap.to('#cutscene', {
                                opacity: 0,
                                duration: 0.4
                            })
                        }
                    })
                }
            })
            break
            }
        }
    }

    if (keys.w.pressed && lastKey === 'w') {
        player.animate = true;
        player.image = player.sprites.up;
    
        let moving = true;
    
        // Check for collisions with boundaries first
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: { ...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 3
                    }}
                })
            ) {
                moving = false;  // Player can't move forward due to collision
                break;
            }
        }
    
        // If no collisions with boundaries, move the player
        if (moving) {
            movables.forEach(movable => {
                movable.position.y += 2;
            });
        }
    
        // After moving, check for collisions with the endingZone
        for (let i = 0; i < endingZone.length; i++) {
            const endingZoneBoundary = endingZone[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: { ...endingZoneBoundary, position: {
                        x: endingZoneBoundary.position.x,
                        y: endingZoneBoundary.position.y + 3
                    }}
                })
            ) {
                // Log to confirm collision detection
                console.log("Player collided with the ending zone");
    
                // Player has collided with the endingZone
                document.querySelector('#game').style.display = 'none';  // Hide game div
                document.querySelector('#ending').style.display = 'block'; // Show ending div
    
                // Stop further checks
                break;
            }
        }
    }
     else if (keys.a.pressed && lastKey == 'a') { 
        player.animate = true
        player.image = player.sprites.left

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if(
                rectangularCollision({
                 rectangle1: player,
                 rectangle2: {...boundary, position: {
                    x: boundary.position.x + 3,
                    y: boundary.position.y
                 }}
                })
             ) {
                moving = false
                break
             }
        }

        if (moving)
        movables.forEach(movable => {
            movable.position.x += 2
        })
    } else if (keys.s.pressed && lastKey == 's') { 
        player.animate = true
        player.image = player.sprites.down

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if(
                rectangularCollision({
                 rectangle1: player,
                 rectangle2: {...boundary, position: {
                    x: boundary.position.x,
                    y: boundary.position.y - 3
                 }}
                })
             ) {
                moving = false
                break
             }
        }

        if (moving)
        movables.forEach(movable => {
            movable.position.y -= 2
        })
    } else if (keys.d.pressed && lastKey == 'd') { 
        player.animate = true
        player.image = player.sprites.right

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if(
                rectangularCollision({
                 rectangle1: player,
                 rectangle2: {...boundary, position: {
                    x: boundary.position.x - 3,
                    y: boundary.position.y
                 }}
                })
             ) {
                moving = false
                break
             }
        }

        if (moving)
        movables.forEach(movable => {
            movable.position.x -= 2
        })
    }
}

let lastKey = ''
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break

        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break

        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break

        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }

})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
        keys.w.pressed = false
            break

        case 'a':
        keys.a.pressed = false
            break

        case 's':
        keys.s.pressed = false
            break

        case 'd':
        keys.d.pressed = false
            break
    }

})

let clicked = false
addEventListener('click', () => {
    if (!clicked) {
        audio.map.play()
        clicked = true
    }
})