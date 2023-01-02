// assume head and tail start at same positions, overlapping (0, 0)
// each move moves the head some number of positions in a given directions
// the position of the head relative to the tail dictates the tail's movement
// tail must always be touching head
// if tail is not touching in one dimenion, it jumps in a straight line to touch the head
// if tail is not touchign in either dimension, it jumps diagonally to touch the head
// as head moves based on input, make sure the tail "chases" it appropriately according to the above rules
// keep track of each move as a coordinate starting from (0, 0) as tuples in an array
// to count the number of unique tail positions to return the result, stringify the tuples and dedup

import { dir } from "console";
import fs from "fs";

type Direction = "right" | "left" | "up" | "down";

const directionMapping: Record<string, Direction> = {
  R: "right",
  L: "left",
  D: "down",
  U: "up",
};

interface Move {
  direction: Direction;
  spaces: number;
}

type Position = [number, number];

interface Positions {
  head: Position;
  tail: Position;
}

function parseMove(s: string): Move {
  const [letter, numSpaces] = s.split(" ");
  const direction = directionMapping[letter];
  if (!direction) {
    throw new Error("bad input");
  }
  return {
    direction,
    spaces: parseInt(numSpaces, 10),
  };
}

function breakUpMove(move: Move): Direction[] {
  return new Array(move.spaces).fill(move.direction);
}

const defaultPosition: Position = [0, 0];

function moveHead(singleMove: Direction, position: Position): Position {
  return singleMove === "right"
    ? [position[0] + 1, position[1]]
    : singleMove === "left"
    ? [position[0] - 1, position[1]]
    : singleMove === "up"
    ? [position[0], position[1] + 1]
    : [position[0], position[1] - 1];
}

const calcDiff = (a: number, b: number) =>
  a - b === 2 ? 1 : b - a === 2 ? -1 : 0;

const calcDiagonalDiff = (otherDiff: number, a: number, b: number) =>
  otherDiff !== 0 && a !== b ? a - b : 0;

function moveTail(newHeadPosition: Position, tailPosition: Position): Position {
  const xDiff = calcDiff(newHeadPosition[0], tailPosition[0]);
  const yDiff = calcDiff(newHeadPosition[1], tailPosition[1]);
  const xDiag = calcDiagonalDiff(yDiff, newHeadPosition[0], tailPosition[0]);
  const yDiag = calcDiagonalDiff(xDiff, newHeadPosition[1], tailPosition[1]);
  return [tailPosition[0] + xDiff + xDiag, tailPosition[1] + yDiff + yDiag];
}

const lines = fs.readFileSync(process.stdin.fd, "utf-8").trim().split("\n");

const { positions } = lines
  .map(parseMove)
  .flatMap(breakUpMove)
  .reduce(
    ({ positions, lastPosition }, singleMove) => {
      const newHeadPosition: Position = moveHead(
        singleMove,
        lastPosition ? lastPosition.head : defaultPosition
      );
      const newTailPosition = moveTail(
        newHeadPosition,
        lastPosition ? lastPosition.tail : defaultPosition
      );
      const newPosition = { head: newHeadPosition, tail: newTailPosition };
      positions.push(newPosition);
      return {
        positions,
        lastPosition: newPosition,
      };
    },
    {
      positions: [{ head: defaultPosition, tail: defaultPosition }],
      lastPosition: null,
    } as {
      positions: Positions[];
      lastPosition: Positions | null;
    }
  );

const uniquePositions = new Set(
  positions.map(({ tail }) => JSON.stringify(tail))
);

console.log(uniquePositions.size);
