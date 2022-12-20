import fs from "fs";

const n = 14;

const seqs = [...fs.readFileSync(process.stdin.fd, "utf-8").trim()].reduce(
  (charSeqs, _char, index, arr) => {
    if (index >= n - 1) {
      const seq = [...new Array(n).keys()].reverse().map((i) => arr[index - i]);
      return charSeqs.concat([seq]);
    }
    return charSeqs;
  },
  [] as string[][]
);

for (let i = 0; i < seqs.length; i++) {
  const seq = seqs[i];
  if (new Set(seq).size === seq.length) {
    console.log(i + seq.length);
    break;
  }
}
