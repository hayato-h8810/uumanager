# frozen_string_literal: true

class BrowsingHistory < ApplicationRecord
  belongs_to :url
  belongs_to :user
end
