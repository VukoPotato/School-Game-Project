const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

console.log(collisions);

canvas.width = 1024
canvas.height = 576

const collisions = []
for (let i = 0; i < collisionsMap.length; i += 16) {
    collisionsMap.push(collisions.slice(i, 16 + i))
}

class Boundary {
    static width = 64
    static height = 64
    constructor({position}) {
        this.position = position
        this.width = 64
        this.height = 64
    }

    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const boundaries = []
const offset = {
    x: -85,
    y: -28
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        boundaries.push(
            new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            })
        )
    })
})

console.log(boundaries);

const image = new Image()
image.src = 'mapa.png'

const playerImage = new Image()
playerImage.src = 'down-test.png'

class Sprite {
    constructor({ position, velocity, image })  {
        this.position = position
        this.image = image
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y,
    },
    image: image
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

function animate() {
    window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach(boundary => {
        boundary.draw()
    })
    c.drawImage(
        playerImage,
        0,
        0,
        playerImage.width / 3,
        playerImage.height, 
        canvas.width / 2 - (playerImage.width / 3) / 2, 
        canvas.height / 2 - playerImage.height / 2,
        playerImage.width / 3,
        playerImage.height 
    )

    if (keys.w.pressed && lastKey == 'w') background.position.y = background.position.y += 3
    else if (keys.a.pressed && lastKey == 'a') background.position.x = background.position.x += 3
    else if (keys.s.pressed && lastKey == 's') background.position.y = background.position.y -= 3
    else if (keys.d.pressed && lastKey == 'd') background.position.x = background.position.x -= 3
}
animate()

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

    console.log(keys)
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

    console.log(keys)
})