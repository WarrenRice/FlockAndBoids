// Array to store boids
const flock = [];
const obstacles = [];

// Slider variables
let alignSlider, cohesionSlider, separationSlider, avoidanceSlider;

// Setup function - runs once at the beginning
function setup() {
  // Create canvas and attach it to container div
  let canvas = createCanvas(1080, 720);
  canvas.parent("container");

  // Create div for controls and attach it to controls div
  let controlsDiv = createDiv();
  controlsDiv.parent("controls");

  // Create sliders
  alignSlider = createSlider(0, 5, 1, 0.1);
  cohesionSlider = createSlider(0, 5, 1, 0.1);
  separationSlider = createSlider(0, 5, 1, 0.1);

  avoidanceSlider = createSlider(0, 5, 1, 0.1);

  // Create labels for sliders
  let alignLabel = createSpan("Alignment: ");
  let cohesionLabel = createSpan("Cohesion: ");
  let separationLabel = createSpan("Separation: ");

  let avoidanceLabel = createSpan("Avoidance: ");

  // Add sliders and labels to controls div
  alignLabel.parent(controlsDiv);
  alignSlider.parent(controlsDiv);
  cohesionLabel.parent(controlsDiv);
  cohesionSlider.parent(controlsDiv);
  separationLabel.parent(controlsDiv);
  separationSlider.parent(controlsDiv);

  avoidanceLabel.parent(controlsDiv);
  avoidanceSlider.parent(controlsDiv);

  let noteDiv = createDiv();
  noteDiv.parent("notes");
  let noteLabel = createSpan("Note: W/A/S/D to move a red obstacle");
  noteLabel.parent(noteDiv);

  // Style controls div if needed
  controlsDiv.style("margin-top", "10px");

  // Create 100 boids and add them to the flock array
  for (let i = 0; i < 255; i++) {
    flock.push(new Boid());
  }

  obstacles.push(new Obstacle(width / 2, height / 2, 25));
  //obstacle = new Obstacle(width / 2, height / 2, 25);
}

// Add event listeners for key presses
document.addEventListener("keydown", function (event) {
  if (event.key === "w") {
    // Move obstacle up
    obstacles[0].position.y -= 5; // Adjust the value as needed
  } else if (event.key === "s") {
    // Move obstacle down
    obstacles[0].position.y += 5; // Adjust the value as needed
  } else if (event.key === "a") {
    // Move obstacle left
    obstacles[0].position.x -= 5; // Adjust the value as needed
  } else if (event.key === "d") {
    // Move obstacle right
    obstacles[0].position.x += 5; // Adjust the value as needed
  }
});

// Draw function - runs continuously
function draw() {
  // Set background color
  background(55);

  // Update and draw each boid in the flock
  for (let boid of flock) {
    boid.warpEdges();
    boid.flock(flock, obstacles);
    boid.update();
    boid.draw();
  }

  for (let obstacle of obstacles) {
    obstacle.warpEdges();
    obstacle.update();
    obstacle.draw();
  }
}
