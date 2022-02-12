import type { Arg } from "../type/index.type";

export function str2args(str: string): Arg[] {
  const argsStr = str.split(" ");
  const args = argsStr.map(destructArgString);

  return args;
}

export function destructArgString(str = ""): Arg {
  const [lawName, query] = separateString(str, /[\d~,]+$/);
  console.log("🚀 ~ destructArgString ~ [lawName, query]", [lawName, query]);
  // 前面沒零的整數
  const a = "[1-9][0-9]*";
  // 第 x-x 條 or 第 x 條
  const b = `(?:${a}-${a}|${a})`;
  // 條~條 or 條~ or ~條 or 條
  const c = `(?:${b}~${b}|~${b}|${b}~|${b})`;
  const regex = new RegExp(`^(${c}(?:,${c})*)$`);
  if (regex.test(query)) {
    const options = query.split(",").map((q) => {
      // find range
      let start: string;
      let end: string;

      if (new RegExp(`${b}~${b}`).test(q)) {
        [start, end] = q.split("~");
      } else if (new RegExp(`~${b}`).test(q)) {
        end = q.substring(1);
      } else if (new RegExp(`${b}~`).test(q)) {
        start = q.substring(0, q.length - 1);
      } else {
        // search spec no
        return q;
      }
      return [start, end];
    });

    return {
      lawName,
      options,
    };
  } else {
    return {
      lawName,
      options: [null],
    };
  }
}

export function separateString(str: string, regex: RegExp): [string, string] {
  const target = str.search(regex);
  if (target === -1) {
    return [str, ""];
  }
  return [str.substring(0, target), str.substring(target)];
}
