interface ResponseData{
    id: number;
    transaction_name: string;
    type: string;
    category: string;
    amount: number;
    date: Date|string;
    user_id: string|undefined;
}
  
export const updateTransactionData = (data: Array<ResponseData>) => {
    const updateData = data.map((each: ResponseData) => {
        return {
            amount: each.amount,
            category: each.category,
            date: each.date,
            id: each.id,
            name: each.transaction_name,
            type: each.type,
            user_id: each.user_id
        }
    })
    return updateData
}
