json.id expense.id
json.name expense.name
json.amount expense.amount
json.category expense.category
json.account_id expense.account_id
json.frequency expense.frequency
json.last_expensed_at expense.last_expensed_at
json.expensed expense.expensed?
json.pending expense.pending?
json.created_at expense.created_at
json.updated_at expense.updated_at

if expense.account.present?
  json.account do
    json.id expense.account.id
    json.name expense.account.name
  end
end
