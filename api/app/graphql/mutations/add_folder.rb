# frozen_string_literal: true

module Mutations
  class AddFolder < BaseMutation
    argument :folder_name, String, required: true

    type ObjectTypes::Folder

    def resolve(folder_name:)
      user = context[:current_user]

      newFolder=user.folders.create(name:folder_name)

      {name:newFolder.name, id:newFolder.id,urls:[]}
    end
  end
end
