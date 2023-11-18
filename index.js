const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const scoreEl = document.querySelector('#scoreEl')

const maps = [
  [
    ['1', '-', '-', '-', ']', '.', '[', '-', '-', '-', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'I', '|'],
    ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '|', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '_', '.', '[', ']', '.', '|'],
    ['_', '.', '.', '.', '.', '.', '.', '.', '.', '.', '_'],
    ['.', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '.'],
    ['^', '.', '.', '.', '.', '.', '.', '.', '.', '.', '^'],
    ['|', '.', '[', ']', '.', '^', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '|', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
    ['|', 'I', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
    ['4', '-', '-', '-', ']', '.', '[', '-', '-', '-', '3'],
  ],
  [
    ['1', '-', '-', '-', ']', '.', '[', '-', '-', '-', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', 'b', '.', '[', ']', '.', '|'],
    ['_', '.', '.', '.', '.', '.', '.', '.', '.', '.', '_'],
    ['.', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '.'],
    ['^', '.', '.', '.', '.', '.', '.', '.', '.', '.', '^'],
    ['|', '.', '[', ']', '.', 'b', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['4', '-', '-', '-', ']', '.', '[', '-', '-', '-', '3'],
  ],
]

const pellets = []
const powerUps = []
let ghosts = []
let player = {}
let items = []
let ghostSpeed = 75
const GHOST_SPEED_INCREMENT = 25

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
let accumulatedTime = 0
let ghostReleaseIntervals = [0, 7, 14, 21]
let currentLevelIndex = 0
let boundaries = generateBoundaries(currentLevelIndex, maps)
let lives = 3
const ghostPositions = [
  [
    {
      x: Boundary.width * 5 + Boundary.width / 2,
      y: Boundary.height * 5 + Boundary.height / 2,
    },
    {
      x: Boundary.width * 5 + Boundary.width / 2,
      y: Boundary.height * 6 + Boundary.height / 2,
    },
    {
      x: Boundary.width * 4 + Boundary.width / 2,
      y: Boundary.height * 6 + Boundary.height / 2,
    },
    {
      x: Boundary.width * 6 + Boundary.width / 2,
      y: Boundary.height * 6 + Boundary.height / 2,
    },
  ],
  [
    {
      x: Boundary.width * 5 + Boundary.width / 2,
      y: Boundary.height * 3 + Boundary.height / 2,
    },
    {
      x: Boundary.width * 5 + Boundary.width / 2,
      y: Boundary.height * 4 + Boundary.height / 2,
    },
    {
      x: Boundary.width * 4 + Boundary.width / 2,
      y: Boundary.height * 4 + Boundary.height / 2,
    },
    {
      x: Boundary.width * 6 + Boundary.width / 2,
      y: Boundary.height * 4 + Boundary.height / 2,
    },
  ],
]

const game = {
  init() {
    accumulatedTime = 0
    player = new Player({
      position: {
        x: Boundary.width + Boundary.width / 2,
        y: Boundary.height + Boundary.height / 2,
      },
      velocity: {
        x: 0,
        y: 0,
      },
    })
    ghosts = [
      new Ghost({
        position: ghostPositions[currentLevelIndex][0],
        velocity: {
          x: Ghost.speed * (Math.random() < 0.5) ? -1 : 1,
          y: 0,
        },
        imgSrc: './img/sprites/orangeGhost.png',
        state: 'active',
        speed: ghostSpeed,
      }),
      new Ghost({
        position: ghostPositions[currentLevelIndex][1],
        velocity: {
          x: Ghost.speed * (Math.random() < 0.5) ? -1 : 1,
          y: 0,
        },
        imgSrc: './img/sprites/greenGhost.png',
        speed: ghostSpeed,
      }),
      new Ghost({
        position: ghostPositions[currentLevelIndex][2],
        velocity: {
          x: Ghost.speed * (Math.random() < 0.5) ? -1 : 1,
          y: 0,
        },
        imgSrc: './img/sprites/redGhost.png',
        speed: ghostSpeed,
      }),
      new Ghost({
        position: ghostPositions[currentLevelIndex][3],
        velocity: {
          x: Ghost.speed * (Math.random() < 0.5) ? -1 : 1,
          y: 0,
        },
        imgSrc: './img/sprites/yellowGhost.png',
        speed: ghostSpeed,
      }),
    ]
  },
  initStart() {
    player.state = 'paused'
    ghosts.forEach((ghost) => {
      ghost.state = 'paused'
    })

    setTimeout(() => {
      ghosts[0].state = 'active'
      ghosts[1].state = null
      ghosts[2].state = null
      ghosts[3].state = null
      player.state = 'active'
    }, 1000)
  },
  nextRound() {
    player.state = 'paused'
    ghosts.forEach((ghost) => {
      ghost.state = 'paused'
    })

    ghostSpeed += GHOST_SPEED_INCREMENT
    ghostReleaseIntervals = ghostReleaseIntervals.map((interval, index) => {
      if (index === 0) return interval
      else if (index === 1 && interval > 1) return interval - 1
      else if (index === 2 && interval > 2) return interval - 1
      else if (index === 3 && interval > 3) return interval - 1
    })

    setTimeout(() => {
      currentLevelIndex++
      if (currentLevelIndex > maps.length - 1) currentLevelIndex = 0
      boundaries = generateBoundaries(currentLevelIndex, maps)
      game.init()
      game.initStart()
    }, 1000)
  },
  pause() {
    player.state = 'paused'
    ghosts.forEach((ghost) => {
      ghost.state = 'paused'
    })
  },
  end() {
    document.querySelector('#gameOverScoreLabel').innerHTML = score
    document.querySelector('#gameOverScreen').style.display = 'block'
  },
  restart() {
    currentLevelIndex = 0
    boundaries = generateBoundaries(currentLevelIndex, maps)
    lives = 3
    score = 0
    scoreEl.innerHTML = score
  },
}

game.init()
game.pause()

function animate() {
  animationId = requestAnimationFrame(animate)
  c.clearRect(0, 0, canvas.width, canvas.height)

  const currentMs = Date.now()
  const delta = (currentMs - prevMs) / 1000
  prevMs = currentMs

  if (player.state === 'active') accumulatedTime += delta

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
        ghost.radius + player.radius &&
      player.state === 'active'
    ) {
      if (ghost.scared) {
        ghosts.splice(i, 1)
      } else {
        lives--
        player.die(lives, game)
        ghosts.forEach((ghost) => {
          ghost.state = 'paused'
        })
        console.log('you lose')
      }
    }
  }

  // win condition goes here
  if (pellets.length === 40 && player.state === 'active') {
    game.nextRound()
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

  // for our items
  for (let i = items.length - 1; 0 <= i; i--) {
    const item = items[i]
    item.draw()

    // player collides with item
    if (
      Math.hypot(
        item.position.x - player.position.x,
        item.position.y - player.position.y,
      ) <
      item.radius + player.radius
    ) {
      items.splice(i, 1)
      score += 50
      scoreEl.innerHTML = score
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

  ghosts.forEach((ghost, index) => {
    ghost.update(delta, boundaries)

    if (accumulatedTime > ghostReleaseIntervals[index] && !ghost.state)
      ghost.enterGame(ghostPositions[currentLevelIndex][1])
  })

  if (player.velocity.x > 0) player.rotation = 0
  else if (player.velocity.x < 0) player.rotation = Math.PI
  else if (player.velocity.y > 0) player.rotation = Math.PI / 2
  else if (player.velocity.y < 0) player.rotation = Math.PI * 1.5
} // end of animate()

animate()

document.querySelector('#restartGameButton').addEventListener('click', () => {
  document.querySelector('#gameOverScreen').style.display = 'none'
  game.restart()
  game.init()
  game.initStart()
})

document.querySelector('#startButton').addEventListener('click', (e) => {
  document.querySelector('#startScreen').style.display = 'none'
  document.querySelector('#readyTag').style.display = 'block'
  setTimeout(() => {
    game.init()
    document.querySelector('#readyTag').style.display = 'none'
    document.querySelector('#goTag').style.display = 'block'
    gsap.to('#goTag', {
      delay: 0.5,
      opacity: 0,
    })
  }, 2000)
})
