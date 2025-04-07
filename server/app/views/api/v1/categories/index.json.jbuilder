json.data do
  json.array! @categories do |category|
    json.cache! category do
      json.partial! 'api/v1/categories/category', category: category
    end
  end
end
