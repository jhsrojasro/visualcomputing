let handpose;
let video;
let hands = [];

function setup() {
  canvas = createCanvas(600, 400);
  canvas.parent('sketch-holder');
  video = createCapture(VIDEO);
  video.size(width, height);

  handpose = ml5.handpose(video, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new hand poses are detected
  handpose.on("hand", results => {
    hands = results;
    calculateDepth();
  });

  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  for (let i = 0; i < hands.length; i += 1) {
    const hand = hands[i];
    for (let j = 0; j < hand.landmarks.length; j += 1) {
      const keypoint = hand.landmarks[j];
      fill(0, 255, 0);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 10, 10);
    }
  }
}

function calculateDepth(){
  for (let i =0; i< hands.length; i += 1 ){
    const hand = hands[i];
    let mean = 0; 
    for (let j =0; j<hand.landmarks.length; j+=1) {
      const keypoint = hand.landmarks[j];
      mean += keypoint[2];
    }
    max_depth = 60;
    min_depth = -10;
    depth = mean / hand.landmarks.length * -1;
    depth -= min_depth;
    depth /= max_depth - min_depth;
    document.cookie = "depth="+depth.toString();
  }
}