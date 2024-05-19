var cols, rows;
var w = 40;
var grid = [];
let canvasSize;
var seconds = 0,
  minutes = 0,
  hours = 0;
var timerInterval;

var current;

var stack = [];

window.onload = function () {
  var savedSize = localStorage.getItem("canvasSize");
  if (savedSize) {
    canvasSize = savedSize;
  } else {
    canvasSize = 200;
  }
};

function setup() {
  var canvas = createCanvas(canvasSize, canvasSize);
  canvas.parent("canvas-container");
  cols = floor(width / w);
  rows = floor(height / w);
  timerInterval = setInterval(updateTimer, 1000); // Update every 1 second

  for (var j = 0; j < rows; j++) {
    for (var i = 0; i < cols; i++) {
      var cell = new Cell(i, j);
      grid.push(cell);
    }
  }

  current = grid[0];
}

function draw() {
  background(60);
  for (var i = 0; i < grid.length; i++) {
    grid[i].show();
  }

  current.visited = true;
  current.highlight();
  var next = current.checkNeighbours();
  //Step 1
  if (next) {
    next.visited = true;
    //Step 2
    stack.push(current);
    //Step 3
    removeWalls(current, next);
    //Step 4
    current = next;
  } else if (stack.length > 0) {
    current = stack.pop();
  } else {
    clearInterval(timerInterval);
  }
}

function index(i, j) {
  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
    return -1;
  }

  return i + j * cols;
}

function Cell(i, j) {
  this.i = i;
  this.j = j;
  this.walls = [true, true, true, true];
  this.visited = false;

  this.checkNeighbours = function () {
    var neighbours = [];

    var top = grid[index(i, j - 1)];
    var right = grid[index(i + 1, j)];
    var bottom = grid[index(i, j + 1)];
    var left = grid[index(i - 1, j)];

    if (top && !top.visited) {
      neighbours.push(top);
    }
    if (right && !right.visited) {
      neighbours.push(right);
    }
    if (bottom && !bottom.visited) {
      neighbours.push(bottom);
    }
    if (left && !left.visited) {
      neighbours.push(left);
    }

    if (neighbours.length > 0) {
      var r = floor(random(0, neighbours.length));
      return neighbours[r];
    } else {
      return undefined;
    }
  };

  this.show = function () {
    var x = this.i * w;
    var y = this.j * w;
    stroke(255);
    if (this.walls[0]) {
      line(x, y, x + w, y); //Top
    }
    if (this.walls[1]) {
      line(x + w, y, x + w, y + w); // Right
    }
    if (this.walls[2]) {
      line(x, y + w, x + w, y + w); //Bottom
    }
    if (this.walls[3]) {
      line(x, y, x, y + w); // Left
    }

    if (this.visited == true) {
      if (i == cols - 1 && j == rows - 1) {
        var x = this.i * w;
        var y = this.j * w;
        noStroke();
        fill(255, 0, 0, 200);
        rect(x, y, w, w);
      } else if (i == 0 && j == 0) {
        var x = this.i * w;
        var y = this.j * w;
        noStroke();
        fill(0, 255, 0, 255);
        rect(x, y, w, w);
      } else {
        noStroke();
        fill(0, 0, 0, 0);
        rect(x, y, w, w);
      }
      rect(x, y, w, w);
    }
  };

  this.highlight = function () {
    if (!(i == 0 && j == 0)) {
      var x = this.i * w;
      var y = this.j * w;
      noStroke();
      fill(0, 0, 255, 255);
      rect(x, y, w, w);
    }
  };
}

function removeWalls(a, b) {
  var x = a.i - b.i;
  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }

  var y = a.j - b.j;
  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}

function submitForm() {
  var size = document.getElementById("size").value;
  if (size > 1600) {
    alert("Max sized reached (40 by 40)");
    size = 6;
  }
  localStorage.setItem("canvasSize", size);
  canvasSize = size * w;
  setup();
}

function updateTimer() {
  seconds++;
  if (seconds >= 60) {
    seconds = 0;
    minutes++;
    if (minutes >= 60) {
      minutes = 0;
      hours++;
    }
  }
  var displayHours = hours < 10 ? "0" + hours : hours;
  var displayMinutes = minutes < 10 ? "0" + minutes : minutes;
  var displaySeconds = seconds < 10 ? "0" + seconds : seconds;

  document.getElementById("timer").textContent =
    displayHours + ":" + displayMinutes + ":" + displaySeconds;
}
