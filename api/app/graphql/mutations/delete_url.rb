# frozen_string_literal: true

module Mutations
  class DeleteUrl < BaseMutation
    argument :url_id, String, required: true

    argument :folder_id, String, required: true

    type ObjectTypes::Folder

    def resolve(url_id:, folder_id:)
      user = context[:current_user]

      return unless user.folders.find_by(id: folder_id).urls.find_by(id: url_id)

      selectedFolder = Folder.find_by(id: folder_id)
      selectedUrls = selectedFolder.urls.all
      user.folders.find_by(id: folder_id).urls.find_by(id: url_id).destroy

      { id: selectedFolder.id, name: selectedFolder.name, urls: selectedUrls }
    end
  end
end
