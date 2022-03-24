# frozen_string_literal: true

class VisitingHistory < ApplicationRecord
  belongs_to :url
  belongs_to :user
end
