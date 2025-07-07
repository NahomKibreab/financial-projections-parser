export interface Growth {
  item: string;
  rate: number;
  consistent: boolean;
}

export interface Relationship {
  total: string;
  parts: string[];
}

export enum BusinessPattern {
  SALES_GROWTH = "SALES_GROWTH",
  CONSISTENT_GROWTH = "CONSISTENT_GROWTH",
  EXPENSE_CHANGE = "EXPENSE_CHANGE",
}

export interface BusinessAssumption {
  item: string;
  pattern: BusinessPattern;
  description: string;
}

export interface AnalysisResult {
  growthItems: Growth[];
  relationships: Relationship[];
  businessAssumptions: BusinessAssumption[];
  fileType: string;
  summary: {
    totalItems: number;
    growthCount: number;
    relationshipCount: number;
    assumptionCount: number;
  };
}

abstract class Parser {
  protected filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  abstract analyze(): AnalysisResult;

  // Growth detection
  protected findGrowth(itemName: string, values: number[]): Growth | null {
    if (values.length < 3) return null; // Need at least 3 values to start analysis

    const rates: number[] = [];
    for (let i = 1; i < values.length; i++) {
      if (values[i - 1] > 0) {
        // This formula (b - a) / a represents the relative change or
        // percentage change between two values, 'a' and 'b'.
        rates.push((values[i] - values[i - 1]) / values[i - 1]);
      }
    }

    if (rates.length === 0) return null;

    const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length;

    // Only care about significant growth (>1%)
    if (Math.abs(avgRate) < 0.01) return null;

    // Check consistency (all rates within 5% of average)
    const consistent = rates.every((rate) => Math.abs(rate - avgRate) < 0.05);

    return {
      item: itemName,
      rate: avgRate,
      consistent,
    };
  }

  // Relationship detection
  protected findRelationships(
    items: Array<{ name: string; values: number[] }>
  ): Relationship[] {
    const relationships: Relationship[] = [];

    items.forEach((item) => {
      const name = item.name.toLowerCase();

      // Total Sales relationship
      if (name.includes("total") && name.includes("sales")) {
        const salesParts = items
          .filter(
            (i) =>
              i.name.toLowerCase().includes("sales") &&
              !i.name.toLowerCase().includes("total")
          )
          .map((i) => i.name);

        if (salesParts.length > 0) {
          relationships.push({
            total: item.name,
            parts: salesParts,
          });
        }
      }

      // Total Expenses relationship
      if (
        name.includes("total") &&
        (name.includes("expense") || name.includes("operating"))
      ) {
        const expenseParts = items
          .filter((i) => {
            const iName = i.name.toLowerCase();
            return (
              (iName.includes("cost") ||
                iName.includes("marketing") ||
                iName.includes("salaries") ||
                iName.includes("expense")) &&
              !iName.includes("total")
            );
          })
          .map((i) => i.name);

        if (expenseParts.length > 0) {
          relationships.push({
            total: item.name,
            parts: expenseParts,
          });
        }
      }
    });

    return relationships;
  }

  // Detect business assumptions/patterns
  protected findBusinessAssumptions(
    items: Array<{ name: string; values: number[] }>
  ): BusinessAssumption[] {
    const assumptions: BusinessAssumption[] = [];

    items.forEach((item) => {
      const name = item.name.toLowerCase();
      const values = item.values;

      // Marketing expense changes
      if (name.includes("marketing")) {
        const changes = [];
        for (let i = 1; i < values.length; i++) {
          if (values[i] !== values[i - 1]) {
            changes.push({ period: i, from: values[i - 1], to: values[i] });
          }
        }

        if (changes.length > 0) {
          const change = changes[0];
          const multiplier = change.to / change.from;
          assumptions.push({
            item: item.name,
            pattern: BusinessPattern.EXPENSE_CHANGE,
            description: `${multiplier}x increase in month ${
              change.period + 1
            }`,
          });
        }
      }

      // Salary increases
      if (name.includes("salaries")) {
        const growth = this.findGrowth(item.name, values);
        if (growth && growth.consistent) {
          assumptions.push({
            item: item.name,
            pattern: BusinessPattern.CONSISTENT_GROWTH,
            description: `${(growth.rate * 100).toFixed(1)}% monthly growth`,
          });
        }
      }

      // Sales growth patterns
      if (name.includes("sales") && !name.includes("total")) {
        const growth = this.findGrowth(item.name, values);
        if (growth && growth.consistent) {
          assumptions.push({
            item: item.name,
            pattern: BusinessPattern.SALES_GROWTH,
            description: `${(growth.rate * 100).toFixed(1)}% monthly growth`,
          });
        }
      }
    });

    return assumptions;
  }
}

export { Parser };
