import { LoopingOrder } from 'libs/LoopringOrder';

export default class BaseServer {
  async sendAllowanceTransaction(transaction: string) {
    throw new Error('Implement me');
  }

  async sendAllowanceTransactions(transactions: string[]) {
    throw new Error('Implement me');
  }

  async getLoopringOrders(address: string): Promise<LoopingOrder[]> {
    throw new Error('Implement me');
  }

  async getLoopringOrderDetail(hash: string): Promise<LoopingOrder> {
    throw new Error('Implement me');
  }
}
