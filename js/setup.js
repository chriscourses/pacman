function generateBoundaries() {
  const map = [
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
  ]

  const boundaries = []

  map.forEach((row, i) => {
    row.forEach((symbol, j) => {
      switch (symbol) {
        case '-':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i,
              },
              image: createImage('./img/pipeHorizontal.png'),
            }),
          )
          break
        case '|':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i,
              },
              image: createImage('./img/pipeVertical.png'),
            }),
          )
          break
        case '1':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i,
              },
              image: createImage('./img/pipeCorner1.png'),
            }),
          )
          break
        case '2':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i,
              },
              image: createImage('./img/pipeCorner2.png'),
            }),
          )
          break
        case '3':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i,
              },
              image: createImage('./img/pipeCorner3.png'),
            }),
          )
          break
        case '4':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i,
              },
              image: createImage('./img/pipeCorner4.png'),
            }),
          )
          break
        case 'b':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i,
              },
              image: createImage('./img/block.png'),
            }),
          )
          break
        case '[':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height,
              },
              image: createImage('./img/capLeft.png'),
            }),
          )
          break
        case ']':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height,
              },
              image: createImage('./img/capRight.png'),
            }),
          )
          break
        case '_':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height,
              },
              image: createImage('./img/capBottom.png'),
            }),
          )
          break
        case '^':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height,
              },
              image: createImage('./img/capTop.png'),
            }),
          )
          break
        case '+':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height,
              },
              image: createImage('./img/pipeCross.png'),
            }),
          )
          break
        case '5':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height,
              },
              color: 'blue',
              image: createImage('./img/pipeConnectorTop.png'),
            }),
          )
          break
        case '6':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height,
              },
              color: 'blue',
              image: createImage('./img/pipeConnectorRight.png'),
            }),
          )
          break
        case '7':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height,
              },
              color: 'blue',
              image: createImage('./img/pipeConnectorBottom.png'),
            }),
          )
          break
        case '8':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height,
              },
              image: createImage('./img/pipeConnectorLeft.png'),
            }),
          )
          break
        case '.':
          pellets.push(
            new Pellet({
              position: {
                x: j * Boundary.width + Boundary.width / 2,
                y: i * Boundary.height + Boundary.height / 2,
              },
            }),
          )
          break

        case 'p':
          powerUps.push(
            new PowerUp({
              position: {
                x: j * Boundary.width + Boundary.width / 2,
                y: i * Boundary.height + Boundary.height / 2,
              },
            }),
          )
          break

        case 'I':
          items.push(
            new Item({
              position: {
                x: j * Boundary.width + Boundary.width / 2,
                y: i * Boundary.height + Boundary.height / 2,
              },
              imgSrc: './img/sprites/cherry.png',
            }),
          )
          break
      }
    })
  })
  return boundaries
}
