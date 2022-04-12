# frozen_string_literal: true

class CreateBrowsingHistories < ActiveRecord::Migration[6.1]
  def change
    create_table :browsing_histories do |t|
      t.string :date
      t.references :url, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
