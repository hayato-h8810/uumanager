# frozen_string_literal: true

class CreateLoginHistories < ActiveRecord::Migration[6.1]
  def change
    create_table :login_histories do |t|
      t.string :date
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
