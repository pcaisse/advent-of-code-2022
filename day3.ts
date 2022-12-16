// @ts-expect-error
import Set from "core-js-pure/full/set";
import fs from "fs";

const priority = (letter: string): number =>
  letter.charCodeAt(0) - (letter.toUpperCase() === letter ? 38 : 96);

const commonLetters = (sacks: string[]): string[] =>
  Array.from(
    sacks
      .slice(1)
      .reduce(
        (acc, sack) => acc.intersection(uniqueLetters(sack)),
        uniqueLetters(sacks[0])
      )
  );

const uniqueLetters = (s: string): Set<string> => new Set(Array.from(s));

const result = fs
  .readFileSync(process.stdin.fd, "utf-8")
  .split("\n")
  .filter((s) => s)
  .reduce((groups: string[][], sack: string, index) => {
    const groupIndex = Math.floor(index / 3);
    if (!groups[groupIndex]) groups[groupIndex] = [];
    groups[groupIndex].push(sack);
    return groups;
  }, [] as string[][])
  .flatMap((elfSacks) => {
    return commonLetters(elfSacks).map(priority);
  })
  .reduce((a, b) => a + b, 0);

console.log(result);
