'use strict';

const recursiveBacktrackingMaze = (canvas) => {
  const ctx = canvas.getContext('2d');

  const DIRECTIONS = Object.freeze({
    N: 0,
    S: 1,
    W: 2,
    E: 3,
  });

  const DX = Object.freeze({
    N: 0,
    S: 0,
    W: -1,
    E: 1,
  });

  const DY = Object.freeze({
    N: -1,
    S: 1,
    W: 0,
    E: 0,
  });

  const OPPOSITE = Object.freeze({
    N: 1,
    S: 0,
    W: 3,
    E: 2,
  });

  const settings = {
    rows: 20,
    cols: 20,
    cs: 20,
    visualise: true,
    wallColor: 'black',
    currentColor: 'red',
    visitedColor: '#EEE',
  };

  const grid = [];
  let steps = 0;
  let maxSteps = 0;

  const Cell = class {
    constructor(x, y, ctx) {
      this.coords = {x: x, y: y};
      this.ctx = ctx;
      this.visited = false;
      this.current = false;
      this.walls = [true, true, true, true]; // N, S, W, E
    }

    set steps(val) {
      this.stepsFromStart = val;
    }

    visitFrom(from) {
      this.walls[from] = false;
    }

    goTo(to) {
      this.walls[to] = false;
    }

    draw() {
      const x = this.coords.x * settings.cs;
      const y = this.coords.y * settings.cs;

      this.ctx.clearRect(x, y, settings.cs, settings.cs);

      if (this.visited) {
        this.ctx.fillStyle = this.current ?
            settings.currentColor :
            settings.visitedColor;
        this.ctx.fillRect(x, y, settings.cs, settings.cs);
      }

      this.ctx.lineWidth = 1
      if (this.walls[0])
        drawLine(x, y, x + settings.cs, y, this.ctx);
      if (this.walls[1])
        drawLine(x, y + settings.cs, x + settings.cs, y + settings.cs, this.ctx);
      if (this.walls[2])
        drawLine(x, y, x, y + settings.cs, this.ctx);
      if (this.walls[3])
        drawLine(x + settings.cs, y, x + settings.cs, y + settings.cs, this.ctx);
    }
  };

  const drawLine = (sx, sy, tx, ty, ctx) => {
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(tx, ty);
    ctx.stroke();
  };

  const initGrid = () => {
    grid.length = 0;
    for (let y = 0; y < settings.rows; y++) {
      for (let x = 0; x < settings.cols; x++) {
        const cell = new Cell(x, y, ctx);
        grid.push(cell);
      }
    }
  };

  const shuffleArray = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  };

  const getIndex = (x, y) => {
    if (x < 0 || y < 0 || x > settings.cols - 1 || y > settings.rows - 1) {
      return -1;
    }

    return x + y * settings.cols;
  };

  const recursiveBacktrack = async (cx, cy, grid) => {
    const index = getIndex(cx, cy);
    grid[index].visited = true;
    grid[index].steps = steps;
    steps++;
    if (maxSteps < steps) maxSteps = steps;

    const dirs = shuffleArray(['N', 'S', 'E', 'W']);
    for (const dir of dirs) {
      const nx = cx + DX[dir];
      const ny = cy + DY[dir];
      const nextIndex = getIndex(nx, ny);
      if (settings.visualise) {
        grid[index].current = true;
        grid[index].draw();
      }

      if (nextIndex === -1) continue;

      if (settings.visualise) {
        await new Promise(r => setTimeout(r, 10));
      }

      if (!grid[nextIndex].visited) {
        grid[nextIndex].visitFrom(OPPOSITE[dir]);
        grid[index].goTo(DIRECTIONS[dir]);
        if (settings.visualise) {
          grid[index].current = false;
          grid[index].draw();
        }
        await recursiveBacktrack(nx, ny, grid);
      }
    }
    if (settings.visualise) {
      grid[index].current = false;
      grid[index].draw();
    }
    steps--;
  };

  const clearMaze = () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    initGrid();
    drawGrid();
  };

  const drawGrid = () => {
    grid.forEach(c => {
      c.draw();
    });
  };

  const generate = async (sx, sy) => {
    steps = 0;
    maxSteps = 0;
    initGrid();
    await recursiveBacktrack(sx, sy, grid);
    if (!settings.visualise) {
      drawGrid(grid);
    }
    return maxSteps;
  };

  const setup = (w, h, cs, v) => {
    settings.cols = w;
    settings.rows = h;
    settings.cs = cs;
    settings.visualise = v;
  };

  return {
    generate,
    setup,
    drawGrid,
    clearMaze,
    grid,
    settings
  };

};
