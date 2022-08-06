# frozen_string_literal: true

def create_string_depend_on_the_environments
  if Rails.env.development?
    'http://localhost:8000'
  elsif Rails.env.production?
    'https://uumanager.com'
  end
end
