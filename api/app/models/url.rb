# frozen_string_literal: true

class Url < ApplicationRecord
  validates :url, presence: true

  belongs_to :user
  belongs_to :folder
  has_many :visitingHistorys, dependent: :destroy
end
