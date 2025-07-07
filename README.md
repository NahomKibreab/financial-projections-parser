# Financial Projections Parser

A simple algorithm that parses Excel-like financial projections to extract key business assumptions and relationships, enabling scenario analysis and budget modeling.

## Overview

This project solves the problem of extracting meaningful insights from financial spreadsheets. Instead of simply storing cell values, it analyzes the underlying patterns and relationships to create a compact, queryable model of the business logic.

## Key Features

- **Pattern Recognition**: Automatically detects growth rates, step changes, and calculation relationships
- **Assumption Extraction**: Identifies key business assumptions that drive the model
- **Scenario Analysis**: Enables "what-if" modeling by varying key assumptions
- **Format Flexibility**: Works with varying sheet formats without hardcoded positions

## Quick Start

### Installation

```bash
npm install
```

### Run the Demo

```bash
// for example npm start test.xlsx
npm start [fileName]
```

This will parse the provided financial projections example and show:

- Detected growth patterns
- Extracted assumptions
- Identified relationships
- Scenario analysis capabilities

### Example Output
```
=== FINANCIAL PROJECTIONS ANALYZER ===

GROWTH ANALYSIS

OVERVIEW:
 • File: Excel
 • Items: 8
 • Growth: 8
 • Relationships: 2
 • Business Assumptions: 3

GROWTH RATES & EXPECTED AMOUNTS:
 Product Sales: 4.0% monthly growth
 Current: $128,082.58 → Next Month: $133,205.883
 Service Sales: 5.0% monthly growth
 Current: $35,917.13 → Next Month: $37,712.986
 Total Sales: 4.2% monthly growth
 Current: $163,999.7 → Next Month: $170,901.802
 Cost of Goods Sold: 3.4% monthly growth
 Current: $89,657.8 → Next Month: $92,726.089
 Marketing: 8.3% monthly growth
 Current: $10,000 → Next Month: $10,833.333
 Staff salaries: 6.4% monthly growth
 Current: $40,999.93 → Next Month: $43,615.562
 Total Operating Expenses: 4.3% monthly growth
 Current: $140,657.73 → Next Month: $146,698.857
 Net Income: 4.0% monthly growth
 Current: $23,341.97 → Next Month: $24,284.811

RELATIONSHIPS:
 • Total Sales = Product Sales + Service Sales
 • Total Operating Expenses = Cost of Goods Sold + Marketing + Staff salaries

BUSINESS ASSUMPTIONS:
 • Product Sales: 4.0% monthly growth
 • Service Sales: 5.0% monthly growth
 • Marketing: 2x increase in month 8


WHAT IF ANALYSIS:

 Item: Product Sales
 Current Rate: 4.0% per month
 New Rate: 1.0% per month
 Impact: 📉 Lower growth expected

PROJECTED VALUES (Next 3 months):
   Month 1: $133,205.9 → $129,363.4
   Month 2: $138,534.1 → $130,657
   Month 3: $144,075.5 → $131,963.6

💰 Total Impact: $-12,111.9 after 3 months


WHAT IF ANALYSIS:

 Item: Service Sales
 Current Rate: 5.0% per month
 New Rate: 8.0% per month
 Impact: 📈 lHigher growth expected

PROJECTED VALUES (Next 6 months):
   Month 1: $37,713 → $38,790.5
   Month 2: $39,598.6 → $41,893.7
   Month 3: $41,578.6 → $45,245.2
   Month 4: $43,657.5 → $48,864.9
   Month 5: $45,840.4 → $52,774
   Month 6: $48,132.4 → $56,996

💰 Total Impact: +$8,863.6 after 6 months


WHAT IF ANALYSIS:

 Item: Marketing
 Current Rate: 8.3% per month
 New Rate: 5.0% per month
 Impact: 📉 Lower growth expected

PROJECTED VALUES (Next 12 months):
   Month 1: $10,833.3 → $10,500
   Month 2: $11,736.1 → $11,025
   Month 3: $12,714.1 → $11,576.3
   Month 4: $13,773.6 → $12,155.1
   Month 5: $14,921.4 → $12,762.8
   Month 6: $16,164.9 → $13,401
   Month 7: $17,512 → $14,071
   Month 8: $18,971.3 → $14,774.6
   Month 9: $20,552.2 → $15,513.3
   Month 10: $22,264.9 → $16,288.9
   Month 11: $24,120.3 → $17,103.4
   Month 12: $26,130.4 → $17,958.6

💰 Total Impact: $-8,171.8 after 12 months
```
