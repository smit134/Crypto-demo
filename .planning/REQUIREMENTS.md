# Requirements

## Validated
(None yet — ship to validate)

## Active

### User Interface
- [ ] **UI-01**: User can input a Bitcoin address and initiate a trace.
- [ ] **UI-02**: System visualizes the transaction flow and clusters as an interactive node graph (using React Flow).
- [ ] **UI-03**: System displays a summary report of the attribution (confidence score, nearest VASP, hop distance, clustered addresses).

### Core Tracing Engine
- [ ] **CORE-01**: System fetches transaction history for the given address via free public APIs (Mempool.space).
- [ ] **CORE-02**: System applies common-input clustering to group addresses belonging to the same entity.
- [ ] **CORE-03**: System cross-references clustered addresses against a known database of VASP addresses (JSON for MVP, PostgreSQL for deployment).
- [ ] **CORE-04**: System calculates the shortest/most probable path (N-hops) from the unknown wallet cluster to a VASP.

## Out of Scope
- Ethereum, EVM-compatible chains, and Solana (focused strictly on Bitcoin/UTXO for v1).
- Integration with paid intelligence APIs like Chainalysis, TRM, or Elliptic (to keep v1 free/accessible).
- Real-time transaction monitoring (this is a forensic tracing tool, not an active monitoring tool).
