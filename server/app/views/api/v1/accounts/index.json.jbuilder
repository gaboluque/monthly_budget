json.data do
  json.array! @accounts do |account|
    json.cache! account do
      json.partial! 'api/v1/accounts/account', account: account
    end
  end
end
