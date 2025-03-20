json.id budget_item.id
json.name budget_item.name
json.amount budget_item.amount
json.category budget_item.category
json.account_id budget_item.account_id
json.frequency budget_item.frequency
json.last_paid_at budget_item.last_paid_at
json.paid budget_item.paid?
json.pending budget_item.pending?
json.created_at budget_item.created_at
json.updated_at budget_item.updated_at

json.account do
  if budget_item.account.present?
    json.partial! 'api/v1/accounts/account', account: budget_item.account
  else
    json.null
  end
end
