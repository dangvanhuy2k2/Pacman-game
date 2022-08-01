export default class Player {
  constructor({ x, y }) {
    this.radius = 16;
    this.x = x + this.radius + 5;
    this.y = y + this.radius + 5;
    this.speedX = 0;
    this.speedY = 0;
  }

  update(c) {
    this.x += this.speedX;
    this.y += this.speedY;
    this.draw(c);
  }

  draw(c) {
    c.fillStyle = "yellow";
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fill();
    c.closePath();

    // c.fillStyle = "red";
    // c.fillRect(this.x, this.y, this.radius, this.radius);
  }
}
