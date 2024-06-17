import { ComputeEngine as DefaultComputeEngine } from "@cortex-js/compute-engine";

export class ComputeEngine extends DefaultComputeEngine {
  constructor(...args: ConstructorParameters<typeof DefaultComputeEngine>) {
    super(...args);

    for (let i = 0; i < this.latexDictionary.length; i++) {
      const entry = this.latexDictionary[i];

      if (entry.name === "Abs" && "openTrigger" in entry) {
        entry.openTrigger = ["\\left|"];
        entry.closeTrigger = ["\\right|"];
      }
    }

    this.latexOptions.fractionStyle = () => "quotient";
  }
}
