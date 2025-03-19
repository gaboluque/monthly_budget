json.data do
    json.array! @incomes do |income|
        json.cache! income do
          json.partial! 'api/v1/incomes/income', income: income
        end
    end
end
