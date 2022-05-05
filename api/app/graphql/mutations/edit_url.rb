# frozen_string_literal: true

module Mutations
  class EditUrl < BaseMutation
    argument :url, InputTypes::UrlInput, required: true
    argument :url_id, String, required: true
    argument :folder_id, String, required: false
    argument :new_folder_name, String, required: false

    type [ObjectTypes::Folder]

    def resolve(url:, url_id:, folder_id: nil, new_folder_name: nil)
      return unless editUrl = Url.find_by(id: url_id)

      user = context[:current_user]

      if new_folder_name
        previousFolderId = editUrl.folder_id
        newFolder = user.folders.create(name: new_folder_name)
        editUrl.update(title: url.title,
                       memo: url.memo,
                       url: url.url,
                       importance: url.importance,
                       notification: url.notification,
                       folder_id: newFolder.id)

        [Folder.find(previousFolderId), Folder.find(newFolder.id)]
      elsif folder_id
        previousFolderId = editUrl.folder_id
        editUrl.update(title: url.title,
                       memo: url.memo,
                       url: url.url,
                       importance: url.importance,
                       notification: url.notification,
                       folder_id: folder_id)

        [Folder.find(previousFolderId), Folder.find(folder_id)]
      else
        return unless editUrl.update(title: url.title,
                                     memo: url.memo,
                                     url: url.url,
                                     importance: url.importance,
                                     notification: url.notification)

        [Folder.find(editUrl.folder_id)]
      end
    end
  end
end
