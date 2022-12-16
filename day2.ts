import fs from "fs";

const winningMoves: Record<Move, Move> = {
  paper: "scissors",
  rock: "paper",
  scissors: "rock",
};
const losingMoves = Object.fromEntries(
  // losing is the opposite of winning
  Object.entries(winningMoves).map(([key, value]) => [value, key])
) as Record<Move, Move>;

type Move = "paper" | "rock" | "scissors";
type OpponentCode = "A" | "B" | "C";
type YourCode = "X" | "Y" | "Z";
type Outcome = "win" | "lose" | "draw";

const opponentCodeToMove: Record<OpponentCode, Move> = {
  A: "rock",
  B: "paper",
  C: "scissors",
};

const yourCodeToDesiredOutcome: Record<YourCode, Outcome> = {
  X: "lose",
  Y: "draw",
  Z: "win",
};

const moveToPointValue: Record<Move, number> = {
  rock: 1,
  paper: 2,
  scissors: 3,
};

const outcomeToPointValue: Record<Outcome, number> = {
  win: 6,
  draw: 3,
  lose: 0,
};

const totalScore = fs
  .readFileSync(process.stdin.fd, "utf-8")
  .split("\n")
  .slice(0, -1) // ignore newline at end
  .map(([opponentCode, _, yourCode]) => {
    const opponentMove = opponentCodeToMove[opponentCode as OpponentCode];
    const yourDesiredOutcome = yourCodeToDesiredOutcome[yourCode as YourCode];
    const yourMove =
      yourDesiredOutcome === "draw"
        ? opponentMove
        : yourDesiredOutcome === "win"
        ? winningMoves[opponentMove]
        : losingMoves[opponentMove];
    return outcomeToPointValue[yourDesiredOutcome] + moveToPointValue[yourMove];
  })
  .reduce((a, b) => a + b, 0);

console.log(totalScore);
