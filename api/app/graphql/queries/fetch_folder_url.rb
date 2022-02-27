# frozen_string_literal: true

module Queries
  class FetchFolderUrl < Queries::BaseQuery
    null true

    type [ObjectTypes::Folder], null: true

    def resolve
      user = context[:current_user]
      return if user.folders.all.blank?

      folders_array = user.folders.all
      folder_urls_array = []
      folders_array.map do |folder|
        folder_urls_array.push({ id: folder.id, name: folder.name, urls: folder.urls.all })
      end
      folder_urls_array
    end
  end
end
