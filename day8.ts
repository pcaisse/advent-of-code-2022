import fs from "fs";

const lines = fs.readFileSync(process.stdin.fd, "utf-8").trim().split("\n");

const cols = lines[0].length;
const rows = lines.length;

interface Tree {
  visible: boolean;
  value: number;
}

const range = (size: number) => [...Array(size).keys()];

const isEdge = (rowIndex: number, colIndex: number) =>
  colIndex === 0 ||
  colIndex === cols - 1 ||
  rowIndex === 0 ||
  rowIndex === rows - 1;

const isTreeVisible = (
  grid: Tree[][],
  rowIndex: number,
  colIndex: number
): boolean => {
  const tree = grid[rowIndex][colIndex];
  const { value } = tree;
  const isVisible = (tree: Tree) => tree.value < value;
  const aboveTrees = range(rowIndex).map(
    (i) => grid[rowIndex - (i + 1)][colIndex]
  );
  const belowTrees = range(rows - 1 - rowIndex).map(
    (i) => grid[rowIndex + (i + 1)][colIndex]
  );
  const leftTrees = range(colIndex).map(
    (i) => grid[rowIndex][colIndex - (i + 1)]
  );
  const rightTrees = range(cols - 1 - colIndex).map(
    (i) => grid[rowIndex][colIndex + (i + 1)]
  );
  const isVisibleFromAbove = aboveTrees.every(isVisible);
  const isVisibleFromBelow = belowTrees.every(isVisible);
  const isVisibleFromRight = rightTrees.every(isVisible);
  const isVisibleFromLeft = leftTrees.every(isVisible);
  return (
    isVisibleFromAbove ||
    isVisibleFromBelow ||
    isVisibleFromRight ||
    isVisibleFromLeft
  );
};

function setVisible(grid: Tree[][]) {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const isEdgeTree = isEdge(i, j);
      grid[i][j].visible = isEdgeTree ? true : isTreeVisible(grid, i, j);
    }
  }
  return grid;
}

// initialize grid
const grid = [];
for (let i = 0; i < rows; i++) {
  grid[i] = [...new Array(cols)].map((_, index) => ({
    visible: false,
    value: Number(lines[i][index]),
  }));
}

const trees = setVisible(grid);

console.log(
  trees.flat().reduce((total, { visible }) => total + (visible ? 1 : 0), 0)
);
