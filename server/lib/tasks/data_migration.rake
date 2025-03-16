namespace :data_migration do
  desc "Migrate expense destination to account reference"
  task migrate_expense_destination: :environment do
    puts "Starting migration of expense destinations to account references..."

    # Get all expenses
    expenses = Expense.all
    total = expenses.count
    migrated = 0
    not_found = 0

    expenses.each_with_index do |expense, index|
      # Try to find an account with the ID from old_destination
      if expense.old_destination.present?
        account = Account.find_by(id: expense.old_destination)

        if account
          expense.update_columns(account_id: account.id)
          migrated += 1
        else
          not_found += 1
          puts "No account found with ID: #{expense.old_destination} for expense ID: #{expense.id}"
        end
      end

      # Print progress every 100 records
      if (index + 1) % 100 == 0 || index + 1 == total
        puts "Processed #{index + 1}/#{total} expenses..."
      end
    end

    puts "Migration completed!"
    puts "Total expenses: #{total}"
    puts "Successfully migrated: #{migrated}"
    puts "Accounts not found: #{not_found}"
  end

  desc "Remove old destination column from expenses"
  task remove_old_destination: :environment do
    puts "Removing old_destination column from expenses table..."

    if ActiveRecord::Base.connection.column_exists?(:expenses, :old_destination)
      ActiveRecord::Base.connection.remove_column(:expenses, :old_destination)
      puts "Column removed successfully!"
    else
      puts "Column old_destination does not exist in expenses table."
    end
  end
end
