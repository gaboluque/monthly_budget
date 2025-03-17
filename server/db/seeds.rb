# This file creates seed data for development and testing environments
# Run using: rails db:seed or when setting up the database: rails db:setup

# Clear existing data
puts "Clearing existing data..."
Transaction.destroy_all
Income.destroy_all
Expense.destroy_all
Account.destroy_all
User.destroy_all

# Create test user
puts "Creating user..."
test_user = User.create!(
  email: 'user@test.com',
  password: 'qwerty123',
)

# Create accounts
puts "Creating accounts..."
checking_params = {
  name: 'Primary Checking',
  balance: 5000.00,
  account_type: 'Checking',
  currency: 'COP',
  description: 'Main checking account',
  is_owned: true
}
checking_result = Accounts::Create.call(test_user, checking_params)
checking = checking_result[:account]

savings_params = {
  name: 'Savings',
  balance: 15000.00,
  account_type: 'Savings',
  currency: 'COP',
  description: 'Emergency fund',
  is_owned: true
}
savings_result = Accounts::Create.call(test_user, savings_params)
savings = savings_result[:account]

credit_card_params = {
  name: 'Credit Card',
  balance: 1000.00,
  account_type: 'Credit Card',
  currency: 'COP',
  description: 'Primary credit card',
  is_owned: true
}
credit_card_result = Accounts::Create.call(test_user, credit_card_params)
credit_card = credit_card_result[:account]

external_params = {
  name: 'External Account',
  balance: 0.00,
  account_type: 'Other',
  currency: 'COP',
  description: 'External account for transfers',
  is_owned: false
}
external_result = Accounts::Create.call(test_user, external_params)
external = external_result[:account]

# Create incomes
puts "Creating incomes..."
salary_params = {
  name: 'Monthly Salary',
  amount: 3500.00,
  frequency: 'monthly',
  account_id: checking.id,
  last_received_at: Time.current - 15.days
}
salary_result = Incomes::Create.call(test_user, salary_params)
salary = salary_result[:income]

freelance_params = {
  name: 'Freelance Work',
  amount: 500.00,
  frequency: 'monthly',
  account_id: checking.id,
  last_received_at: nil
}
freelance_result = Incomes::Create.call(test_user, freelance_params)
freelance = freelance_result[:income]

interest_params = {
  name: 'Savings Interest',
  amount: 50.00,
  frequency: 'quarterly',
  account_id: savings.id,
  last_received_at: Time.current - 60.days
}
interest_result = Incomes::Create.call(test_user, interest_params)
interest = interest_result[:income]

# Create expenses
puts "Creating expenses..."
rent_params = {
  name: 'Rent',
  amount: 1200.00,
  category: 'Needs',
  frequency: 'monthly',
  account_id: checking.id,
  last_expensed_at: Time.current - 15.days
}
rent_result = Expenses::Create.call(test_user, rent_params)
rent = rent_result[:expense]

groceries_params = {
  name: 'Groceries',
  amount: 400.00,
  category: 'Needs',
  frequency: 'bi-weekly',
  account_id: checking.id,
  last_expensed_at: Time.current - 10.days
}
groceries_result = Expenses::Create.call(test_user, groceries_params)
groceries = groceries_result[:expense]

streaming_params = {
  name: 'Streaming Services',
  amount: 30.00,
  category: 'Wants',
  frequency: 'monthly',
  account_id: credit_card.id,
  last_expensed_at: Time.current - 20.days
}
streaming_result = Expenses::Create.call(test_user, streaming_params)
streaming = streaming_result[:expense]

investments_params = {
  name: 'Stock Investment',
  amount: 300.00,
  category: 'Investment',
  frequency: 'monthly',
  account_id: checking.id,
  last_expensed_at: nil
}
investments_result = Expenses::Create.call(test_user, investments_params)
investments = investments_result[:expense]

# Create transactions
puts "Creating transactions..."

# Transaction for an income (salary)
salary_transaction_date = Time.current - 15.days
salary_transaction_params = {
  account_id: checking.id,
  amount: salary.amount,
  transaction_type: 'income',
  description: "Income: #{salary.name}",
  executed_at: salary_transaction_date,
  item_type: 'Income',
  item_id: salary.id
}
Transactions::Create.call(test_user, salary_transaction_params)

# Transaction for an expense (rent)
rent_transaction_date = Time.current - 15.days
rent_transaction_params = {
  account_id: checking.id,
  amount: rent.amount,
  transaction_type: 'expense',
  description: "Expense: #{rent.name}",
  executed_at: rent_transaction_date,
  item_type: 'Expense',
  item_id: rent.id
}
Transactions::Create.call(test_user, rent_transaction_params)

# Deposit transaction
deposit_date = Time.current - 5.days
deposit_params = {
  account_id: checking.id,
  amount: 1000.00,
  transaction_type: 'deposit',
  description: "Deposit to #{checking.name}",
  executed_at: deposit_date
}
Transactions::Create.call(test_user, deposit_params)

# Transfer transaction between accounts
transfer_date = Time.current - 3.days
transfer_params = {
  account_id: checking.id,
  recipient_account_id: savings.id,
  amount: 500.00,
  transaction_type: 'transfer',
  description: "Transfer from #{checking.name} to #{savings.name}",
  executed_at: transfer_date
}
Transactions::Create.call(test_user, transfer_params)

puts "Seed data created successfully!"
puts "Created #{User.count} users"
puts "Created #{Account.count} accounts"
puts "Created #{Income.count} incomes"
puts "Created #{Expense.count} expenses"
puts "Created #{Transaction.count} transactions"
