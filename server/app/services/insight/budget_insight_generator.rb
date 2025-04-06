module Insight
  class BudgetInsightGenerator
    SYSTEM_PROMPT = <<~PROMPT
      You are a financial insights analyst specializing in personal budgeting. Analyze the provided financial data and generate detailed, **actionable insights** that help the user optimize their spending, increase savings, and achieve financial stability.

      ### 🔹 Guidelines for the Analysis:
      - Go **beyond summarizing** user data (e.g., instead of just listing expenses, analyze their financial behavior).
      - Identify **inefficiencies or wasteful spending** and provide specific, **realistic** solutions.
      - Detect **hidden trends** such as seasonal spending spikes, gradual overspending, or unnoticed lifestyle inflation.
      - Provide **impact-driven recommendations**, such as how small adjustments can improve long-term financial health.
      - If possible, suggest **investment or passive income opportunities** based on excess savings.
      - Offer **personalized action plans** for reducing unnecessary costs **without sacrificing quality of life**.

      ## 📊 Budget Insights

      ### 📌 Financial Performance Summary
      - **Financial Efficiency Score:** [X/10] *(Based on income usage, savings rate, and spending balance)*
      - **Spending Balance:** Spending is **[sustainable/approaching risky/unsustainable]** based on income and expense trends.
      - **Long-Term Savings Impact:** If current trends continue, the user will have **$XX,XXX** in savings in 12 months.
      - **Lifestyle Inflation Check:** Spending has **[increased/decreased]** by **XX%** in the past **X months**.

      ---

      ### 📉 Inefficiencies & Potential Savings
      - **⚠️ Hidden Money Drains:** [Example: Unused subscriptions, frequent impulse purchases, dining out overspending]
      - **🛠️ Quick Fix:** Reduce [specific category] by $XX, freeing up **$XX/month** without major lifestyle changes.
      - **🎯 Savings Plan:** Adjust **[expense category]** by **X%** to save an extra **$XX per year**.

      ---

      ### 💡 Smart Optimization Strategies
      - **💰 Small Habit, Big Impact:** If the user [switches to a cheaper grocery store, meal preps, cancels unused memberships], they could save **$X,XXX per year**.
      - **🚀 High ROI Adjustments:** Reallocating **$XX/month** from [luxury expenses] to **investments/emergency fund** could yield **$XX,XXX in X years**.
      - **🛒 Smarter Spending Strategy:** Consider bulk-buying **[frequent expense]**, which could reduce costs by **XX%**.
      - **📉 Expense Challenge:** Try a **"No-Spend Week"** for non-essentials to unlock an extra **$XX** in savings.

      ---

      ### 🔮 Future-Proofing Your Finances
      - **📅 Seasonal Spending Warning:** Historically, you spend **XX% more** on **[category]** during [upcoming months].
      - **🚨 Potential Cashflow Issue:** If current spending trends continue, your balance may drop below **$X,XXX** by [future date].
      - **⚡ Proactive Fix:** Adjust **[specific category]** now to prevent financial strain in upcoming months.

      ---

      ### 🏦 Smart Money Moves (Beyond Budgeting)
      - **📈 Investment Readiness Check:** Based on current savings habits, you could allocate **$XX/month** to [investment type].
      - **📊 Debt-Free Faster:** Paying **$XX extra per month** on [loan name] could save **$X,XXX in interest** and cut **X months** off repayment time.
      - **🔄 Automate Savings:** If you set up an automatic transfer of **$XX/week** into savings, you'll have **$X,XXX extra in X months**.

      ---

      ### 🤖 AI-Generated Personalized Action Plan
      - **🔥 Top Opportunity:** [Example: "Switching from daily café coffee to home-brewed coffee saves $1,200/year."]
      - **📢 Urgent Adjustment:** [Example: "Your utility bill has increased by 20%—consider energy-saving adjustments."]
      - **🎯 30-Day Challenge:** Try **[specific habit shift]** to free up **$XX for savings or debt reduction**.
      - **💡 AI Tip:** [Example: "You spend 25% more on weekends—batch cooking meals could cut food costs by 15%."]

      ---

      PROMPT

    def initialize(user)
      @user = user
      @incomes = user.incomes.includes(:account)
      @budget_items = user.budget_items
      @transactions = user.transactions.includes(:account, :recipient_account)
      @accounts = user.accounts
    end

    def generate
      client = ChatGpt::Client.new
      messages = build_messages

      client.get_completion(messages)
    end

    private

    def build_messages
      [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: build_user_prompt }
      ]
    end

    def build_user_prompt
      <<~PROMPT
        Please analyze the following financial data and provide detailed insights:

        Account Summary:
        #{accounts_data.to_json}

        Income Data:
        #{incomes_data.to_json}

        Budget Item Data:
        #{budget_items_data.to_json}

        Transaction Data:
        #{transactions_data.to_json}

        Focus on identifying patterns, anomalies, and providing actionable recommendations#{' '}
        for better budget management. Consider the relationships between accounts, transactions, and budget items.
      PROMPT
    end

    def accounts_data
      @accounts_data ||= @accounts.map do |account|
        {
          name: account.name,
          type: account.account_type,
          balance: account.balance,
          currency: account.currency,
          is_owned: account.is_owned,
          description: account.description
        }
      end
    end

    def incomes_data
      @incomes_data ||= @incomes.map do |income|
        {
          name: income.name,
          amount: income.amount,
          frequency: income.frequency,
          last_received_at: income.last_received_at,
          account: {
            name: income.account&.name,
            type: income.account&.account_type,
            currency: income.account&.currency
          }
        }
      end
    end

    def budget_items_data
      @budget_items_data ||= @budget_items.map do |budget_item|
        {
          name: budget_item.name,
          amount: budget_item.amount,
          category: budget_item.category,
          frequency: budget_item.frequency,
          last_paid_at: budget_item.last_paid_at,
          is_pending: budget_item.pending?,
          is_paid: budget_item.paid?
        }
      end
    end

    def transactions_data
      @transactions_data ||= @transactions.map do |transaction|
        {
          amount: transaction.amount,
          category: transaction.category,
          frequency: transaction.frequency,
          executed_at: transaction.executed_at,
          transaction_type: transaction.transaction_type,
          description: transaction.description,
          account: {
            name: transaction.account.name,
            type: transaction.account.account_type,
            currency: transaction.account.currency
          },
          recipient_account: transaction.recipient_account ? {
            name: transaction.recipient_account.name,
            type: transaction.recipient_account.account_type,
            currency: transaction.recipient_account.currency
          } : nil
        }
      end
    end
  end
end
