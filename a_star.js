"use strict"

const aStarPathFind = (canvas) => {
  const ctx = canvas.getContext('2d');

  const grid = [];
  const openSet = [];
  const closedSet = [];
  const settings = {
    cols: 0,
    rows: 0,
    cs: 0,
    maze: [],
    visualise: false
  }

  const Node = class {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.f = 0;
      this.g = 0;
      this.h = 0;
      this.neighbors = []
      this.previous = undefined;
    }

    setNeighbours() {
      const neighbours = [];
      const index = getIndex(this.x, this.y)
      const current = settings.maze[index]
      if(!current.walls[0]) { // N
        neighbours.push(getIndex(this.x, this.y - 1))
      }
      if(!current.walls[1]) { // S
        neighbours.push(getIndex(this.x, this.y + 1))
      }
      if(!current.walls[2]) { // W
        neighbours.push(getIndex(this.x - 1, this.y))
      }
      if(!current.walls[3]) { // E
        neighbours.push(getIndex(this.x + 1, this.y))
      }
      this.neighbors = neighbours;
    }

    show(col) {
      ctx.fillStyle = col
      ctx.fillRect(this.x * settings.cs + settings.cs / 4,
          this.y * settings.cs + settings.cs / 4,
          settings.cs / 2, settings.cs / 2);
    }
  }

  const getIndex = (x, y) => {
    if (x < 0 || y < 0 || x > settings.cols - 1 || y > settings.rows - 1) {
      return -1;
    }

    return x + y * settings.cols;
  };

  const initGrid = () => {
    grid.length = 0;
    settings.maze.forEach(e => {
      const node = new Node(e.coords.x, e.coords.y);
      node.setNeighbours()
      grid.push(node)
    })
  }

  const aStar = async (start, goal) => {
    openSet.push(grid[start])

    while (openSet.length > 0) {
      let lowest = 0;
      for (let i = 0; i < openSet.length; i++) {
        if(openSet[i].f < openSet[lowest].f) {
          lowest = i;
        }
      }

      const current = openSet[lowest];

      if(current === grid[goal]) {
        console.log("PATH FOUND!")
        const path = [];
        let temp = current
        path.push(temp)
        while(temp.previous) {
          path.push(temp.previous)
          temp = temp.previous
        }

        return path;
      }

      removeFromArray(current, openSet)
      closedSet.push(current)

      current.neighbors.forEach(n => {
        const neighbor = grid[n];
        if(!closedSet.includes(neighbor)) {
          const tempG = current.g + 1;
          if(openSet.includes(neighbor)) {
            if(tempG < neighbor.g) {
              neighbor.g = tempG;
            }
          } else {
            neighbor.g = tempG;
            openSet.push(neighbor);
          }

          neighbor.h = heuristic(neighbor, grid[goal])
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        }
      })

      if(settings.visualise) {
        openSet.forEach(e => e.show("#F00"))
        closedSet.forEach(e => e.show("#0F0"))
        await new Promise(r => setTimeout(r, 10))
        clearCanvas()
      }
    }
    return false
  }

  const heuristic = (neighbor, end) => {
    return Math.sqrt(
        Math.pow(end.x - neighbor.x, 2)
        + Math.pow(end.y - neighbor.y, 2)
    );
  }

  const removeFromArray = (el, arr) => {
    for (let i = arr.length - 1; i >= 0; i--) {
      if(arr[i] === el) {
        arr.splice(i, 1)
      }
    }
  }

  const clearCanvas = () => {
    ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height)
  }

  // Return path array if found, else false
  const start = async (start, end, cols, rows, cellSize, maze, vis) => {
    settings.cols = cols;
    settings.rows = rows;
    settings.maze = maze;
    settings.cs = cellSize;
    settings.visualise = vis;
    openSet.length = 0;
    closedSet.length = 0;
    initGrid();
    clearCanvas()
    return await aStar(start, end)
  }

  return {
    start
  }
}
