import { ClientTransaction, fetchXDocument } from 'x-client-transaction-id';

let transaction: Promise<ClientTransaction> | undefined;

export async function signTransactionId(method: string, path: string): Promise<string> {
  transaction ??= fetchXDocument().then((document) => ClientTransaction.create(document));
  try {
    return await (await transaction).generateTransactionId(method, path);
  } catch (error) {
    transaction = undefined;
    throw error;
  }
}
