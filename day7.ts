import fs from "fs";

type Dirs = Record<string, Directory>;

type File = { type: "file"; name: string; size: number };
type Directory = {
  type: "dir";
  name: string;
  files: File[];
  dirs: Dirs;
  parentDir: Directory | null;
  absPath: string | null;
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
              absPath: null,
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
  absPath: null,
};

const sumFileSizes = (
  filesystem: Dirs,
  directorySizes: Record<string, number>,
  parentAbsPaths: string[]
): typeof directorySizes => {
  Object.entries(filesystem).forEach(([_dirName, dir]) => {
    if (!dir.absPath) {
      throw new Error("absolute path is missing");
    }
    const dirSize = dir.files.reduce(
      (total: number, f: File) => total + f.size,
      0
    );
    directorySizes[dir.absPath] = dirSize;
    parentAbsPaths.forEach((parentAbsPath) => {
      directorySizes[parentAbsPath] += dirSize;
    });
    if (Object.keys(dir.dirs).length) {
      sumFileSizes(dir.dirs, directorySizes, [...parentAbsPaths, dir.absPath]);
    }
  });
  return directorySizes;
};

const filesystem = fs
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
            f.parentDir = filesystem.currentDirectory;
            filesystem.currentDirectory.dirs[f.name] = f;
          } else {
            filesystem.currentDirectory.files.push(f);
          }
        }
        filesystem.currentDirectory.absPath =
          filesystem.currentDirectory.parentDir &&
          filesystem.currentDirectory.parentDir.absPath
            ? filesystem.currentDirectory.parentDir.absPath +
              (filesystem.currentDirectory.parentDir.absPath === "/"
                ? ""
                : "/") +
              filesystem.currentDirectory.name
            : filesystem.currentDirectory.name;
      }
      return filesystem;
    },
    {
      currentDirectory: null as Directory | null,
      dirs: { "/": rootDir } as Dirs,
    }
  );

const fileSizeLimit = 100000;

const fileSizes = sumFileSizes(filesystem.dirs, {}, []);

const result = Object.entries(fileSizes)
  .map(([name, size]) => ({
    name,
    size,
  }))
  .filter(({ size }) => size <= fileSizeLimit)
  .reduce((a, b) => a + b.size, 0);

console.log(result);
