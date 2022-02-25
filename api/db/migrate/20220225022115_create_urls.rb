# frozen_string_literal: true

class CreateUrls < ActiveRecord::Migration[6.1]
  def change
    create_table :urls do |t|
      t.date :notification
      t.integer :importance
      t.string :url
      t.string :title
      t.string :memo
      t.integer :folder_id

      t.timestamps
    end
  end
end
