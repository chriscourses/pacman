class Ghost {
  static speed = 1
  constructor({
    position,
    velocity,
    color = 'red',
    imgSrc,
    state,
    speed,
    outOfCage,
  }) {
    this.position = JSON.parse(JSON.stringify(position))
    this.velocity = velocity
    this.radius = 15
    this.color = color
    this.prevCollisions = []
    this.speed = speed

    this.previousValidMoves = []
    this.outOfCage = outOfCage

    this.imageLoaded = false
    this.image = new Image()
    this.image.src = imgSrc
    this.image.onload = () => {
      this.imageLoaded = true
    }

    this.sprites = {
      default: {
        maxFrame: 8,
        image: null,
        src: imgSrc,
        loaded: false,
      },
      scared: {
        maxFrame: 8,
        image: null,
        src: './img/sprites/scaredGhost.png',
        loaded: false,
      },
    }

    for (const key in this.sprites) {
      this.sprites[key].image = new Image()
      this.sprites[key].image.src = this.sprites[key].src
      this.sprites[key].image.onload = () => {
        this.sprites[key].loaded = true
      }
    }

    this.maxFrames = 8
    this.currentFrame = 0
    this.elapsedTime = 0
    this.state = state
  }

  draw() {
    // c.beginPath()
    // c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    // c.fillStyle = this.scared ? 'blue' : this.color
    // c.fill()
    // c.closePath()

    if (this.imageLoaded) {
      const scaledWidth = this.image.width * 2
      const scaledHeight = this.image.height * 2

      const cropbox = {
        x: 0,
        y: 0,
        width: this.image.width / this.maxFrames,
        height: this.image.height,
      }
      c.drawImage(
        this.image,
        cropbox.width * this.currentFrame,
        cropbox.y,
        cropbox.width,
        cropbox.height,
        this.position.x - cropbox.width,
        this.position.y - cropbox.height,
        scaledWidth / this.maxFrames,
        scaledHeight,
      )
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

  gatherValidMoves(boundaries) {
    const directions = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ]

    // filter out the opposite direction
    const validMoves = directions.filter((direction) => {
      const oppositeDirection = { x: -this.velocity.x, y: -this.velocity.y }

      return (
        direction.x !== oppositeDirection.x ||
        direction.y !== oppositeDirection.y
      )
    })

    const PIXEL_BUFFER = 5
    for (const boundary of boundaries) {
      for (const direction of directions) {
        if (
          circleCollidesWithRectangle({
            circle: {
              ...this,
              velocity: {
                x: direction.x * PIXEL_BUFFER,
                y: direction.y * PIXEL_BUFFER,
              },
            },
            rectangle: boundary,
          })
        ) {
          // splice out the direction from our validMoves array
          validMoves.splice(
            validMoves.findIndex(
              (move) => move.x === direction.x && move.y === direction.y,
            ),
            1,
          )
        }
      }
    }

    return validMoves
  }

  updateFrames(delta) {
    this.elapsedTime += delta

    const GHOST_ANIMATION_RATE = 1000 / 30 / 1000
    if (this.elapsedTime > GHOST_ANIMATION_RATE) {
      this.elapsedTime = 0
      this.currentFrame++

      if (this.currentFrame >= this.maxFrames) {
        this.currentFrame = 0
      }
    }
  }

  enterGame(cageCenter) {
    this.outOfCage = true
    this.state = 'enteringGame'

    const timeline = gsap.timeline()

    timeline.to(this.position, {
      x: cageCenter.x,
    })

    timeline.to(this.position, {
      y: cageCenter.y - Boundary.height,
      onComplete: () => {
        this.state = 'active'
      },
    })
  }

  move(delta, boundaries) {
    const validMoves = this.gatherValidMoves(boundaries)

    if (
      validMoves.length > 0 &&
      validMoves.length !== this.previousValidMoves.length
    ) {
      // change ghosts velocity
      const chosenMove =
        validMoves[Math.floor(Math.random() * validMoves.length)]

      this.velocity.x = chosenMove.x
      this.velocity.y = chosenMove.y
    }

    if (this.collision(boundaries)) {
      this.velocity.x = 0
      this.velocity.y = 0
      this.snapToGrid()
    } else {
      this.position.x += this.velocity.x * delta * this.speed
      this.position.y += this.velocity.y * delta * this.speed
    }

    this.previousValidMoves = validMoves

    this.checkTransportOnVerticalAxis()
    this.checkTransportOnHorizontalAxis()
  }

  checkTransportOnVerticalAxis() {
    if (this.position.y + this.radius < 0) this.position.y = canvas.height
    else if (this.position.y - this.radius > canvas.height) this.position.y = 0
  }

  checkTransportOnHorizontalAxis() {
    if (this.position.x + this.radius < 0) this.position.x = canvas.width
    else if (this.position.x - this.radius > canvas.width) this.position.x = 0
  }

  update(delta, boundaries) {
    this.draw()
    this.updateFrames(delta)

    switch (this.state) {
      case 'preActive':
        this.image = this.sprites.default.image
        this.state = 'active'
        break
      case 'active':
        this.move(delta, boundaries)
        break
      case 'scared':
        this.move(delta, boundaries)
        break
      case 'preScared':
        this.image = this.sprites.scared.image
        this.state = 'scared'
        break
    }
  }
}
