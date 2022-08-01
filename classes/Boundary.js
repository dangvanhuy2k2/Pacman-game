export default class Boundary {
  static width = 40;
  static height = 40;

  constructor({ x, y, image }) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.image = image;
  }

  update(c) {
    this.draw(c);
  }

  draw(c) {
    c.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
