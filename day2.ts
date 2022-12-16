import fs from "fs";

type Move = "rock" | "paper" | "scissors";
type Code = "A" | "B" | "C" | "X" | "Y" | "Z";
type Outcome = "win" | "lose" | "draw";

const codeToMove: Record<Code, Move> = {
  A: "rock",
  X: "rock",
  B: "paper",
  Y: "paper",
  C: "scissors",
  Z: "scissors",
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

const movesToOutcome = (opponentMove: Move, yourMove: Move): Outcome =>
  opponentMove === yourMove
    ? "draw"
    : (opponentMove === "rock" && yourMove === "paper") ||
      (opponentMove === "paper" && yourMove === "scissors") ||
      (opponentMove === "scissors" && yourMove === "rock")
    ? "win"
    : "lose";

const totalScore = fs
  .readFileSync(process.stdin.fd, "utf-8")
  .split("\n")
  .slice(0, -1) // ignore newline at end
  .map(([opponentCode, _, yourCode]) => {
    const opponentMove = codeToMove[opponentCode as Code];
    const yourMove = codeToMove[yourCode as Code];
    const outcome = movesToOutcome(opponentMove, yourMove);
    return outcomeToPointValue[outcome] + moveToPointValue[yourMove];
  })
  .reduce((a, b) => a + b, 0);

console.log(totalScore);
