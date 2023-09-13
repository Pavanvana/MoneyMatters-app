interface ResponseData{
    id: number;
    transaction_name: string;
    type: string;
    category: string;
    amount: number;
    date: Date|string;
    user_id: string|undefined;
}
  
interface Response {
transactions: Array<ResponseData>
}

export const sortedData = (data: Response) => {
    return data.transactions.sort((a: ResponseData, b: ResponseData) => new Date(a.date) < new Date(b.date) ? 1 : -1)
}
