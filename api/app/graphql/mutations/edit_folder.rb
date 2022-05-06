# frozen_string_literal: true

module Mutations
  class EditFolder < BaseMutation
    argument :folder_id, String, required: true

    argument :folder_name, String, required: true

    type ObjectTypes::Folder

    def resolve(folder_id:, folder_name:)
      user = context[:current_user]

      return unless selectedFolder = user.folders.find_by(id: folder_id)

      selectedFolder.update(name: folder_name)

      folder = Folder.find(folder_id)

      { id: folder.id, name: folder.name, urls: folder.urls.all }
    end
  end
end
