export default class Ghost {
  constructor({ x, y, color }) {
    this.radius = 16;
    this.x = x + this.radius + 5;
    this.y = y + this.radius + 5;
    this.color = color;
    this.speedX = 5;
    this.speedY = 0;
    this.prevCollisions = [];
  }

  update(c) {
    this.x += this.speedX;
    this.y += this.speedY;
    this.draw(c);
  }

  draw(c) {
    c.fillStyle = this.color;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fill();
    c.closePath();

    // c.fillStyle = "red";
    // c.fillRect(this.x, this.y, this.radius, this.radius);
  }
}
