import type { SemiBoxedExpression } from "@cortex-js/compute-engine";
import { randomVarName, shuffle } from "./utils";
import { generate } from ".";

export interface Generator {
  accepts(expr: number): boolean;
  generate(expr: number, usedVars: Set<string>): SemiBoxedExpression;
}

export function anything(min = -100, max = 100, iters = 0) {
  const n = Math.floor(Math.random() * (max - min + 1)) + min;
  return generate(n, iters);
}

export const generators: Generator[] = [
  {
    accepts(expr) {
      return expr == 0 || expr == 1;
    },
    generate(expr) {
      if (expr == 0) {
        return ["Power", ...shuffle([0, ["Power", 0, 0]])];
      } else {
        return ["Power", 0, 0];
      }
    },
  },
  {
    accepts(expr) {
      return expr == 0;
    },
    generate() {
      return ["Divide", anything(), ["Log", 0]];
    },
  },
  {
    accepts(expr) {
      return expr == 0 || expr == 1;
    },
    generate(expr) {
      if (expr == 0) {
        return ["Log", 1];
      } else {
        const n = anything(1, 100, 0);
        return ["Log", n, n];
      }
    },
  },
  {
    accepts(expr) {
      return expr == 0 || expr == 1;
    },
    generate(expr) {
      if (expr == 0) {
        return ["Ln", 1];
      } else {
        return ["Ln", "ExponentialE"];
      }
    },
  },
  {
    accepts(expr) {
      return expr == 3;
    },
    generate() {
      return ["Floor", "Pi"];
    },
  },
  //   {
  //     accepts(expr) {
  //       return expr == 3;
  //     },
  //     generate() {
  //       return ["Ceil", "ExponentialE"];
  //     },
  //   },
  {
    accepts(expr) {
      return expr == 2;
    },
    generate() {
      return ["Floor", "ExponentialE"];
    },
  },
  //   {
  //     accepts(expr) {
  //       return expr == 4;
  //     },
  //     generate() {
  //       return ["Ceil", "Pi"];
  //     },
  //   },
  {
    accepts(expr) {
      return expr % 2 == 0;
    },
    generate(expr) {
      return ["Divide", 2 * expr, 2];
    },
  },
  {
    accepts(expr) {
      return expr % 2 == 0;
    },
    generate(expr) {
      return ["Multiply", ...shuffle([expr / 2, 2])];
    },
  },
  {
    accepts() {
      return true;
    },
    generate(expr, usedVars) {
      const varName = randomVarName(usedVars);
      return [
        "Sum",
        ["Multiply", ...shuffle([expr, varName])],
        ["Triple", varName, 1, 1],
      ];
    },
  },
  {
    accepts(expr) {
      return expr % 3 == 0;
    },
    generate(expr, usedVars) {
      const varName = randomVarName(usedVars);
      const useInts = Math.random() < 0.3;
      return [
        "Sum",
        ["Multiply", ...shuffle([expr / 3, varName])],
        ["Triple", varName, useInts ? 1 : "ExponentialE", useInts ? 2 : "Pi"],
      ];
    },
  },
  {
    accepts() {
      return true;
    },
    generate(expr, usedVars) {
      const varName = randomVarName(usedVars);
      return [
        "Integrate",
        ["Multiply", 2 * expr, varName],
        ["Triple", varName, 0, 1],
      ];
    },
  },
  {
    accepts() {
      return true;
    },
    generate(expr, usedVars) {
      const varName = randomVarName(usedVars);
      return [
        "Integrate",
        ["Multiply", expr, ["Abs", varName]],
        ["Triple", varName, -1, 1],
      ];
    },
  },
  {
    accepts(expr) {
      return expr == 0;
    },
    generate() {
      return ["Sin", 0];
    },
  },
  {
    accepts(expr) {
      return expr == 1;
    },
    generate() {
      return ["Cos", 0];
    },
  },
  {
    accepts(expr) {
      return expr == 0;
    },
    generate() {
      return ["Tan", 0];
    },
  },
  {
    accepts(expr) {
      return expr == 1;
    },
    generate() {
      return ["Tan", ["Divide", "Pi", 4]];
    },
  },
  {
    accepts(expr) {
      return expr % 3 == 0;
    },
    generate(expr) {
      const third = expr / 3;
      return ["Add", ...shuffle([["Multiply", 2, third], third])];
    },
  },
  {
    accepts(expr) {
      return expr % 4 == 0;
    },
    generate(expr) {
      const fourth = expr / 4;
      return ["Add", ...shuffle([["Multiply", 3, fourth], fourth])];
    },
  },
  {
    accepts(expr) {
      return expr == 1;
    },
    generate() {
      return "EmptySet";
    },
  },
];

export function findGenerator(expr: number) {
  for (const generator of shuffle(generators)) {
    if (generator.accepts(expr)) {
      return generator;
    }
  }

  return null;
}
