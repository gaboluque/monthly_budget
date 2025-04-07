require_relative 'seeds/transaction_categories'

class Seeds
  def self.run
    new.run
  end

  def run
    puts "\n============ Starting Database Seeding Process ============\n\n"
    clear_existing_data
    Seeds::TransactionCategories.run
    create_test_user
    create_accounts
    create_incomes
    create_budget_items
    create_transactions
    puts "\n============ Database Seeding Completed Successfully ============\n"
  end

  private

  def clear_existing_data
    puts "---------- 🗑️  Clearing Existing Data ----------"
    Transaction.destroy_all
    Income.destroy_all
    BudgetItem.destroy_all
    Account.destroy_all
    User.destroy_all
    Transaction::Category.destroy_all
    puts "✅ All existing data cleared\n\n"
  end

  def create_test_user
    puts "---------- 👤 Creating Test User ----------"
    @test_user = User.create!(
      email: 'user@test.com',
      password: 'qwerty123',
    )
    puts "✅ Test user created successfully\n\n"
  end

  def create_accounts
    puts "---------- 🏦 Creating Financial Accounts ----------"
    @savings = create_account(
      name: 'Savings',
      balance: 15000.00,
      currency: 'cop',
      description: 'Emergency fund',
      is_owned: true,
      account_type: Account.account_types[:savings]
    )

    @investments = create_account(
      name: 'Investments',
      balance: 10000.00,
      currency: 'cop',
      description: 'Investments',
      is_owned: true,
      account_type: Account.account_types[:investment]
    )

    @credit_card = create_account(
      name: 'Credit Card',
      balance: 1000.00,
      currency: 'cop',
      description: 'Primary credit card',
      is_owned: true,
      account_type: Account.account_types[:credit_card]
    )
    puts "✅ All accounts created successfully\n\n"
  end

  def create_incomes
    puts "---------- 💰 Creating Income Sources ----------"
    @salary = create_income(
      name: 'Monthly Salary',
      amount: 3500.00,
      frequency: 'monthly',
      account_id: @savings.id
    )

    @freelance = create_income(
      name: 'Freelance Work',
      amount: 500.00,
      frequency: 'monthly',
      account_id: @savings.id
    )
    puts "✅ All income sources created successfully\n\n"
  end

  def create_budget_items
    puts "---------- 📋 Creating Budget Items ----------"
    
    # Get transaction categories
    @housing_category = Transaction::Category.find_by(name: 'Housing')
    @food_category = Transaction::Category.find_by(name: 'Food & Drinks')
    @entertainment_category = Transaction::Category.find_by(name: 'Entertainment')
    @shopping_category = Transaction::Category.find_by(name: 'Shopping')
    
    @rent = create_budget_item(
      name: 'Rent',
      amount: 1200.00,
      frequency: 'monthly'
    )
    @rent.transaction_categories << @housing_category if @housing_category
    
    @groceries = create_budget_item(
      name: 'Groceries',
      amount: 400.00,
      frequency: 'monthly'
    )
    @groceries.transaction_categories << @food_category if @food_category
    @groceries.transaction_categories << @shopping_category if @shopping_category
    
    @going_out = create_budget_item(
      name: 'Eating Out',
      amount: 200.00,
      frequency: 'monthly'
    )
    @going_out.transaction_categories << @food_category if @food_category
    @going_out.transaction_categories << @entertainment_category if @entertainment_category
    
    puts "✅ All budget items created successfully\n\n"
  end

  def create_transactions
    puts "---------- 💳 Creating Transactions ----------"
    create_transaction(
      amount: 1200.00,
      budget_item: @rent,
      executed_at: Time.current,
      account_id: @savings.id,
      transaction_type: 'expense'
    )

    create_transaction(
      amount: 3500.00,
      budget_item: @groceries,
      executed_at: Time.current,
      account_id: @savings.id,
      transaction_type: 'income'
    )
    puts "✅ All transactions created successfully\n\n"
  end

  def create_account(params)
    result = Accounts::Create.call(@test_user, params)
    puts "  • #{params[:name]} account: #{result[:success] ? '✅' : '❌'}"
    puts "    Errors: #{result[:errors]}" if result[:success] == false
    result[:account]
  end

  def create_income(params)
    result = Incomes::Create.call(@test_user, params)
    puts "  • #{params[:name]}: #{result[:success] ? '✅' : '❌'}"
    puts "    Errors: #{result[:errors]}" if result[:success] == false
    result[:income]
  end

  def create_budget_item(params)
    result = BudgetItems::Create.call(@test_user, params)
    puts "  • #{params[:name]}: #{result[:success] ? '✅' : '❌'}"
    puts "    Errors: #{result[:errors]}" if result[:success] == false
    result[:budget_item]
  end

  def create_transaction(params)
    result = Transactions::Create.call(@test_user, params)
    puts "  • Transaction: #{result[:success] ? '✅' : '❌'}"
    puts "    Errors: #{result[:errors]}" if result[:success] == false
    result[:transaction]
  end
end

# Run the seeds
Seeds.run
