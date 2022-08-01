export default class Pellet {
  constructor({ x, y }) {
    this.radius = 4;
    this.x = x;
    this.y = y;
    this.markForDeletion = false;
  }

  update(c) {
    this.draw(c);
  }

  draw(c) {
    c.fillStyle = "white";
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fill();
    c.closePath();

    // c.fillStyle = "red";
    // c.fillRect(this.x, this.y, this.radius, this.radius);
  }
}
