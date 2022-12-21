import fs from "fs";

type Dirs = Record<string, F>;

type File = { type: "file"; name: string; size: number };
type Directory = {
  type: "dir";
  name: string;
  files: F[];
  dirs: Dirs;
  parentDir: Directory | null;
};
type F = File | Directory;

type CommandAndOutput =
  | {
      type: "cd";
      dirName: string;
    }
  | {
      type: "ls";
      fs: F[];
    };

function parseCommandAndOutput(s: string): CommandAndOutput {
  if (s.startsWith("cd")) {
    const newDir = s.trim().split(" ")[1];
    return { type: "cd", dirName: newDir };
  } else {
    const fs = s.trim().split("\n").slice(1);
    return {
      type: "ls",
      fs: fs.map((s) => {
        const splits = s.split(" ");
        return s.startsWith("dir")
          ? {
              type: "dir",
              name: splits[1],
              files: [],
              dirs: {},
              parentDir: null,
            }
          : { type: "file", size: Number(splits[0]), name: splits[1] };
      }),
    };
  }
}

const rootDir: Directory = {
  type: "dir",
  name: "/",
  files: [],
  dirs: {},
  parentDir: null,
};

const result = fs
  .readFileSync(process.stdin.fd, "utf-8")
  .split("$ ") // split by commands
  .filter((s) => s)
  .map(parseCommandAndOutput)
  .reduce(
    (filesystem, commandAndOutput) => {
      if (commandAndOutput.type === "cd") {
        const dirName = commandAndOutput.dirName;
        filesystem.currentDirectory =
          filesystem.currentDirectory === null
            ? rootDir
            : dirName === ".."
            ? filesystem.currentDirectory.parentDir
            : (filesystem.currentDirectory.dirs[dirName] as Directory);
      } else {
        if (filesystem.currentDirectory === null) {
          throw new Error("unexpected listing of files in null directory");
        }
        for (const f of commandAndOutput.fs) {
          if (f.type === "dir") {
            filesystem.currentDirectory.dirs[f.name] = f;
          } else {
            filesystem.currentDirectory.files.push(f);
          }
        }
      }
      return filesystem;
    },
    {
      currentDirectory: null as Directory | null,
      dirs: { "/": rootDir } as Dirs,
    }
  );

console.log(JSON.stringify(result, null, 4));
