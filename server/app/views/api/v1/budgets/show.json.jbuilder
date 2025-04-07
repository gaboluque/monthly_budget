json.cache! @budget do
  json.partial! 'api/v1/budgets/budget', budget: @budget
end
