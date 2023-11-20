const sound = {
  pellets: [
    new Howl({
      src: './audio/pellet.mp3',
      volume: 0.5,
    }),
    new Howl({
      src: './audio/pellet2.mp3',
      volume: 0.5,
    }),
  ],
  siren: new Howl({
    src: './audio/siren.mp3',
    loop: true,
    volume: 0.5,
  }),
  cherry: new Howl({
    src: './audio/cherry.wav',
    volume: 0.5,
  }),
  powerUp: new Howl({
    src: './audio/powerup.wav',
    volume: 0.5,
  }),
  ghostScared: new Howl({
    src: './audio/ghostScared.wav',
    loop: true,
    volume: 0.3,
  }),
  success: new Howl({
    src: './audio/success.wav',
    volume: 0.5,
  }),
  die: new Howl({
    src: './audio/die.wav',
    volume: 0.5,
  }),

  gameOver: new Howl({
    src: './audio/gameOver.wav',
    volume: 0.5,
  }),
}
