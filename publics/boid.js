class Boid {
  constructor() {
    // Initialize boid properties
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.maxForce = 0.2; // Maximum steering force
    this.maxSpeed = 5; // Maximum speed
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

  // Steering behavior: Alignment
  align(boids) {
    // Define the maximum distance at which a boid can influence this boid's alignment
    let perceptionRadius = 25;

    // Initialize the steering force vector
    let steering = createVector();

    // Counter to keep track of the number of nearby boids considered for alignment
    let total = 0;

    // Loop through all boids in the flock
    for (let other of boids) {
      // Calculate the distance between this boid and the current other boid
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      // Check if the other boid is not the same as this boid and is within the perception radius
      if (other != this && d < perceptionRadius) {
        // Add the velocity of the other boid to the steering force
        steering.add(other.velocity);

        // Increment the total number of nearby boids considered
        total++;
      }
    }

    // If there are nearby boids for alignment
    if (total > 0) {
      // Calculate the average velocity direction of nearby boids
      steering.div(total);
      // Set the magnitude of the steering force to the maximum speed
      steering.setMag(this.maxSpeed);
      // Calculate the desired change in velocity by subtracting the current velocity
      steering.sub(this.velocity);
      // Limit the magnitude of the steering force to the maximum steering force
      steering.limit(this.maxForce);
    }
    // Return the alignment steering force
    return steering;
  }

  // Steering behavior: Separation
  separation(boids) {
    // Define the maximum distance at which a boid can influence this boid's separation
    let perceptionRadius = 24;
    // Initialize the steering force vector
    let steering = createVector();
    // Counter to keep track of the number of nearby boids considered for separation
    let total = 0;
    // Loop through all boids in the flock
    for (let other of boids) {
      // Calculate the distance between this boid and the current other boid
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );

      // Check if the other boid is not the same as this boid and is within the perception radius
      if (other != this && d < perceptionRadius) {
        // Calculate the vector pointing away from the other boid
        let diff = p5.Vector.sub(this.position, other.position);
        // Weight the vector by the inverse square of the distance
        diff.div(d * d);
        // Add the weighted vector to the steering force
        steering.add(diff);
        // Increment the total number of nearby boids considered
        total++;
      }
    }

    // If there are nearby boids for separation
    if (total > 0) {
      // Calculate the average steering force
      steering.div(total);
      // Set the magnitude of the steering force to the maximum speed
      steering.setMag(this.maxSpeed);
      // Calculate the desired change in velocity by subtracting the current velocity
      steering.sub(this.velocity);
      // Limit the magnitude of the steering force to the maximum steering force
      steering.limit(this.maxForce);
    }
    // Return the separation steering force
    return steering;
  }

  // Steering behavior: Cohesion
  cohesion(boids) {
    // Define the maximum distance at which a boid can influence this boid's cohesion
    let perceptionRadius = 50;
    // Initialize the steering force vector
    let steering = createVector();
    // Counter to keep track of the number of nearby boids considered for cohesion
    let total = 0;
    // Loop through all boids in the flock
    for (let other of boids) {
      // Calculate the distance between this boid and the current other boid
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      // Check if the other boid is not the same as this boid and is within the perception radius
      if (other != this && d < perceptionRadius) {
        // Add the position of the other boid to the steering force
        steering.add(other.position);
        // Increment the total number of nearby boids considered
        total++;
      }
    }

    // If there are nearby boids for cohesion
    if (total > 0) {
      // Calculate the average position of nearby boids
      steering.div(total);
      // Calculate the vector pointing towards the average position
      steering.sub(this.position);
      // Set the magnitude of the steering force to the maximum speed
      steering.setMag(this.maxSpeed);
      // Calculate the desired change in velocity by subtracting the current velocity
      steering.sub(this.velocity);
      // Limit the magnitude of the steering force to the maximum steering force
      steering.limit(this.maxForce);
    }
    // Return the cohesion steering force
    return steering;
  }

  // Avoid obstacles
  avoidObstacles(obstacles) {
    // Define the perception radius within which the boid detects obstacles
    let perceptionRadius = 100;

    // Initialize the steering force vector
    let steering = createVector();

    // Counter to keep track of the number of nearby obstacles
    let total = 0;

    // Loop through all obstacles
    for (let obstacle of obstacles) {
      // Calculate the distance between the boid and the obstacle
      let d = p5.Vector.dist(this.position, obstacle.position);

      // Check if the obstacle is within the boid's perception radius
      if (d < perceptionRadius) {
        // Calculate the vector pointing away from the obstacle
        let diff = p5.Vector.sub(this.position, obstacle.position);

        // Scale the vector based on the distance (inverse square law)
        diff.div(d * d);

        // Add the scaled vector to the steering force
        steering.add(diff);

        // Increment the total number of nearby obstacles
        total++;
      }
    }

    // If there are nearby obstacles
    if (total > 0) {
      // Calculate the average steering force
      steering.div(total);

      // Set the magnitude of the steering force to the maximum speed
      steering.setMag(this.maxSpeed);

      // Calculate the desired change in velocity by subtracting the current velocity
      steering.sub(this.velocity);

      // Limit the magnitude of the steering force to the maximum steering force
      steering.limit(this.maxForce);
    }

    // Return the steering force
    return steering;
  }

  // Combine steering behaviors
  flock(boids, obstacles) {
    // Calculate alignment, cohesion, and separation steering forces
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);

    let avoidance = this.avoidObstacles(obstacles); // New function for obstacle avoidance

    // Scale the steering forces by the values of the sliders
    alignment.mult(alignSlider.value());
    cohesion.mult(cohesionSlider.value());
    separation.mult(separationSlider.value());

    avoidance.mult(avoidanceSlider.value()); // Adjust slider for obstacle avoidance

    // Add the scaled steering forces to the boid's acceleration
    this.acceleration.add(alignment);
    this.acceleration.add(separation);
    this.acceleration.add(cohesion);

    this.acceleration.add(avoidance); // Add obstacle avoidance force
  }

  // Update boid's position, velocity, and acceleration
  update() {
    // Add the velocity vector to the position vector to update the boid's position
    this.position.add(this.velocity);

    // Add the acceleration vector to the velocity vector to update the boid's velocity
    this.velocity.add(this.acceleration);

    // Limit the magnitude of the velocity vector to the maximum speed
    this.velocity.limit(this.maxSpeed);

    // Reset the acceleration vector to zero after updating the velocity
    this.acceleration.mult(0);
  }

  // Draw the boid on the canvas
  draw() {
    // Calculate the angle of rotation based on the boid's velocity direction
    let angle = this.velocity.heading() + PI / 2;

    // Set the fill and stroke color to white
    fill(255);
    stroke(255);

    // Push the current transformation matrix onto the stack
    push();

    // Translate the origin of the coordinate system to the boid's position
    translate(this.position.x, this.position.y);

    // Rotate the coordinate system by the calculated angle
    rotate(angle);

    // Begin drawing the shape of the boid
    beginShape();
    // Define the vertices of the triangle representing the boid
    vertex(0, -6);
    vertex(-3, 3);
    vertex(3, 3);
    // End the shape
    endShape(CLOSE);

    // Restore the previous transformation matrix from the stack
    pop();
  }
}
