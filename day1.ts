import fs from "fs";

const add = (a: number, b: number) => a + b;

const topCalorieElves = fs
  .readFileSync(process.stdin.fd, "utf-8")
  .split("\n\n")
  .map((snacks) =>
    snacks
      .split("\n")
      .map((s) => Number(s))
      .reduce(add, 0)
  )
  .sort((a, b) => b - a);

console.log(topCalorieElves.slice(0, 3).reduce(add, 0));
