export interface NormalizedInput {
  txid: string;
  vout: number;
  address?: string;
  value: bigint;
}

export interface NormalizedOutput {
  address?: string;
  value: bigint;
}

export interface NormalizedTransaction {
  txid: string;
  blockHeight?: number;
  timestamp: Date;
  inputs: NormalizedInput[];
  outputs: NormalizedOutput[];
}

export interface BlockchainProvider {
  /**
   * Fetch the transaction history for a given Bitcoin address.
   * @param address The Bitcoin address to query.
   * @returns Array of normalized transactions.
   */
  getAddressTransactions(address: string): Promise<NormalizedTransaction[]>;
}
