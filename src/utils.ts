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

export function randomVarName(
  usedVars: Set<string>,
  subscript = false,
  autoSubscript = true,
  _i = 0
) {
  if (_i > 100) {
    if (!subscript && autoSubscript) {
      return randomVarName(usedVars, true, autoSubscript, 0);
    }
    throw new Error("randomVarName: too many iterations");
  }

  // random letter, either lowercase or uppercase
  const base = String.fromCharCode(
    (Math.random() < 0.5 ? 97 : 65) + Math.floor(Math.random() * 26)
  );

  if (base == "d" || base == "e" || base == "x") {
    return randomVarName(usedVars, subscript, autoSubscript, _i + 1);
  }

  const varName = subscript ? `${base}_{${anything(0, 9, 0)}}` : base;

  if (usedVars.has(varName)) {
    return randomVarName(usedVars, subscript, autoSubscript, _i + 1);
  }

  usedVars.add(varName);
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
