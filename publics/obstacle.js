class Obstacle {
  constructor(x, y, radius) {
    this.position = createVector(x, y);
    this.radius = radius;
  }

  // Wrap around edges of canvas
  warpEdges() {
    //wrap X
    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width;
    }

    //wrap Y
    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height;
    }
  }

  update() {
    //this.position.x++;
  }

  // Draw the obstacle on the canvas
  draw() {
    fill("red");
    noStroke();
    ellipse(this.position.x, this.position.y, this.radius * 2);
  }
}
