import type { SemiBoxedExpression } from "@cortex-js/compute-engine";
import { ComputeEngine } from "./computeEngine";
import { generate } from ".";
import { latexToDesmosLatex } from "./utils";

const ce = new ComputeEngine();
let iters = 100;

const desmosLatexes: string[] = [];

const server = Bun.serve({
  fetch(request) {
    const url = new URL(request.url);

    const index = parseInt(url.pathname.slice(1));

    if (isNaN(index)) {
      return new Response("Invalid index", { status: 400 });
    }

    if (index < 0 || index >= desmosLatexes.length) {
      return new Response("Index out of bounds", { status: 400 });
    }

    return new Response(null, {
      status: 307,
      headers: {
        location: `https://www.desmos.com/calculator?desmitosFetch=1&desmitosState=data:application/json;utf-8,${encodeURIComponent(
          JSON.stringify({
            version: 11,
            expressions: {
              list: [
                {
                  type: "expression",
                  id: "1",
                  latex: latexToDesmosLatex(desmosLatexes[index]),
                },
              ],
            },
          })
        )}`,
      },
    });
  },
});

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

      const desmosLatex = latexToDesmosLatex(box.latex);
      console.log("Desmos LaTeX (boxed):", desmosLatex);
      desmosLatexes.push(desmosLatex);

      console.log("Math JSON:", mathJson);

      try {
        console.log("Compiled:", box.compile()?.({}));
      } catch {}

      console.log(
        `Desmos URL:`,
        new URL("/" + (desmosLatexes.length - 1), server.url).href
      );
    }
  }

  console.write("> ");
}
