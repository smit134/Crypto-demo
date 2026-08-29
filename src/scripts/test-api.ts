import { MempoolProvider } from '../lib/blockchain/mempool';

async function run() {
  const provider = new MempoolProvider();
  const testAddress = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'; // Genesis block address

  console.log(`Fetching transactions for ${testAddress}...`);
  
  try {
    const txs = await provider.getAddressTransactions(testAddress);
    console.log(`Found ${txs.length} transactions.`);
    
    if (txs.length > 0) {
      console.log('Sample transaction:');
      const sample = txs[0];
      console.log(`TXID: ${sample.txid}`);
      console.log(`Date: ${sample.timestamp}`);
      console.log(`Inputs: ${sample.inputs.length}`);
      console.log(`Outputs: ${sample.outputs.length}`);
    }
  } catch (err) {
    console.error(err);
  }
}

run();
