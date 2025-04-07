json.array! @categories do |category|
  json.id category.id
  json.name category.name
  json.color category.color
  json.icon category.icon
end
