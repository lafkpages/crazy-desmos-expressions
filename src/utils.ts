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

export function randomVarName(usedVars: Set<string>, subscript = true) {
  console.debug("randomVarName", usedVars.size);
  if (usedVars.size >= 50 * (subscript ? 10 : 1)) {
    throw new Error("Too many variables");
  }

  // random letter, either lowercase or uppercase
  const base = String.fromCharCode(
    (Math.random() < 0.5 ? 97 : 65) + Math.floor(Math.random() * 26)
  );

  if (base == "e" || base == "x") {
    return randomVarName(
      ...(arguments as unknown as Parameters<typeof randomVarName>)
    );
  }

  const varName = subscript ? `${base}_${anything(0, 9, 0)}` : base;

  if (usedVars.has(varName)) {
    return randomVarName(
      ...(arguments as unknown as Parameters<typeof randomVarName>)
    );
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
