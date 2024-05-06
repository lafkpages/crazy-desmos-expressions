import { type SemiBoxedExpression } from "@cortex-js/compute-engine";
import { findGenerator } from "./generators";
import { latexToDesmosLatex, walkExpression } from "./utils";
import { ComputeEngine } from "./computeEngine";

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

const ce = new ComputeEngine();
let iters = 100;

console.write("> ");
for await (const line of console) {
  const n = parseFloat(line);

  if (isNaN(n)) {
    try {
      // TODO: eval is evil
      eval(line);
    } catch (e) {
      console.error(e);
    }
  } else {
    let mathJson: SemiBoxedExpression = [];

    try {
      mathJson = generate(n, iters);
    } catch (e) {
      console.error(e);
    }

    if (!Bun.deepEquals(mathJson, [])) {
      const box = ce.box(mathJson, { canonical: false });

      console.log("Desmos LaTeX (boxed):", latexToDesmosLatex(box.latex));
      //   console.log(
      //     "Desmos LaTeX (unboxed):",
      //     latexToDesmosLatex(ce.serialize(mathJson))
      //   );
      console.log("Math JSON:", mathJson);

      try {
        console.log("Compiled:", box.compile()?.({}));
      } catch {}
    }
  }

  console.write("> ");
}
