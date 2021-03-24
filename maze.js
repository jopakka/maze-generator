'use strict';

const genBtn = document.querySelector('#form-generate');
const mazeCanvas = document.querySelector('.maze-canvas');
const pathCanvas = document.querySelector('.pathfind-canvas');
const pathCanvasCtx = pathCanvas.getContext('2d');
const cellSize = document.querySelector('#form-size');
const cellSizeText = document.querySelector('#form-size-text');
const visualizeMazeToggle = document.querySelector('#form-visualize-maze');
const visualizePathToggle = document.querySelector('#form-visualize-path');
const genPathBtn = document.querySelector('#form-generate-path');

const mazeGen = recursiveBacktrackingMaze(mazeCanvas);
const aPathFind = aStarPathFind(pathCanvas);

const settings = {
  grid: undefined,
  rows: undefined,
  cols: undefined,
};

const generate = async () => {
  pathFormState(false);
  mazeFormState(false);
  clearValues();
  drawGrid();
  const {grid, rows, columns} = await mazeGen.generate(0, 0);
  setValues(grid, rows, columns);
  pathFormState(true);
  mazeFormState(true);
};

const setValues = (g, r, c) => {
  settings.grid = g;
  settings.rows = r;
  settings.cols = c;
};

const clearValues = () => {
  settings.cols = undefined;
  settings.rows = undefined;
  settings.grid = undefined;
};

const drawGrid = () => {
  pathFormState(false);
  const {cs} = gridValues();
  mazeGen.setup(Math.floor(mazeCanvas.width / cs),
      Math.floor(mazeCanvas.height / cs), cs, visualizeMazeToggle.checked);
  cellSizeText.textContent = 'Cell Size: ' + cs;
  mazeGen.clearMaze();
  pathCanvasCtx.clearRect(0, 0, pathCanvasCtx.canvas.width,
      pathCanvasCtx.canvas.height);
};

const startPathFind = async () => {
  pathFormState(false);
  mazeFormState(false);
  if (settings.rows === undefined || settings.cols === undefined ||
      settings.grid === undefined) {
    pathFormState(true);
    mazeFormState(true);
    return;
  }
  const path = await aPathFind.start(0, settings.grid.length - 1, settings.cols,
      settings.rows, gridValues().cs, settings.grid, visualizePathToggle.checked);
  if (path) {
    pathCanvasCtx.strokeStyle = '#00F';
    pathCanvasCtx.lineWidth = gridValues().cs / 4;
    pathCanvasCtx.beginPath();
    pathCanvasCtx.moveTo(path[0].x * cellSize.value + cellSize.value / 2,
        path[0].y * cellSize.value + cellSize.value / 2);
    for (let i = 1; i < path.length; i++) {
      pathCanvasCtx.lineTo(path[i].x * cellSize.value + cellSize.value / 2,
          path[i].y * cellSize.value + cellSize.value / 2);
    }
    pathCanvasCtx.stroke();
  } else {
    console.log('No path found');
  }

  pathFormState(true)
  mazeFormState(true);
};

const gridValues = () => {
  const cs = parseInt(cellSize.value);
  return {cs};
};

const mazeFormState = (val) => {
  genBtn.disabled = !val;
  cellSize.disabled = !val;
  visualizeMazeToggle.disabled = !val;
};

const pathFormState = (val) => {
  genPathBtn.disabled = !val;
  visualizePathToggle.disabled = !val;
};

const fitCanvas = () => {
  mazeCanvas.width = mazeCanvas.offsetWidth;
  mazeCanvas.height = mazeCanvas.offsetHeight;
  pathCanvas.width = mazeCanvas.width;
  pathCanvas.height = mazeCanvas.height;
  drawGrid();
};

pathFormState(false);

genBtn.addEventListener('click', generate);
genPathBtn.addEventListener('click', startPathFind);
cellSize.addEventListener('change', drawGrid);
cellSize.addEventListener('input', drawGrid);
