import axios from 'axios';
import { BlockchainProvider, NormalizedTransaction, NormalizedInput, NormalizedOutput } from './provider';

export class MempoolProvider implements BlockchainProvider {
  private baseUrl = 'https://mempool.space/api';

  async getAddressTransactions(address: string): Promise<NormalizedTransaction[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/address/${address}/txs`);
      return response.data.map(this.normalizeTransaction);
    } catch (error) {
      console.error(`Failed to fetch transactions for ${address} from Mempool.space:`, error);
      throw new Error(`Mempool API Error: ${error}`);
    }
  }

  private normalizeTransaction(rawTx: any): NormalizedTransaction {
    const inputs: NormalizedInput[] = rawTx.vin.map((vin: any) => ({
      txid: vin.txid,
      vout: vin.vout,
      address: vin.prevout?.scriptpubkey_address,
      value: BigInt(vin.prevout?.value || 0),
    }));

    const outputs: NormalizedOutput[] = rawTx.vout.map((vout: any) => ({
      address: vout.scriptpubkey_address,
      value: BigInt(vout.value || 0),
    }));

    return {
      txid: rawTx.txid,
      blockHeight: rawTx.status.block_height,
      timestamp: new Date((rawTx.status.block_time || Date.now() / 1000) * 1000),
      inputs,
      outputs,
    };
  }
}
