# frozen_string_literal: true

class Folder < ApplicationRecord
  belongs_to :user
  has_many :urls, dependent: :destroy
end
