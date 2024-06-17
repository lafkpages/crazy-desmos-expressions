import { ComputeEngine as DefaultComputeEngine } from "@cortex-js/compute-engine";

export class ComputeEngine extends DefaultComputeEngine {
  constructor(...args: ConstructorParameters<typeof DefaultComputeEngine>) {
    super(...args);

    this.latexDictionary = [
      ...this.latexDictionary,
      {
        name: "Absolute",
        kind: "matchfix",
        openTrigger: ["\\left|"],
        closeTrigger: ["\\right|"],
        serialize(serializer, expr) {
          return `\\left|${serializer.serialize(expr[1])}\\right|`;
        },
      },
      {
        name: "Integral",
        kind: "expression",
        latexTrigger: "\\int",
        parse: "Integrate",
        serialize(serializer, expr) {
          return `\\int_{${serializer.serialize(
            expr[1]
          )}}^{${serializer.serialize(expr[2])}}${serializer.serialize(
            expr[4]
          )}d${serializer.serialize(expr[3])}`;
        },
      },
    ];

    this.latexOptions.fractionStyle = () => "quotient";
  }
}
