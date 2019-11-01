class SoundManager {
  constructor() {
    window.addEventListener('shape_collide', this.playCollisionSound.bind(this))
    this.lastCollisionTime = 0;
  }

  playCollisionSound(e) {
    const { force, type } = e.detail

    let now = performance.now();
    if (now - this.lastCollisionTime > 200) {
      this.play("snowbox_collision", Math.max(0, Math.min(1, (force-0.5)/3)), Math.random(0.5) + 0.75);
      this.lastCollisionTime = now;
    }
  }

  play(event, ...args) {
    let argsToSend = [].slice.call(arguments);
    argsToSend.unshift('sound-trigger')
    window.santaApp.fire.apply(this, argsToSend);
  }
}

export default new SoundManager()
