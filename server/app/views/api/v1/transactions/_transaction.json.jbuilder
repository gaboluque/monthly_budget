json.id transaction.id
json.amount transaction.amount.to_f
json.category do
    json.partial! 'api/v1/categories/category', category: transaction.category
end
json.description transaction.description
json.executed_at transaction.executed_at
json.frequency transaction.frequency
json.transaction_type transaction.transaction_type
json.created_at transaction.created_at
json.updated_at transaction.updated_at

json.account do
    transaction.account.nil? ? json.null : json.partial!('api/v1/accounts/account', account: transaction.account)
end

json.recipient_account do
    transaction.recipient_account.nil? ? json.null : json.partial!('api/v1/accounts/account', account: transaction.recipient_account)
end
