json.id income.id
json.name income.name
json.amount income.amount
json.frequency income.frequency
json.created_at income.created_at
json.updated_at income.updated_at
json.last_received_at income.last_received_at
json.account do
    json.partial! 'api/v1/accounts/account', account: income.account
end
