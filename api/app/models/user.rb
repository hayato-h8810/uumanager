# frozen_string_literal: true

class User < ApplicationRecord
  has_secure_password

  has_many :folders, dependent: :destroy
  has_many :urls, through: :folders, dependent: :destroy
  has_many :visitingHistorys, through: :urls, dependent: :destroy

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
end
