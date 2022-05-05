# frozen_string_literal: true

module Mutations
  class DeleteUrl < BaseMutation
    argument :url_id, String, required: true

    type ObjectTypes::Folder

    def resolve(url_id:)
      selectUrl = Url.find(url_id)
      selectedFolder = Folder.find(selectUrl.folder_id)
      selectUrl.destroy
      selectedUrls = selectedFolder.urls.all

      { id: selectedFolder.id, name: selectedFolder.name, urls: selectedUrls }
    end
  end
end
