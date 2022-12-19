import fs from "fs";

type Crates = string[][];

interface Instruction {
  numCrates: number;
  fromStack: number;
  toStack: number;
}

function parseMove(s: string): Instruction {
  const r = s.match(/move (\d+) from (\d) to (\d)/);
  if (!r) {
    throw new Error("bad input");
  }
  const xs = r.slice(1).map((x) => Number(x));
  return {
    numCrates: xs[0],
    fromStack: xs[1],
    toStack: xs[2],
  };
}

function parseCrates(ss: string[], numStacks: number): Crates {
  let crates: string[][] = [];
  for (let i = 0; i < ss.length; i++) {
    const line = ss[i];
    for (let j = 0; j < numStacks; j++) {
      if (!crates[j]) {
        crates[j] = [];
      }
      const value = line[j * 4 + 1].trim();
      if (value) {
        crates[j].unshift(value);
      }
    }
  }
  return crates;
}

function moveCrates(
  crates: Crates,
  { numCrates, fromStack, toStack }: Instruction
): void {
  // Move crates between stacks in place
  const cratesToMove = crates[fromStack - 1].splice(
    crates[fromStack - 1].length - numCrates,
    numCrates
  );
  crates[toStack - 1].push(...cratesToMove.reverse());
}

function topCrates(crates: Crates): string {
  return crates.map((crate) => crate[crate.length - 1]).join("");
}

const input = fs.readFileSync(process.stdin.fd, "utf-8");
const lines = input.split("\n");

const [cols, rows] = lines
  .map((line, index) => [line.match(/   \d+/g), index])
  .filter(([matches, index]) => matches !== null)
  .map(([matches, index]) => [
    // @ts-expect-error
    parseInt(matches[matches.length - 1].trim()),
    index,
  ])[0] as [number, number];

const crates = parseCrates(lines.slice(0, rows), cols);

const instructionLines = lines.slice(rows + 2, -1);

const movedCrates = instructionLines
  .map(parseMove)
  .reduce((crates, instruction) => {
    moveCrates(crates, instruction);
    return crates;
  }, crates);

console.log(topCrates(movedCrates));
