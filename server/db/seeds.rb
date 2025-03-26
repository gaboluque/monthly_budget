# This file creates seed data for development and testing environments
# Run using: rails db:seed or when setting up the database: rails db:setup


# 1. Create test user
# 2. Create accounts (Savings, Investments, Credit Card)
# 3. Create incomes (Salary, Freelance)
# 4. Create budget items (Rent, Groceries, Eating Out, Streaming Services)
# 5. Mark 2 budget items as paid (using MarkAsPaid service)
# 6. Mark 1 income as received (using MarkAsReceived service)

# Clear existing data
puts "Clearing existing data..."
Transaction.destroy_all
Income.destroy_all
BudgetItem.destroy_all
Account.destroy_all
User.destroy_all

# # Create test user
puts "Creating user..."
test_user = User.create!(
  email: 'user@test.com',
  password: 'qwerty123',
)


puts "Creating accounts..."
savings_params = {
  name: 'Savings',
  balance: 15000.00,
  account_type: Account.account_types[:savings],
  currency: 'COP',
  description: 'Emergency fund',
  is_owned: true
}
savings_result = Accounts::Create.call(test_user, savings_params)
savings = savings_result[:account]

investments_params = {
  name: 'Investments',
  balance: 10000.00,
  account_type: Account.account_types[:investments],
  currency: 'COP',
  description: 'Investments',
  is_owned: true
}
investments_result = Accounts::Create.call(test_user, investments_params)
investments = investments_result[:account]

credit_card_params = {
  name: 'Credit Card',
  balance: 1000.00,
  account_type: Account.account_types[:credit_card],
  currency: 'COP',
  description: 'Primary credit card',
  is_owned: true
}
credit_card_result = Accounts::Create.call(test_user, credit_card_params)
credit_card = credit_card_result[:account]

puts "Creating incomes..."
salary_params = {
  name: 'Monthly Salary',
  amount: 3500.00,
  frequency: 'monthly'
}
salary_result = Incomes::Create.call(test_user, salary_params)
salary = salary_result[:income]

freelance_params = {
  name: 'Freelance Work',
  amount: 500.00,
  frequency: 'monthly'
}
freelance_result = Incomes::Create.call(test_user, freelance_params)
freelance = freelance_result[:income]

puts "Creating budget items..."
rent_params = {
  name: 'Rent',
  amount: 1200.00,
  category: 'needs',
  frequency: 'monthly'
}
rent_result = BudgetItems::Create.call(test_user, rent_params)
rent = rent_result[:budget_item]

groceries_params = {
  name: 'Groceries',
  amount: 400.00,
  category: 'needs',
  frequency: 'monthly'
}
groceries_result = BudgetItems::Create.call(test_user, groceries_params)
groceries = groceries_result[:budget_item]

going_out_params = {
  name: 'Eating Out',
  amount: 200.00,
  category: 'wants',
  frequency: 'monthly'
}
going_out_result = BudgetItems::Create.call(test_user, going_out_params)
going_out = going_out_result[:budget_item]

puts "Marking budget items as paid..."
result = Transactions::Create.call(test_user, {
  amount: 1200.00,
  budget_item_id: rent.id,
  executed_at: Time.current
})

puts "Marking income as received..."
result = Transactions::Create.call(test_user, {
  amount: 3500.00,
  budget_item_id: rent.id,
  executed_at: Time.current
})
