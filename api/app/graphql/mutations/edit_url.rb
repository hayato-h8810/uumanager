# frozen_string_literal: true

module Mutations
  class EditUrl < BaseMutation
    argument :url, InputTypes::UrlInput, required: true
    argument :url_id, String, required: true
    argument :folder_id, String, required: false

    type [ObjectTypes::Folder]

    def resolve(url:, url_id:, folder_id: nil)
      return unless editUrl = Url.find_by(id: url_id)

      if folder_id
        previousFolderId = editUrl.folder_id
        editUrl.update(folder_id: folder_id)
        editUrl.update(title: url.title,
                       memo: url.memo,
                       url: url.url,
                       importance: url.importance,
                       notification: url.notification)

        [Folder.find(previousFolderId), Folder.find(folder_id)]
      else
        editUrl.update(title: url.title,
                       memo: url.memo,
                       url: url.url,
                       importance: url.importance,
                       notification: url.notification)

        [Folder.find(editUrl.folder_id)]
      end
    end
  end
end
