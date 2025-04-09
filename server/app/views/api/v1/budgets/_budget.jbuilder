json.id budget.id
json.name budget.name
json.amount budget.amount.to_f
json.nature budget.nature
json.last_paid_at budget.last_paid_at
json.is_paid budget.paid_this_month?
json.is_pending budget.pending?
json.created_at budget.created_at
json.updated_at budget.updated_at
json.categories budget.categories do |category|
  json.partial! 'api/v1/categories/category', category: category
end
