# frozen_string_literal: true

module Mutations
  class DeleteFolder < BaseMutation
    argument :folder_id, String, required: true

    type ObjectTypes::Folder

    def resolve(folder_id:)
      user = context[:current_user]

      return unless selectedFolder = user.folders.find_by(id: folder_id)

      selectedFolder.destroy
    end
  end
end
