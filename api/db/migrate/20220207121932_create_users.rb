# frozen_string_literal: true

class CreateUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :users do |t|
      t.string :name
      t.string :email
      t.string :password_digest

      t.string :confirmation_email
      t.datetime :confirmation_sent_at

      t.string :reset_password_token
      t.datetime :reset_password_sent_at

      t.timestamps
    end
  end
end
