const SPEED = 200
const CHOMP_RATE = 30

class Player {
  constructor({ position, velocity }) {
    this.position = position
    this.velocity = velocity
    this.radius = 15
    this.radians = 0.75
    this.openRate = 0.12
    this.rotation = 0
    this.desiredDirection = {
      x: 0,
      y: 0,
    }
    this.state = 'active'
  }

  draw() {
    c.save()
    c.translate(this.position.x, this.position.y)
    c.rotate(this.rotation)
    c.translate(-this.position.x, -this.position.y)
    c.beginPath()
    c.arc(
      this.position.x,
      this.position.y,
      this.radius,
      this.radians,
      Math.PI * 2 - this.radians,
    )
    c.lineTo(this.position.x, this.position.y)
    c.fillStyle = 'yellow'
    c.fill()
    c.closePath()
    c.restore()
  }

  move(direction) {
    switch (direction) {
      case 'up':
        this.desiredDirection = {
          x: 0,
          y: -1,
        }
        break
      case 'down':
        this.desiredDirection = {
          x: 0,
          y: 1,
        }
        break
      case 'left':
        this.desiredDirection = {
          x: -1,
          y: 0,
        }
        break
      case 'right':
        this.desiredDirection = {
          x: 1,
          y: 0,
        }
        break
    }
  }

  collision(boundaries) {
    for (const boundary of boundaries) {
      if (
        circleCollidesWithRectangle({
          circle: this,
          rectangle: boundary,
        })
      ) {
        return true
      }
    }

    return false
  }

  snapToGrid() {
    const CELL_SIZE = 20
    this.position = {
      x: Math.round(this.position.x / CELL_SIZE) * CELL_SIZE,
      y: Math.round(this.position.y / CELL_SIZE) * CELL_SIZE,
    }
  }

  isValidMove(boundaries) {
    const PIXEL_BUFFER = 5
    for (const boundary of boundaries) {
      if (
        circleCollidesWithRectangle({
          circle: {
            ...this,
            velocity: {
              x: this.desiredDirection.x * PIXEL_BUFFER,
              y: this.desiredDirection.y * PIXEL_BUFFER,
            },
          },
          rectangle: boundary,
        })
      ) {
        return false
      }
    }

    return true
  }

  movePlayerWithInput(delta, boundaries) {
    if (this.isValidMove(boundaries)) {
      this.velocity.x = this.desiredDirection.x
      this.velocity.y = this.desiredDirection.y
    }

    if (this.collision(boundaries)) {
      this.velocity.x = 0
      this.velocity.y = 0
      this.snapToGrid()
    } else {
      this.position.x += this.velocity.x * delta * SPEED
      this.position.y += this.velocity.y * delta * SPEED
    }

    // chomp
    if (this.radians < 0 || this.radians > 0.75) this.openRate = -this.openRate
    this.radians = Math.max(0, Math.min(this.radians, 0.75))
    this.radians += this.openRate * delta * CHOMP_RATE
  }

  die() {
    this.state = 'initDeath'
    gsap.to(this, {
      radians: Math.PI - 0.00001,
      onComplete: () => {
        setTimeout(() => {
          game.init()
          game.initStart()
        }, 750)
      },
    })
  }

  update(delta, boundaries) {
    this.draw()

    switch (this.state) {
      case 'active':
        this.movePlayerWithInput(delta, boundaries)
        break
      case 'initDeath':
        this.state = 'death'
        break
    }
  }
}
