import fs from "fs";

const seqs = [...fs.readFileSync(process.stdin.fd, "utf-8").trim()].reduce(
  (charSeqs, _char, index, arr) => {
    const seq = [arr[index - 3], arr[index - 2], arr[index - 1], arr[index]];
    if (seq.every((val) => val !== undefined)) {
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
