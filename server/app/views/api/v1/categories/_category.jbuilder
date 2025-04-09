json.id category.id
json.name category.name
json.color category.color
json.icon category.icon
json.children do
    json.array! category.children do |child|
        json.cache! child do
          json.partial! 'api/v1/categories/category', category: child
        end
      end
end
