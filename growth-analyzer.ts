import * as fs from "fs";
import { AnalysisResult, Parser } from "./parser";
import { ParserFactory } from "./parser-factory";

class GrowthAnalyzer {
  private parser: Parser;

  constructor(filePath: string) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    this.parser = ParserFactory.create(filePath);
  }

  analyze(): AnalysisResult {
    return this.parser.analyze();
  }

  whatIf(itemName: string, newGrowthRate: number, months: number = 3): string {
    const result = this.analyze();

    // Find the item
    const item = result.growthItems.find((g) =>
      g.item.toLowerCase().includes(itemName.toLowerCase())
    );

    if (!item) {
      return `Item "${itemName}" not found in growth analysis`;
    }

    // Get the last known value for this item
    const lastValue = this.getLastValue(item.item);

    const currentRate = (item.rate * 100).toFixed(1);
    const newRate = (newGrowthRate * 100).toFixed(1);
    const impact = newGrowthRate > item.rate ? "📈 lHigher" : "📉 Lower";

    // Calculate projections
    const currentProjections = this.calculateProjections(
      lastValue,
      item.rate,
      months
    );
    const newProjections = this.calculateProjections(
      lastValue,
      newGrowthRate,
      months
    );

    let output = `WHAT IF ANALYSIS:\n\n`;
    output += ` Item: ${item.item}\n`;
    output += ` Current Rate: ${currentRate}% per month\n`;
    output += ` New Rate: ${newRate}% per month\n`;
    output += ` Impact: ${impact} growth expected\n\n`;

    output += `PROJECTED VALUES (Next ${months} months):\n`;
    for (let i = 0; i < months; i++) {
      output += `   Month ${i + 1}: $${currentProjections[
        i
      ].toLocaleString()} → $${newProjections[i].toLocaleString()}\n`;
    }

    const totalDifference =
      newProjections[months - 1] - currentProjections[months - 1];
    const diffSign = totalDifference > 0 ? "+" : "";
    output += `\n💰 Total Impact: ${diffSign}$${totalDifference.toLocaleString()} after ${months} months`;

    return output;
  }

  // Helper method to get last known value for an item
  // for proof-of-concept we're using hardcoded values
  private getLastValue(itemName: string): number {
    const name = itemName.toLowerCase();

    if (name.includes("product sales")) return 128082.58;
    if (name.includes("service sales")) return 35917.13;
    if (name.includes("total sales")) return 163999.7;
    if (name.includes("cost of goods sold")) return 89657.8;
    if (name.includes("marketing")) return 10000;
    if (name.includes("staff")) return 40999.93;
    if (name.includes("total operating expenses")) return 140657.73;
    if (name.includes("net income")) return 23341.97;

    return 50000; // Default fallback
  }

  // Calculate future projections based on growth rate
  private calculateProjections(
    baseValue: number,
    growthRate: number,
    months: number
  ): number[] {
    const projections: number[] = [];
    let currentValue = baseValue;

    for (let i = 0; i < months; i++) {
      currentValue = currentValue * (1 + growthRate);
      projections.push(parseFloat(currentValue.toFixed(1)));
    }

    return projections;
  }

  // Clean summary output
  summary(): string {
    const result = this.analyze();

    let output = `GROWTH ANALYSIS\n\n`;

    // Overview
    output += `OVERVIEW:\n`;
    output += ` • File: ${result.fileType}\n`;
    output += ` • Items: ${result.summary.totalItems}\n`;
    output += ` • Growth: ${result.summary.growthCount}\n`;
    output += ` • Relationships: ${result.summary.relationshipCount}\n`;
    output += ` • Business Assumptions: ${result.summary.assumptionCount}\n\n`;

    // Growth items with expected amounts
    if (result.growthItems.length > 0) {
      output += `GROWTH RATES & EXPECTED AMOUNTS:\n`;
      result.growthItems.forEach((growth) => {
        const rate = (growth.rate * 100).toFixed(1);
        const lastValue = this.getLastValue(growth.item);
        const nextValue = lastValue * (1 + growth.rate);
        output += ` ${growth.item}: ${rate}% monthly growth\n`;
        output += ` Current: $${lastValue.toLocaleString()} → Next Month: $${nextValue.toLocaleString()}\n`;
      });
      output += "\n";
    }

    // Relationships
    if (result.relationships.length > 0) {
      output += `RELATIONSHIPS:\n`;
      result.relationships.forEach((rel) => {
        output += ` • ${rel.total} = ${rel.parts.join(" + ")}\n`;
      });
      output += "\n";
    }

    // Business Assumptions
    if (result.businessAssumptions.length > 0) {
      output += `BUSINESS ASSUMPTIONS:\n`;
      result.businessAssumptions.forEach((assumption) => {
        output += ` • ${assumption.item}: ${assumption.description}\n`;
      });
      output += "\n";
    }

    return output;
  }
}

export { GrowthAnalyzer };
