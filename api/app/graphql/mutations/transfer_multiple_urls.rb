# frozen_string_literal: true

module Mutations
  class TransferMultipleUrls < BaseMutation
    class FolderAndUrlId < Types::BaseInputObject
      argument :folder_id, String, required: true
      argument :url_id, [String], required: false
    end

    argument :folder_and_url_id, [FolderAndUrlId], required: true

    type [ObjectTypes::Folder]

    def resolve(folder_and_url_id:)
      folder_and_url_id.map do |folder_and_url|
        folder_and_url.url_id&.map do |url|
          Url.find(url).update(folder_id: folder_and_url.folder_id)
        end
      end

      [Folder.find(folder_and_url_id[0].folder_id), Folder.find(folder_and_url_id[1].folder_id)]
    end
  end
end
