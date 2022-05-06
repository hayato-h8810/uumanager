# frozen_string_literal: true

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

ActiveRecord::Schema.define(version: 20_220_407_015_141) do
  # These are extensions that must be enabled in order to support this database
  enable_extension 'plpgsql'

  create_table 'browsing_histories', force: :cascade do |t|
    t.string 'date'
    t.bigint 'url_id', null: false
    t.bigint 'user_id', null: false
    t.datetime 'created_at', precision: 6, null: false
    t.datetime 'updated_at', precision: 6, null: false
    t.index ['url_id'], name: 'index_browsing_histories_on_url_id'
    t.index ['user_id'], name: 'index_browsing_histories_on_user_id'
  end

  create_table 'folders', force: :cascade do |t|
    t.string 'name'
    t.integer 'user_id'
    t.datetime 'created_at', precision: 6, null: false
    t.datetime 'updated_at', precision: 6, null: false
  end

  create_table 'login_histories', force: :cascade do |t|
    t.string 'date'
    t.bigint 'user_id', null: false
    t.datetime 'created_at', precision: 6, null: false
    t.datetime 'updated_at', precision: 6, null: false
    t.index ['user_id'], name: 'index_login_histories_on_user_id'
  end

  create_table 'urls', force: :cascade do |t|
    t.date 'notification'
    t.integer 'importance'
    t.string 'url'
    t.string 'title'
    t.string 'memo'
    t.integer 'folder_id'
    t.datetime 'created_at', precision: 6, null: false
    t.datetime 'updated_at', precision: 6, null: false
  end

  create_table 'users', force: :cascade do |t|
    t.string 'name'
    t.string 'email'
    t.string 'password_digest'
    t.datetime 'created_at', precision: 6, null: false
    t.datetime 'updated_at', precision: 6, null: false
  end

  add_foreign_key 'browsing_histories', 'urls'
  add_foreign_key 'browsing_histories', 'users'
  add_foreign_key 'login_histories', 'users'
end
