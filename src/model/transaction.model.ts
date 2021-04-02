export interface TransactionDataModel {
    id: string,
    currency: string,
    amount: number,
    category: string,
    balance: number,
    date: Date,
    direction: string,
    reference: string
}