# frozen_string_literal: true

module InputTypes
  class UrlInput < Types::BaseInputObject
    argument :title, String, required: false
    argument :memo, String, required: false
    argument :url, String, required: true
    argument :notification, String, required: false
    argument :importance, Integer, required: true
  end
end
