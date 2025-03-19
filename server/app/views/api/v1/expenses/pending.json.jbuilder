json.data do
  json.array! @expenses do |expense|
    json.cache! expense do
      json.partial! 'api/v1/expenses/expense', expense: expense
    end
  end
end
