import fs from "fs";

// Paper beats rock beats scissors beats paper...
const movesInOrder = ["paper", "rock", "scissors"] as const;

type Move = typeof movesInOrder[number];
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

const chooseMove = (opponentMove: Move, desiredOutcome: Outcome): Move => {
  const opponentMoveIndex = movesInOrder.indexOf(opponentMove);
  const winningMove =
    movesInOrder[opponentMoveIndex - 1] ??
    movesInOrder[movesInOrder.length - 1];
  const losingMove = movesInOrder[opponentMoveIndex + 1] ?? movesInOrder[0];
  return desiredOutcome === "draw"
    ? opponentMove
    : desiredOutcome === "win"
    ? winningMove
    : losingMove;
};

const totalScore = fs
  .readFileSync(process.stdin.fd, "utf-8")
  .split("\n")
  .slice(0, -1) // ignore newline at end
  .map(([opponentCode, _, yourCode]) => {
    const opponentMove = opponentCodeToMove[opponentCode as OpponentCode];
    const yourDesiredOutcome = yourCodeToDesiredOutcome[yourCode as YourCode];
    const yourMove = chooseMove(opponentMove, yourDesiredOutcome);
    return outcomeToPointValue[yourDesiredOutcome] + moveToPointValue[yourMove];
  })
  .reduce((a, b) => a + b, 0);

console.log(totalScore);
