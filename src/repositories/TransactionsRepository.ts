/* eslint-disable no-param-reassign */
import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const balanceAcumulator = transactions.reduce(
      (acumulator, transaction) => {
        switch (transaction.type) {
          case 'income':
            acumulator.income += Number(transaction.value);
            break;
          case 'outcome':
            acumulator.outcome += Number(transaction.value);
            break;
          default:
            break;
        }
        acumulator.total = acumulator.income - acumulator.outcome;

        return acumulator;
      },
      { income: 0, outcome: 0, total: 0 },
    );

    return balanceAcumulator;
  }
}

export default TransactionsRepository;
