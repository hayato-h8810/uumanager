# frozen_string_literal: true

class CreateFolders < ActiveRecord::Migration[6.1]
  def change
    create_table :folders do |t|
      t.string :name
      t.string :origin
      t.integer :user_id

      t.timestamps
    end
  end
end
