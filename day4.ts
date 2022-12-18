import fs from "fs";

type Range = [number, number];
type RangePair = [Range, Range];

function parseLine(line: string): RangePair {
  return line
    .split(",")
    .map((s) => s.split("-").map((x) => parseInt(x, 10))) as RangePair;
}

function fullyContains([a1, a2]: Range, [b1, b2]: Range): boolean {
  return (a1 >= b1 && a2 <= b2) || (b1 >= a1 && b2 <= a2);
}

const result = fs
  .readFileSync(process.stdin.fd, "utf-8")
  .split("\n")
  .filter((s) => s)
  .map((line) => {
    const [rangeA, rangeB] = parseLine(line);
    return fullyContains(rangeA, rangeB) ? 1 : 0;
  })
  .reduce((a: number, b: number) => a + b, 0);

console.log(result);
