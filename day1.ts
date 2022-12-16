#!/usr/bin/env ts-node

import fs from "fs";

const result = fs
  .readFileSync(process.stdin.fd, "utf-8")
  .split("\n\n")
  .map((snacks) =>
    snacks
      .split("\n")
      .map((s) => Number(s))
      .reduce((total, x) => total + x, 0)
  )
  .sort((a, b) => b - a);

console.log(result[0]);
