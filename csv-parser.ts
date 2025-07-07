import { parse as csvParse } from "csv-parse/sync";
import * as fs from "fs";
import { AnalysisResult, Growth, Parser } from "./parser";

class CsvParser extends Parser {
  analyze(): AnalysisResult {
    const fileContent = fs.readFileSync(this.filePath, "utf8");
    const data = csvParse(fileContent, {
      skip_records_with_empty_values: true,
      cast: (value) => {
        if (typeof value === "string" && value.startsWith("$")) {
          const num = parseFloat(value.slice(1).replace(/,/g, ""));
          return isNaN(num) ? value : num;
        }
        return value;
      },
    });

    const items: Array<{ name: string; values: number[] }> = [];

    // Extract data starting from row 2 skip the headers
    for (let i = 2; i < data.length; i++) {
      const row = data[i];
      if (!row?.[0]) continue;

      const name = row[0];
      const values = row
        .slice(1)
        .map((v: any) => (typeof v === "number" ? v : parseFloat(v) || 0));

      if (values.length > 0) items.push({ name, values });
    }

    return this.processItems(items, "CSV");
  }

  private processItems(
    items: Array<{ name: string; values: number[] }>,
    fileType: string
  ): AnalysisResult {
    const growthItems: Growth[] = [];

    items.forEach((item) => {
      const growth = this.findGrowth(item.name, item.values);
      if (growth) growthItems.push(growth);
    });

    const relationships = this.findRelationships(items);

    const businessAssumptions = this.findBusinessAssumptions(items);

    return {
      growthItems,
      relationships,
      businessAssumptions,
      fileType,
      summary: {
        totalItems: items.length,
        growthCount: growthItems.length,
        relationshipCount: relationships.length,
        assumptionCount: businessAssumptions.length,
      },
    };
  }
}

export { CsvParser };
