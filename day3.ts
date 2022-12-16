// @ts-expect-error
import Set from "core-js-pure/full/set";
import fs from "fs";

const priority = (letter: string): number =>
  letter.charCodeAt(0) - (letter.toUpperCase() === letter ? 38 : 96);

const commonLetters = (first: string, second: string): string[] =>
  Array.from(uniqueLetters(first).intersection(uniqueLetters(second)));

const uniqueLetters = (s: string): Set<string> => new Set(Array.from(s));

const result = fs
  .readFileSync(process.stdin.fd, "utf-8")
  .split("\n")
  .filter((s) => s)
  .flatMap((sack) => {
    const middleIndex = sack.length / 2;
    const first = sack.substring(0, middleIndex);
    const second = sack.substring(middleIndex, sack.length);
    return commonLetters(first, second).map(priority);
  })
  .reduce((a, b) => a + b, 0);

console.log(result);
