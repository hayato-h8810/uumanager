# frozen_string_literal: true

class Url < ApplicationRecord
  validates :url, presence: true

  belongs_to :user, optional: true
  belongs_to :folder
  has_many :browsingHistories, dependent: :destroy
end
