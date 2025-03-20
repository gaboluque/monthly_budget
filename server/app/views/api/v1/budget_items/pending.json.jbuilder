json.data do
  json.array! @budget_items do |budget_item|
    json.cache! budget_item do
      json.partial! 'api/v1/budget_items/budget_item', budget_item: budget_item
    end
  end
end
