import * as path from "path";
import { CsvParser } from "./csv-parser";
import { ExcelParser } from "./excel-parser";
import { Parser } from "./parser";

class ParserFactory {
  static create(filePath: string): Parser {
    const ext = path.extname(filePath).toLowerCase();

    if (ext === ".xlsx" || ext === ".xls") return new ExcelParser(filePath);
    if (ext === ".csv") return new CsvParser(filePath);

    throw new Error(`Unsupported file: ${ext}`);
  }
}

export { ParserFactory };
