# VASPTrace — PROJECT.md v2.0

## 1. Project Overview

**Project Name:** VASPTrace

**Problem Statement:**
Automated Attribution of Unknown Cryptocurrency Wallets to Nearest Virtual Asset Service Providers (VASPs) through Blockchain Intelligence APIs

**Version:** 2.0

**Status:** Development Planning

**Primary Blockchain:** Bitcoin

**Primary Objective:**

VASPTrace is an explainable blockchain investigation dashboard that analyzes an unknown Bitcoin address, discovers related addresses using Bitcoin transaction/UTXO heuristics, identifies connections to known VASP-labelled addresses, and ranks candidate VASPs using an evidence-based attribution score.

The system is intended to assist investigators in understanding cryptocurrency transaction relationships. It does **not** claim to establish legal ownership or definitive identity.

---

# 2. Core Value

> **VASPTrace transforms an unknown Bitcoin wallet into an explainable investigation graph by identifying candidate common-control address clusters, connecting those clusters to known VASP-labelled addresses, ranking candidate VASPs using multiple evidence signals, and presenting the supporting blockchain evidence and confidence level.**

The core principle is:

```text
Unknown Bitcoin Address
        ↓
Transaction / UTXO Data
        ↓
Address Clustering
        ↓
VASP Relationship Discovery
        ↓
Evidence Scoring
        ↓
Ranked VASP Candidates
        ↓
Interactive Investigation Graph
```

---

# 3. Product Goal

The MVP must allow an investigator to:

1. Enter a Bitcoin address.
2. Retrieve its available blockchain transaction history.
3. Analyze transaction inputs and outputs.
4. Identify candidate address clusters using common-input heuristics.
5. Compare discovered addresses against a provenance-aware VASP address dataset.
6. Discover transaction paths/relationships between the investigated cluster and VASP-labelled addresses.
7. Rank candidate VASPs.
8. Display the evidence and confidence behind the ranking.
9. Explore the relationships through an interactive graph.
10. Generate a concise investigation report.

---

# 4. Important Attribution Principle

VASPTrace performs **probabilistic blockchain attribution**.

The system must distinguish between:

```text
Blockchain Evidence
        ↓
Heuristic Relationship
        ↓
Likely Association
```

and:

```text
Blockchain Evidence
        ↓
Legal / Definitive Ownership
```

The second conclusion is **out of scope**.

Therefore the application should use language such as:

* "Likely associated with"
* "Candidate VASP"
* "Evidence suggests"
* "Attribution confidence"
* "Insufficient evidence"

It must not present a heuristic result as definitive legal ownership.

---

# 5. Scope

## 5.1 In Scope

### Blockchain

* Bitcoin mainnet
* Bitcoin UTXO model
* Bitcoin addresses
* Bitcoin transactions
* Transaction inputs
* Transaction outputs
* UTXOs
* Address relationships

### Analysis

* Common-input heuristic clustering
* Transaction graph construction
* N-hop relationship discovery
* Candidate VASP identification
* Evidence scoring
* Confidence classification
* Transaction-path analysis
* Basic change-address heuristics as an advanced feature

### Data Sources

* Public/free blockchain APIs
* Publicly available VASP-labelled Bitcoin address datasets
* Investigator-provided datasets where appropriate

### Application

* Web dashboard
* Address investigation
* Interactive graph
* Transaction details
* Cluster details
* VASP candidate ranking
* Evidence report

---

# 6. Out of Scope

The following are explicitly excluded from v1:

* Ethereum
* EVM-compatible chains
* Solana
* Other non-Bitcoin blockchains
* Paid intelligence APIs such as Chainalysis, TRM Labs or Elliptic
* Real-time transaction monitoring
* Live AML monitoring
* Guaranteed wallet ownership identification
* KYC database integration
* Personal identity discovery
* Deanonymization of individuals
* Legal determination of ownership
* Cryptocurrency mixing/tumbler identification as a primary feature
* Automated law-enforcement actions
* Automated freezing/seizure recommendations

---

# 7. Target Users

## Primary User

### Blockchain / Cybercrime Investigator

The investigator enters an unknown Bitcoin address and wants to understand:

* Who/what it may be associated with
* Which known VASPs are nearby in the transaction network
* How strong the evidence is
* Which addresses form a likely cluster
* Which transactions support the conclusion

## Secondary Users

* Financial crime analysts
* Cryptocurrency compliance researchers
* Cybersecurity investigators
* Academic blockchain researchers

---

# 8. High-Level Architecture

```text
                         USER
                          │
                          ↓
                  Next.js Dashboard
                          │
                          ↓
                    REST API
                          │
                          ↓
                Node.js / TypeScript
                          │
          ┌───────────────┼────────────────┐
          │               │                │
          ↓               ↓                ↓
 Blockchain          Clustering         VASP
 Data Provider        Engine             Database
          │               │                │
          └───────────────┼────────────────┘
                          ↓
                    Graph Engine
                          │
                          ↓
                Attribution Engine
                          │
                          ↓
                  Evidence Scoring
                          │
                          ↓
                  Investigation Report
```

---

# 9. Technology Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* React Flow

## Backend

* Node.js
* TypeScript
* REST API

## Database

Preferred:

* PostgreSQL

Optional for early prototype:

* SQLite

## Data Processing

* TypeScript for core MVP processing
* Python may be introduced later if statistical/ML analysis becomes necessary

## Visualization

* React Flow
* Charting library as required

## External Data

Potential blockchain data providers:

* Mempool.space
* Blockchair
* Other public/free Bitcoin APIs as appropriate

The implementation must use a provider abstraction rather than tightly coupling the application to one API.

---

# 10. System Components

## 10.1 Address Investigation Service

Responsible for:

* validating Bitcoin addresses
* starting investigations
* retrieving transaction history
* creating investigation records

Input:

```text
Bitcoin address
```

Output:

```text
Investigation ID
```

---

## 10.2 Blockchain Data Provider

Provides normalized blockchain information.

Required normalized data:

```text
Transaction
├── txid
├── blockHeight
├── timestamp
├── inputs[]
└── outputs[]
```

Input:

```text
Bitcoin address / transaction ID
```

Output:

```text
Normalized blockchain data
```

The provider layer should hide API-specific response formats.

---

## 10.3 Data Cache

Blockchain data retrieved from public APIs should be cached.

Purpose:

* reduce API calls
* improve response time
* handle repeated investigations
* reduce dependence on external API availability

Conceptual flow:

```text
Request
   ↓
Cache
   │
   ├── Data exists → Return cached data
   │
   └── Data missing
           ↓
       External API
           ↓
       Store result
           ↓
       Return result
```

---

# 11. Bitcoin Data Model

## Transaction

```text
Transaction
- txid
- blockHeight
- timestamp
- inputs
- outputs
```

## Input

```text
Input
- transactionId
- previousTxid
- previousOutputIndex
- address
- value
```

## Output

```text
Output
- transactionId
- outputIndex
- address
- value
- spent
```

## Address

```text
Address
- address
- addressType
- firstSeen
- lastSeen
```

---

# 12. Common-Input Clustering

## 12.1 Purpose

Identify addresses that are **likely controlled by the same entity** based on their joint use as transaction inputs.

Example:

```text
Transaction T1

Inputs:
A
B
C

        ↓

Common-input heuristic

        ↓

Candidate Cluster

A ─── B ─── C
```

## 12.2 Rule

For a standard transaction:

```text
Input A + Input B + Input C
```

create candidate relationships:

```text
A ↔ B
A ↔ C
B ↔ C
```

These relationships contribute to a candidate cluster.

---

# 13. Clustering Requirements

The clustering engine must:

* identify transactions containing multiple input addresses
* generate candidate common-control relationships
* construct clusters
* avoid duplicating relationships
* record supporting transactions
* calculate cluster size
* preserve evidence for every cluster relationship

Example:

```text
Cluster #12

Addresses:
A
B
C
D

Supporting Transactions:
TX001
TX013
TX017

Heuristic:
Common-input

Confidence:
High / Medium / Low
```

---

# 14. Clustering Limitations

Common-input clustering is a heuristic.

The system must account for the possibility that a multi-input transaction does not necessarily imply common ownership/control.

Therefore:

```text
Common Input
      ↓
Candidate Relationship
```

not:

```text
Common Input
      ↓
Guaranteed Ownership
```

The UI should communicate this limitation.

---

# 15. Advanced Clustering — Change Address

Optional Phase 2 feature.

A transaction can have:

```text
Inputs:
A + B

Outputs:
C
D
```

One output may represent payment to a recipient while another may represent change returning to the sender.

The system may use additional heuristics to identify probable change addresses.

This feature is **not required for MVP completion**.

---

# 16. VASP Address Database

The VASP database is a core dependency.

Each known address should contain:

```text
VASP Address
├── address
├── VASP name
├── source
├── source URL/reference
├── evidence type
├── confidence
├── date added
└── last verified
```

Example:

```text
Address:
bc1q...

VASP:
Example VASP

Source:
Public attribution dataset

Evidence:
Known exchange address

Confidence:
High
```

---

# 17. VASP Data Provenance

Every VASP-labelled address must have a recorded source wherever possible.

The system should not treat an internally entered label as unquestionable truth.

The database should support:

```text
Address
   ↓
VASP
   ↓
Source
   ↓
Evidence
   ↓
Confidence
```

This allows investigators to understand where an attribution originates.

---

# 18. VASP Matching

After clustering:

```text
Unknown Address
      ↓
Candidate Cluster
      ↓
Cluster Addresses
      ↓
Compare against VASP Address DB
```

If:

```text
Cluster Address = Known VASP Address
```

the system records a VASP relationship.

---

# 19. Transaction Graph

The system should represent the Bitcoin transaction environment as a graph.

### Nodes

Nodes may represent:

* Bitcoin addresses
* Address clusters
* Known VASPs
* Investigated address

### Edges

Edges may represent:

* transaction relationships
* common-input relationships
* cluster membership
* known VASP association

Example:

```text
                 VASP A
                    ●
                    │
               transaction
                    │
                    ●
              Cluster #4
              /    |    \
             ●     ●     ●
             │
             │
             ●
       Unknown Address
```

---

# 20. Graph Visualization Requirements

Using React Flow:

* nodes must be clickable
* edges must be clickable
* selected nodes display details
* transaction edges display transaction IDs
* cluster nodes should visually distinguish clusters
* VASP nodes should be identifiable
* investigated address should be clearly highlighted
* graph should support zoom
* graph should support pan
* graph should support fit-to-view
* graph should support expanding relationships where appropriate

---

# 21. N-Hop Investigation

The system must support configurable graph depth.

Example:

```text
N = 1

Unknown
   ↓
Direct VASP relationship
```

```text
N = 2

Unknown
   ↓
Wallet A
   ↓
VASP
```

```text
N = 3

Unknown
   ↓
Wallet A
   ↓
Wallet B
   ↓
VASP
```

Default:

```text
N = 3
```

The value should be configurable.

---

# 22. Why Shortest Path Alone Is Not Enough

The system must not assume:

```text
Shortest path = strongest attribution
```

Instead:

```text
Candidate VASP
      ↓
Evidence signals
      ↓
Attribution Score
```

Possible signals include:

* hop distance
* number of interactions
* transaction frequency
* direct vs indirect relationship
* cluster relationship
* known VASP label confidence
* supporting transaction count

---

# 23. Attribution Scoring

The attribution engine produces a score for each candidate VASP.

Conceptual model:

```text
Attribution Score =
    Cluster Evidence
  + VASP Evidence
  + Transaction Relationship
  + Interaction Strength
  + Distance Factor
```

The exact formula is configurable and must be validated experimentally.

Example initial model:

```text
VASP evidence          30%
Cluster evidence       25%
Interaction frequency  20%
Hop distance            15%
Supporting evidence     10%
```

These weights are **initial engineering assumptions**, not ground truth.

They should be evaluated and adjusted using test cases.

---

# 24. Candidate Ranking

The system should produce multiple candidates when appropriate.

Example:

```text
Candidate VASPs

1. VASP A
   Score: 87%

2. VASP B
   Score: 51%

3. VASP C
   Score: 22%
```

The system should not force an attribution when evidence is weak.

---

# 25. Confidence Levels

Initial classification:

```text
80–100%
High-confidence candidate

60–79%
Moderate-confidence candidate

40–59%
Weak candidate

Below 40%
Insufficient evidence
```

These thresholds are provisional and must be validated against test data.

The UI should clearly distinguish:

```text
Score
```

from:

```text
Probability of actual ownership
```

The score is an internal evidence-ranking measure, not a mathematically proven probability of ownership.

---

# 26. Evidence Explanation

Every attribution result must explain why it received its score.

Example:

```text
Likely VASP:
Example VASP

Attribution Score:
84

Evidence:

✓ 3 known VASP-labelled addresses encountered
✓ 2-hop relationship
✓ 17 supporting transactions
✓ Investigated address belongs to a 6-address candidate cluster
✓ Strong repeated interaction

Limitations:

⚠ Common-input clustering is heuristic
⚠ VASP address labels depend on source quality
```

---

# 27. "Insufficient Evidence" State

This is mandatory.

The system should support:

```text
No reliable VASP association found.
```

when evidence is insufficient.

Possible causes:

* no known VASP interaction
* insufficient transaction history
* weak clustering evidence
* excessive graph distance
* conflicting evidence
* unknown VASP address data

---

# 28. Investigation Workflow

```text
1. User enters Bitcoin address
             ↓
2. Validate address
             ↓
3. Create investigation
             ↓
4. Fetch blockchain data
             ↓
5. Normalize transaction data
             ↓
6. Cache data
             ↓
7. Build transaction graph
             ↓
8. Apply common-input clustering
             ↓
9. Expand candidate relationships
             ↓
10. Compare with VASP database
             ↓
11. Discover candidate VASP paths
             ↓
12. Calculate attribution scores
             ↓
13. Rank candidates
             ↓
14. Display graph
             ↓
15. Display evidence
             ↓
16. Generate report
```

---

# 29. User Interface

## 29.1 Landing / Investigation Page

Required:

```text
Bitcoin Address
[____________________________]

[ Investigate ]
```

Validation:

```text
✓ Valid Bitcoin address
```

or:

```text
✗ Invalid Bitcoin address
```

---

# 30. Investigation Dashboard

Suggested layout:

```text
┌──────────────────────────────────────────────┐
│ VASPTrace                                    │
├──────────────────────────────────────────────┤
│ Investigated Address                         │
│ bc1q................................         │
├───────────────────────┬──────────────────────┤
│ Attribution Summary   │ Investigation Stats  │
│                       │                      │
│ VASP A                │ Transactions: 1,248 │
│ Score: 84             │ Cluster: 7 addresses│
│ Distance: 2 hops      │ VASP links: 3       │
├───────────────────────┴──────────────────────┤
│                                              │
│             INTERACTIVE GRAPH                │
│                                              │
│       ●──────●────────●                     │
│       │      │        │                     │
│       ●──────●        VASP                  │
│                                              │
├──────────────────────────────────────────────┤
│ Evidence / Transactions / Cluster Details   │
└──────────────────────────────────────────────┘
```

---

# 31. Investigation Summary

Required fields:

* Investigated address
* Investigation ID
* Investigation timestamp
* Number of transactions analyzed
* Number of addresses discovered
* Cluster size
* Candidate VASP
* Attribution score
* Hop distance
* Supporting transactions
* Evidence summary
* Data sources
* Limitations

---

# 32. Transaction Details

Selecting a transaction should display:

```text
Transaction ID
Block Height
Timestamp

Inputs
- Address
- Value

Outputs
- Address
- Value

Relationship
- Common-input
- Transfer
- Cluster relationship
```

---

# 33. API Design

## POST `/api/investigations`

Create investigation.

Request:

```json
{
  "address": "bitcoin_address"
}
```

Response:

```json
{
  "investigationId": "INV-001",
  "status": "created"
}
```

---

## GET `/api/investigations/:id`

Return investigation summary.

Example:

```json
{
  "id": "INV-001",
  "address": "bitcoin_address",
  "status": "completed",
  "transactionsAnalyzed": 1248,
  "clusterSize": 7,
  "topCandidate": {
    "name": "Example VASP",
    "score": 84,
    "hopDistance": 2
  }
}
```

---

## GET `/api/investigations/:id/graph`

Return graph data.

```json
{
  "nodes": [],
  "edges": []
}
```

---

## GET `/api/investigations/:id/evidence`

Return attribution evidence.

```json
{
  "candidate": "Example VASP",
  "score": 84,
  "evidence": []
}
```

---

# 34. Database Tables

Initial PostgreSQL schema:

```text
investigations
----------------
id
address
status
created_at
completed_at


addresses
----------------
id
address
address_type
first_seen
last_seen


transactions
----------------
id
txid
block_height
timestamp


transaction_inputs
----------------
id
transaction_id
address_id
value
previous_txid
previous_output_index


transaction_outputs
----------------
id
transaction_id
address_id
value
output_index
spent


clusters
----------------
id
investigation_id
confidence


cluster_addresses
----------------
cluster_id
address_id


vasps
----------------
id
name
description


vasp_addresses
----------------
id
vasp_id
address_id
source
source_reference
confidence
last_verified


attributions
----------------
id
investigation_id
vasp_id
score
hop_distance
created_at


evidence
----------------
id
attribution_id
type
description
weight
source_reference
```

---

# 35. Data Provenance

For externally sourced information, record:

```text
Source
Source URL/reference
Retrieved date
Data type
Confidence
```

This applies particularly to:

* VASP-labelled addresses
* blockchain API data
* external attribution datasets

---

# 36. Error Handling

The application must handle:

### Invalid address

```text
Invalid Bitcoin address
```

### API unavailable

```text
Blockchain data provider unavailable.
Please retry.
```

### Rate limit

```text
Data provider rate limit reached.
Using cached data where available.
```

### No transaction history

```text
No transaction history found.
```

### Insufficient data

```text
Insufficient evidence for reliable attribution.
```

---

# 37. Security Requirements

The application should:

* validate all user input
* sanitize API parameters
* protect backend API keys where applicable
* never expose private keys
* never request seed phrases
* never request wallet passwords
* use HTTPS in deployment
* implement reasonable API rate limiting
* avoid storing unnecessary personal information
* log investigation events without exposing sensitive secrets

**VASPTrace must never request or handle a user's private key or seed phrase.**

---

# 38. Performance Requirements

MVP targets:

* address validation: near-instant
* cached investigation retrieval: <2 seconds target
* initial blockchain retrieval: dependent on public API
* graph rendering: responsive for normal investigation sizes
* investigation depth configurable to prevent uncontrolled graph expansion

Graph expansion should be bounded.

For example:

```text
Maximum hops: 3
Maximum nodes: 500
Maximum transactions: 5,000
```

Initial limits should be configurable.

---

# 39. Testing Strategy

Testing must include both normal and adversarial cases.

## Unit Tests

Test:

* Bitcoin address validation
* transaction normalization
* common-input relationships
* clustering
* graph generation
* hop calculation
* scoring
* confidence classification

## Integration Tests

Test:

```text
API
 ↓
Blockchain provider
 ↓
Normalization
 ↓
Clustering
 ↓
VASP matching
 ↓
Scoring
```

## UI Tests

Test:

* address submission
* invalid address handling
* graph interaction
* node selection
* transaction details
* report generation

---

# 40. Ground-Truth Evaluation

This is one of the most important additions.

The project must eventually have a test dataset containing addresses/transactions for which the expected relationships are reasonably known.

Evaluation should measure:

### Clustering

* precision
* recall
* false-positive rate

### VASP matching

* candidate ranking accuracy
* top-1 accuracy
* top-3 accuracy

### Graph tracing

* successful path discovery
* path relevance

### System behavior

* percentage of investigations resulting in correct "insufficient evidence" decisions

The team must not evaluate the system only on addresses selected because they produce successful results.

---

# 41. MVP Definition

The MVP is complete when all of the following work:

* [ ] Bitcoin address input
* [ ] Address validation
* [ ] Blockchain transaction retrieval
* [ ] Transaction normalization
* [ ] Basic data caching
* [ ] Common-input clustering
* [ ] VASP address dataset
* [ ] Cluster-to-VASP matching
* [ ] N-hop graph search
* [ ] Attribution score
* [ ] Candidate ranking
* [ ] Interactive graph
* [ ] Evidence panel
* [ ] Investigation summary
* [ ] Insufficient-evidence state
* [ ] Basic test suite

---

# 42. Advanced Features

Only after MVP completion:

* [ ] Change-address heuristics
* [ ] More sophisticated graph scoring
* [ ] Multiple VASP candidates
* [ ] Transaction timeline
* [ ] Cluster expansion controls
* [ ] Advanced graph filtering
* [ ] Export investigation report
* [ ] PDF report
* [ ] Additional public blockchain data providers
* [ ] Statistical anomaly detection
* [ ] ML-based entity ranking
* [ ] Historical VASP address verification
* [ ] Improved graph layouts

---

# 43. AI/ML — Optional, Not MVP-Critical

The core system does not require machine learning.

The initial system should prioritize:

```text
Reliable data
+
Explainable heuristics
+
Graph analysis
+
Evidence scoring
```

If sufficient labelled data becomes available, ML can later be introduced for:

* candidate VASP ranking
* transaction behavior classification
* change-address prediction
* anomaly detection
* clustering confidence estimation

ML should improve the system rather than replace explainable blockchain evidence.

---

# 44. Development Phases

## Phase 0 — Bitcoin Fundamentals

Learn:

* Bitcoin transactions
* UTXOs
* inputs
* outputs
* addresses
* change
* transaction IDs
* blockchain explorers

Deliverable:

```text
Team understands a Bitcoin transaction.
```

---

## Phase 1 — Blockchain Data

Build:

```text
Address
   ↓
API
   ↓
Transactions
   ↓
Database
```

Deliverable:

```text
Given an address, display its transactions.
```

---

## Phase 2 — Transaction Graph

Build:

```text
Address
   ↓
Related transactions
   ↓
Graph
```

Deliverable:

```text
Interactive transaction graph.
```

---

## Phase 3 — Common-Input Clustering

Build:

```text
Transaction inputs
       ↓
Common-input heuristic
       ↓
Candidate clusters
```

Deliverable:

```text
Clustered address groups with supporting transactions.
```

---

## Phase 4 — VASP Dataset

Build:

```text
VASP
 ↓
Known addresses
 ↓
Source/provenance
```

Deliverable:

```text
Searchable VASP address database.
```

---

## Phase 5 — Attribution Engine

Build:

```text
Cluster
+
VASP relationships
+
Transaction graph
+
Evidence
        ↓
Attribution Score
```

Deliverable:

```text
Ranked VASP candidates.
```

---

## Phase 6 — Investigation Dashboard

Combine:

```text
Input
+
Graph
+
Clusters
+
VASP candidates
+
Evidence
+
Report
```

Deliverable:

```text
Complete MVP.
```

---

## Phase 7 — Evaluation

Create test cases.

Measure:

```text
Clustering quality
Attribution ranking
False positives
False negatives
Performance
```

Deliverable:

```text
Evaluation report.
```

---

# 45. Milestones

## Milestone 1 — Data Pipeline

Success criteria:

* Bitcoin address accepted
* API integration working
* transactions stored
* normalized internal format created

---

## Milestone 2 — Clustering

Success criteria:

* common-input relationships generated
* clusters generated
* evidence preserved

---

## Milestone 3 — VASP Attribution

Success criteria:

* VASP dataset integrated
* VASP relationships identified
* candidate scores calculated

---

## Milestone 4 — Graph UI

Success criteria:

* graph renders
* nodes clickable
* transactions inspectable
* clusters distinguishable
* VASP candidates visible

---

## Milestone 5 — Investigation Report

Success criteria:

* summary generated
* evidence shown
* limitations shown
* insufficient-evidence state works

---

## Milestone 6 — Evaluation

Success criteria:

* test dataset created
* baseline evaluated
* false positives documented
* scoring model revised if necessary

---

# 46. Definition of Done

A feature is considered complete only when:

1. Implementation exists.
2. Unit/integration tests exist where appropriate.
3. Error handling exists.
4. UI behavior is verified where applicable.
5. Data provenance is preserved.
6. The feature works on representative test data.
7. Limitations are documented.

---

# 47. Core Technical Risks

## Risk 1 — Common-input false positives

Mitigation:

* treat clustering as probabilistic
* preserve supporting transactions
* document limitations
* evaluate against test data

---

## Risk 2 — Poor VASP address data

Mitigation:

* maintain provenance
* store source
* store verification date
* assign source confidence
* support multiple sources

---

## Risk 3 — Public API limitations

Mitigation:

* provider abstraction
* caching
* pagination
* retries
* rate-limit handling
* multiple provider support

---

## Risk 4 — Graph explosion

A wallet may have thousands of related transactions.

Mitigation:

* configurable hop depth
* maximum node count
* maximum transaction count
* pagination
* progressive graph expansion

---

## Risk 5 — Incorrect interpretation of attribution score

Mitigation:

Clearly label:

```text
Attribution Score
```

rather than:

```text
Probability of Ownership
```

---

# 48. Key Product Screens

The MVP should contain:

### Screen 1 — Investigation

```text
Enter Bitcoin address
        ↓
Investigate
```

### Screen 2 — Investigation Dashboard

```text
Summary
+
Score
+
Graph
+
Statistics
```

### Screen 3 — Graph Investigation

```text
Address
+
Clusters
+
Transactions
+
VASP nodes
```

### Screen 4 — Evidence

```text
Why was VASP A ranked highest?
```

### Screen 5 — Report

```text
Investigation summary
+
Evidence
+
Limitations
```

---

# 49. Example Investigation

Input:

```text
bc1q-example-address
```

System:

```text
1. Retrieve transactions
2. Identify 1,248 transactions
3. Discover 37 related addresses
4. Apply common-input clustering
5. Generate Cluster #12
6. Compare cluster addresses against VASP database
7. Discover relationship to VASP A
8. Search up to 3 hops
9. Calculate evidence score
```

Output:

```text
--------------------------------
VASPTrace Investigation
--------------------------------

Investigated Address:
bc1q-example...

Top Candidate:
VASP A

Attribution Score:
84 / 100

Hop Distance:
2

Cluster Size:
7 addresses

Supporting Transactions:
17

Evidence:

✓ Known VASP-labelled address encountered
✓ Candidate common-control cluster
✓ Repeated transaction relationship
✓ 2-hop path to VASP-labelled address

Limitations:

⚠ Common-input clustering is heuristic
⚠ Address attribution depends on source quality
⚠ Result does not establish legal ownership
```

---

# 50. Key Decisions

| Decision                   | Rationale                                                | Status   |
| -------------------------- | -------------------------------------------------------- | -------- |
| Bitcoin only               | Limits technical complexity and focuses on UTXO analysis | Accepted |
| Common-input clustering    | Provides explainable candidate clustering                | Accepted |
| Evidence-based attribution | Prevents overclaiming ownership                          | Accepted |
| VASP provenance            | Makes entity labels auditable                            | Accepted |
| React Flow                 | Suitable for interactive investigation graphs            | Accepted |
| Public/free APIs           | Keeps MVP accessible                                     | Accepted |
| Provider abstraction       | Prevents dependence on one API                           | Accepted |
| PostgreSQL                 | Suitable for structured investigation data               | Accepted |
| Rule-based scoring first   | Easier to explain and validate than immediate ML         | Accepted |
| ML later                   | Requires meaningful labelled data                        | Deferred |
| N-hop configurable         | Prevents uncontrolled graph growth                       | Accepted |
| Shortest path alone        | Insufficient attribution signal                          | Rejected |

---

# 51. Initial Repository Structure

Recommended structure:

```text
vasptrace/
│
├── app/
│   ├── dashboard/
│   ├── investigations/
│   └── api/
│
├── components/
│   ├── graph/
│   ├── investigation/
│   ├── transactions/
│   ├── clusters/
│   └── evidence/
│
├── lib/
│   ├── blockchain/
│   │   ├── provider.ts
│   │   ├── mempool.ts
│   │   └── blockchair.ts
│   │
│   ├── clustering/
│   │   ├── commonInput.ts
│   │   └── clusterBuilder.ts
│   │
│   ├── attribution/
│   │   ├── scorer.ts
│   │   ├── ranking.ts
│   │   └── evidence.ts
│   │
│   ├── graph/
│   │   └── graphBuilder.ts
│   │
│   ├── vasp/
│   │   ├── database.ts
│   │   └── matching.ts
│   │
│   └── validation/
│       └── bitcoinAddress.ts
│
├── prisma/
│   └── schema.prisma
│
├── scripts/
│   ├── import-vasps.ts
│   └── seed-test-data.ts
│
├── tests/
│   ├── clustering/
│   ├── attribution/
│   ├── blockchain/
│   └── graph/
│
├── docs/
│   ├── architecture.md
│   ├── methodology.md
│   └── evaluation.md
│
├── PROJECT.md
└── README.md
```

---

# 52. Development Priority

The team must prioritize:

```text
P0 — Must Work
────────────────────────────
Bitcoin data retrieval
Transaction normalization
Common-input clustering
VASP dataset
VASP matching
Attribution scoring
Graph visualization


P1 — Important
────────────────────────────
Caching
Evidence explanation
N-hop configuration
Investigation history
Report generation
Testing/evaluation


P2 — Advanced
────────────────────────────
Change-address heuristics
Advanced scoring
ML
Anomaly detection
Additional providers
```

---

# 53. Core Value Check

At every milestone, ask:

> **Can an investigator enter an unknown Bitcoin address and understand, with inspectable evidence, which known VASP candidates it is most strongly associated with?**

If the answer is no, the team should prioritize fixing the core pipeline rather than adding UI features.

---

# 54. Success Criteria

The project is successful if the final prototype can demonstrate:

```text
Unknown Bitcoin Address
        ↓
Blockchain Transactions
        ↓
Candidate Address Cluster
        ↓
Known VASP Relationship
        ↓
Evidence-Weighted Ranking
        ↓
Interactive Graph
        ↓
Explainable Investigation Report
```

with measurable evaluation results.

The system should be able to say:

> **"VASP A is the strongest candidate based on these blockchain relationships and evidence."**

while clearly communicating uncertainty and limitations.

---

# 55. Final Product Positioning

VASPTrace is:

> **An explainable Bitcoin blockchain investigation assistant for candidate VASP attribution.**

It is **not**:

> A system that definitively identifies the legal owner of a cryptocurrency wallet.

The product's competitive value comes from combining:

```text
Bitcoin UTXO Analysis
        +
Common-Input Clustering
        +
VASP Address Intelligence
        +
Graph Traversal
        +
Evidence Scoring
        +
Interactive Visualization
```

into one investigator-friendly workflow.

---

# 56. Current Status

## Validated

None yet.

## Active

* [ ] UI-01 — Bitcoin address investigation
* [ ] CORE-01 — Blockchain data retrieval
* [ ] CORE-02 — Data normalization
* [ ] CORE-03 — Data caching
* [ ] CORE-04 — Common-input clustering
* [ ] CORE-05 — Clustering evidence
* [ ] CORE-07 — VASP address database
* [ ] CORE-08 — VASP matching
* [ ] CORE-09 — Attribution scoring
* [ ] CORE-10 — Candidate ranking
* [ ] CORE-11 — Insufficient-evidence handling
* [ ] UI-03 — Interactive graph
* [ ] UI-04 — Transaction/node inspection
* [ ] UI-05 — Evidence visualization
* [ ] UI-06 — Investigation report

## Deferred

* [ ] Change-address heuristics
* [ ] ML-based ranking
* [ ] Advanced anomaly detection
* [ ] Additional blockchains
* [ ] Paid intelligence APIs
* [ ] Real-time monitoring

## Out of Scope

* Ethereum
* EVM chains
* Solana
* Legal ownership determination
* KYC/identity discovery
* Private-key/seed handling
* Real-time monitoring
* Paid blockchain intelligence APIs

---

# 57. Next Immediate Tasks

The team should **not start with the dashboard**.

Start in this order:

### Task 1

Learn and document:

```text
Bitcoin
→ Transaction
→ Input
→ Output
→ UTXO
→ Address
```

### Task 2

Select the first blockchain API.

### Task 3

Implement:

```text
Bitcoin address
      ↓
API
      ↓
Transactions
```

### Task 4

Create the normalized transaction model.

### Task 5

Implement basic common-input clustering.

### Task 6

Create a small, source-documented VASP address dataset.

### Task 7

Connect:

```text
Cluster
    ↓
VASP address
```

### Task 8

Implement evidence scoring.

### Task 9

Build the React Flow graph.

### Task 10

Only then build the polished dashboard.

---

# 58. Project Principle

> **Evidence first. Visualization second. AI/ML last.**

A beautiful graph showing an unreliable attribution is not a successful blockchain intelligence system.

A simple graph that clearly demonstrates:

```text
Address
→ Transaction
→ Cluster
→ VASP
→ Evidence
```

is the foundation of VASPTrace.
