# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_03_19_212556) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "accounts", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name", null: false
    t.decimal "balance", precision: 15, scale: 2, null: false
    t.string "account_type", null: false
    t.string "currency", default: "COP", null: false
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "is_owned", default: true, null: false
    t.index ["user_id"], name: "index_accounts_on_user_id"
  end

  create_table "budget_items", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name", null: false
    t.decimal "amount", precision: 15, scale: 2, null: false
    t.string "category", null: false
    t.bigint "account_id", null: false
    t.string "frequency", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "last_paid_at"
    t.index ["account_id"], name: "index_budget_items_on_account_id"
    t.index ["category"], name: "index_budget_items_on_category"
    t.index ["frequency"], name: "index_budget_items_on_frequency"
    t.index ["user_id"], name: "index_budget_items_on_user_id"
  end

  create_table "incomes", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name", null: false
    t.decimal "amount", precision: 15, scale: 2, null: false
    t.string "frequency", null: false
    t.bigint "account_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "last_received_at"
    t.index ["account_id"], name: "index_incomes_on_account_id"
    t.index ["user_id"], name: "index_incomes_on_user_id"
  end

  create_table "transactions", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "account_id", null: false
    t.bigint "recipient_account_id"
    t.decimal "amount", precision: 10, scale: 2, null: false
    t.string "transaction_type", null: false
    t.text "description"
    t.datetime "executed_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "item_type"
    t.bigint "item_id"
    t.string "frequency", default: "one_time"
    t.string "category"
    t.index ["account_id"], name: "index_transactions_on_account_id"
    t.index ["category"], name: "index_transactions_on_category"
    t.index ["frequency"], name: "index_transactions_on_frequency"
    t.index ["item_type", "item_id"], name: "index_transactions_on_item"
    t.index ["recipient_account_id"], name: "index_transactions_on_recipient_account_id"
    t.index ["transaction_type"], name: "index_transactions_on_transaction_type"
    t.index ["user_id"], name: "index_transactions_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "password_digest", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "accounts", "users"
  add_foreign_key "budget_items", "accounts"
  add_foreign_key "budget_items", "users"
  add_foreign_key "incomes", "accounts"
  add_foreign_key "incomes", "users"
  add_foreign_key "transactions", "accounts"
  add_foreign_key "transactions", "accounts", column: "recipient_account_id"
  add_foreign_key "transactions", "users"
end
