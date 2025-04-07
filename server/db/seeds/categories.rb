# This file contains seed data for categories
# Run using: rails db:seed:categories

class Seeds
  module Categories
    def self.run
      puts "\n============ Starting Categories Seeding Process ============\n\n"
      create_categories
      puts "\n============ Categories Seeding Completed Successfully ============\n"
    end

    private

    def self.create_categories
      puts "---------- 📂 Creating Categories ----------"
      
      categories = [
        {
          id: 0,
          name: 'Other',
          color: '#808080',
          icon: '📌',
        },
        {
          name: 'Food & Drinks',
          color: '#FF5733',
          icon: '🍔',
        },
        {
          name: 'Shopping',
          color: '#33FF57',
          icon: '🛍️',
        },
        {
          name: 'Housing',
          color: '#3357FF',
          icon: '🏠',
        },
        {
          name: 'Transportation',
          color: '#57FF33',
          icon: '🚗',
        },
        {
          name: 'Health',
          color: '#FF33A1',
          icon: '🏥',
        },
        {
          name: 'Entertainment',
          color: '#33A1FF',
          icon: '🎉',
        },
        {
          name: 'Education',
          color: '#A133FF',
          icon: '📚',
        },
        {
          name: 'Travel',
          color: '#FF3333',
          icon: '✈️',
        },
        {
          name: 'Pets',
          color: '#33FFA1',
          icon: '🐾',
        },
        {
          name: 'Gifts',
          color: '#FFA133',
          icon: '🎁',
        },
        {
          name: 'Vehicle',
          color: '#33A1A1',
          icon: '🚙',
        },
        {
          name: 'Investments',
          color: '#A1A133',
          icon: '📈',
        },
        {
          name: 'Savings',
          color: '#33FFF5',
          icon: '💰',
        },
        {
          name: 'Income',
          color: '#33FF33',
          icon: '💵',
        },
        {
          name: 'Subscriptions',
          color: '#FF33FF',
          icon: '📱',
        }
      ]

      categories.each do |category|
        result = ::Categories::Create.call(nil, category)
        puts "  • #{category[:name]}: #{result[:success] ? '✅' : '❌'}"
        puts "    Errors: #{result[:errors]}" if result[:success] == false
      end
    end
  end
end
