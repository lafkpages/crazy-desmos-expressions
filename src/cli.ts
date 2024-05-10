import type { SemiBoxedExpression } from "@cortex-js/compute-engine";
import { ComputeEngine } from "./computeEngine";
import { generate } from ".";
import { latexToDesmosLatex } from "./utils";

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
