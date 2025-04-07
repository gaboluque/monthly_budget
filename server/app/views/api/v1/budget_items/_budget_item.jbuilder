json.id budget_item.id
json.name budget_item.name
json.amount budget_item.amount
json.last_paid_at budget_item.last_paid_at
json.is_paid budget_item.paid_this_month?
json.is_pending budget_item.pending?
json.created_at budget_item.created_at
json.updated_at budget_item.updated_at

# Include transaction categories
json.transaction_categories budget_item.transaction_categories do |category|
  json.id category.id
  json.name category.name
  json.color category.color
  json.icon category.icon
end

# Include transaction category IDs for easier form handling
json.transaction_category_ids budget_item.transaction_categories.pluck(:id)
