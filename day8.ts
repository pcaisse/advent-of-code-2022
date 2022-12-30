import fs from "fs";

const lines = fs.readFileSync(process.stdin.fd, "utf-8").trim().split("\n");

const cols = lines[0].length;
const rows = lines.length;

interface Tree {
  score: number;
  height: number;
}

const range = (size: number) => [...Array(size).keys()];

const isEdge = (rowIndex: number, colIndex: number) =>
  colIndex === 0 ||
  colIndex === cols - 1 ||
  rowIndex === 0 ||
  rowIndex === rows - 1;

const calcTreeScore = (
  grid: Tree[][],
  rowIndex: number,
  colIndex: number
): number => {
  const tree = grid[rowIndex][colIndex];
  const { height } = tree;
  const isNotVisible = (tree: Tree) => tree.height >= height;
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
  const withDefault = (value: number, defaultValue: number) =>
    value === 0 ? defaultValue : value;
  const scores = [aboveTrees, belowTrees, rightTrees, leftTrees].map(
    (rowOfTrees) =>
      withDefault(rowOfTrees.findIndex(isNotVisible) + 1, rowOfTrees.length)
  );
  return scores.flat().reduce((total, score) => total * score, 1);
};

function setVisible(grid: Tree[][]) {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const isEdgeTree = isEdge(i, j);
      grid[i][j].score = isEdgeTree ? 0 : calcTreeScore(grid, i, j);
    }
  }
  return grid;
}

// initialize grid
const grid = [];
for (let i = 0; i < rows; i++) {
  grid[i] = [...new Array(cols)].map((_, index) => ({
    score: 0,
    height: Number(lines[i][index]),
  }));
}

const trees = setVisible(grid);

console.log(Math.max(...trees.flat().map(({ score }) => score)));
