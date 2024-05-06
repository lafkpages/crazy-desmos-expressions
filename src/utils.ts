import type { SemiBoxedExpression } from "@cortex-js/compute-engine";
import { anything } from "./generators";

export function shuffle<T extends any[]>(array: T): T {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}

export function randomVarName(subscript = false, autoSubscript = true, _i = 0) {
  if (_i > 100) {
    if (!subscript && autoSubscript) {
      return randomVarName(true, autoSubscript, 0);
    }
    throw new Error("randomVarName: too many iterations");
  }

  // random letter, either lowercase or uppercase
  const base = String.fromCharCode(
    (Math.random() < 0.5 ? 97 : 65) + Math.floor(Math.random() * 26)
  );

  if (base == "d" || base == "e" || base == "x") {
    return randomVarName(subscript, autoSubscript, _i + 1);
  }

  const varName = subscript ? `${base}_{${anything(0, 9, 0)}}` : base;
  return varName;
}

export function* walkExpression(
  expr: SemiBoxedExpression,
  _i: number[] = []
): globalThis.Generator<[SemiBoxedExpression, number[]]> {
  if (Array.isArray(expr)) {
    for (let i = 0; i < expr.length; i++) {
      yield* walkExpression(expr[i], [..._i, i]);
    }
  } else {
    yield [expr, _i];
  }
}

// TODO: import from Desmitos shared?
export function latexToDesmosLatex(latex: string | String) {
  return latex
    .replace(/\(/g, "\\left(")
    .replace(/\)/g, "\\right)")
    .replace(/\\bot/g, "1\\lt0")
    .replace(/\\top/g, "1\\gt0")
    .replace(/\\exponentialE/g, " e")
    .replace(/\\l(floor|ceil)/g, "\\operatorname{$1}\\left(")
    .replace(/\\r(floor|ceil)/g, "\\right)")
    .replace(/\\,/g, "");
}
