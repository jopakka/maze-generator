'use strict';

const genBtn = document.querySelector('#form-generate');
const mazeCanvas = document.querySelector('.maze-canvas');
const mazeWidth = document.querySelector('#form-width');
const mazeHeight = document.querySelector('#form-height');
const mazeWidthText = document.querySelector('#form-width-text');
const mazeHeightText = document.querySelector('#form-height-text');
const visualizeToggle = document.querySelector('#form-visualize');

const mazeGen = recursiveBacktrackingMaze(mazeCanvas);
const cs = 30;

const generate = async () => {
  formState(true)
  drawGrid()
  await mazeGen.generate(0, 0);
  formState(false)
};

const drawGrid = () => {
  const {w, h} = gridValues();
  mazeGen.setup(w, h, cs, visualizeToggle.checked);
  mazeCanvas.width = w * cs;
  mazeCanvas.height = h * cs;
  mazeHeightText.textContent = "Height: " + h
  mazeWidthText.textContent = "Width: " + w
  mazeGen.clearMaze();
};

const gridValues = () => {
  const w = parseInt(mazeWidth.value);
  const h = parseInt(mazeHeight.value);
  return {w, h};
};

const formState = (val) => {
  genBtn.disabled = val;
  mazeWidth.disabled = val;
  mazeHeight.disabled = val;
  visualizeToggle.disabled = val;
}

genBtn.addEventListener('click', generate);

mazeWidth.addEventListener('change', drawGrid);
mazeWidth.addEventListener('input', drawGrid);
mazeHeight.addEventListener('change', drawGrid);
mazeHeight.addEventListener('input', drawGrid);
