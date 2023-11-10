const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const scoreEl = document.querySelector('#scoreEl')

canvas.width = innerWidth
canvas.height = innerHeight

const pellets = []

const powerUps = []
const ghosts = [
  new Ghost({
    position: {
      x: Boundary.width * 6 + Boundary.width / 2,
      y: Boundary.height + Boundary.height / 2,
    },
    velocity: {
      x: Ghost.speed,
      y: 0,
    },
    imgSrc: './img/sprites/orangeGhost.png',
  }),
  new Ghost({
    position: {
      x: Boundary.width * 6 + Boundary.width / 2,
      y: Boundary.height * 3 + Boundary.height / 2,
    },
    velocity: {
      x: Ghost.speed,
      y: 0,
    },
    imgSrc: './img/sprites/greenGhost.png',
  }),
]
const player = new Player({
  position: {
    x: Boundary.width + Boundary.width / 2,
    y: Boundary.height + Boundary.height / 2,
  },
  velocity: {
    x: 0,
    y: 0,
  },
})
const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
}

let lastKey = ''
let score = 0
let animationId
let prevMs = Date.now()

const boundaries = generateBoundaries()

function animate() {
  animationId = requestAnimationFrame(animate)
  c.clearRect(0, 0, canvas.width, canvas.height)

  const currentMs = Date.now()
  const delta = (currentMs - prevMs) / 1000
  prevMs = currentMs

  if (keys.w.pressed && lastKey === 'w') player.move('up')
  else if (keys.a.pressed && lastKey === 'a') player.move('left')
  else if (keys.s.pressed && lastKey === 's') player.move('down')
  else if (keys.d.pressed && lastKey === 'd') player.move('right')

  // detect collision between ghosts and player
  for (let i = ghosts.length - 1; 0 <= i; i--) {
    const ghost = ghosts[i]
    // ghost touches player
    if (
      Math.hypot(
        ghost.position.x - player.position.x,
        ghost.position.y - player.position.y,
      ) <
      ghost.radius + player.radius
    ) {
      if (ghost.scared) {
        ghosts.splice(i, 1)
      } else {
        cancelAnimationFrame(animationId)
        console.log('you lose')
      }
    }
  }

  // win condition goes here
  if (pellets.length === 0) {
    console.log('you win')
    cancelAnimationFrame(animationId)
  }

  // power ups go
  for (let i = powerUps.length - 1; 0 <= i; i--) {
    const powerUp = powerUps[i]
    powerUp.draw()

    // player collides with powerup
    if (
      Math.hypot(
        powerUp.position.x - player.position.x,
        powerUp.position.y - player.position.y,
      ) <
      powerUp.radius + player.radius
    ) {
      powerUps.splice(i, 1)

      // make ghosts scared
      ghosts.forEach((ghost) => {
        ghost.scared = true

        setTimeout(() => {
          ghost.scared = false
        }, 5000)
      })
    }
  }

  // touch pellets here
  for (let i = pellets.length - 1; 0 <= i; i--) {
    const pellet = pellets[i]
    pellet.draw()

    if (
      Math.hypot(
        pellet.position.x - player.position.x,
        pellet.position.y - player.position.y,
      ) <
      pellet.radius + player.radius
    ) {
      pellets.splice(i, 1)
      score += 10
      scoreEl.innerHTML = score
    }
  }

  boundaries.forEach((boundary) => {
    boundary.draw()
  })
  player.update(delta, boundaries)

  ghosts.forEach((ghost) => {
    ghost.update(delta, boundaries)
  })

  if (player.velocity.x > 0) player.rotation = 0
  else if (player.velocity.x < 0) player.rotation = Math.PI
  else if (player.velocity.y > 0) player.rotation = Math.PI / 2
  else if (player.velocity.y < 0) player.rotation = Math.PI * 1.5
} // end of animate()

animate()
