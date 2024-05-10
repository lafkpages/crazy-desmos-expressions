import { type SemiBoxedExpression } from "@cortex-js/compute-engine";
import { findGenerator } from "./generators";
import { walkExpression } from "./utils";

import type { Generator } from "./generators";

export function generate(n: number, iters: number) {
  let expr: SemiBoxedExpression = n;

  const usedVars = new Set<string>();

  for (let iter = 0; iter < iters; iter++) {
    const replaceableParts: [number, number[], Generator][] = [];

    for (const [part, partPath] of walkExpression(expr)) {
      if (typeof part == "number") {
        const generator = findGenerator(part);

        if (generator) {
          replaceableParts.push([part, partPath, generator]);
        }
      }
    }

    if (replaceableParts.length) {
      const [part, partPath, generator] =
        replaceableParts[Math.floor(Math.random() * replaceableParts.length)];
      const newPart = generator.generate(part, usedVars);

      console.debug(iter, "Replacing", part, "with", newPart, "at", partPath);

      if (partPath.length) {
        if (newPart != part) {
          let newExpr: SemiBoxedExpression = expr;
          for (const i of partPath.slice(0, -1)) {
            newExpr = newExpr[i];
          }
          newExpr[partPath[partPath.length - 1]] = newPart;
        }
      } else {
        expr = newPart;
      }
    } else {
      break;
    }
  }

  return expr;
}
