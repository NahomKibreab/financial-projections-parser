import { GrowthAnalyzer } from "./growth-analyzer";

console.log("=== FINANCIAL PROJECTIONS ANALYZER ===\n");

try {
  const analyzer = new GrowthAnalyzer(process.argv[2]);
  console.log(analyzer.summary());

  // Demonstrate "what if" scenario analysis - core project requirement
  console.log(analyzer.whatIf("Product Sales", 0.01, 3)); // 1% instead of 4% over 3 months
  console.log("\n");
  console.log(analyzer.whatIf("Service Sales", 0.08, 6)); // 8% instead of 5% over 6 months
  console.log("\n");
  console.log(analyzer.whatIf("Marketing", 0.05, 12)); // 5% instead of 8.3% over 12 months
} catch (error) {
  console.error(
    "Error:",
    error instanceof Error ? error.message : String(error)
  );
}
