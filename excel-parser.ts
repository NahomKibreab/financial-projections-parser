import * as XLSX from "xlsx";
import { AnalysisResult, Growth, Parser } from "./parser";

class ExcelParser extends Parser {
  analyze(): AnalysisResult {
    const workbook = XLSX.readFile(this.filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");

    const items: Array<{ name: string; values: number[] }> = [];

    for (let row = 3; row <= range.e.r; row++) {
      const nameCell = worksheet[XLSX.utils.encode_cell({ r: row, c: 0 })];
      if (!nameCell?.v) {
        continue;
      }

      const name = nameCell.v.toString();
      const values: number[] = [];

      for (let col = 1; col <= range.e.c; col++) {
        const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: col })];

        if (cell?.v) {
          values.push(Number(cell.v) || 0);
        }
      }

      if (values.length > 0) {
        items.push({ name, values });
      }
    }

    return this.processItems(items, "Excel");
  }

  private processItems(
    items: Array<{ name: string; values: number[] }>,
    fileType: string
  ): AnalysisResult {
    const growthItems: Growth[] = [];

    items.forEach((item) => {
      const growth = this.findGrowth(item.name, item.values);

      if (growth) {
        growthItems.push(growth);
      }
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

export { ExcelParser };
