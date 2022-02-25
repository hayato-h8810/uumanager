# frozen_string_literal: true

module Mutations
  class SaveUrl < BaseMutation
    argument :url, InputTypes::UrlInput, required: true

    argument :folder_name, String, required: false

    field :folder, ObjectTypes::Folder, null: false

    def resolve(url:, folder_name: nil)
      user = context[:current_user]
      if !folder_name
        origin_folder = if !user.folders.find_by(origin: 'true')
                          user.folders.create(name: 'root', origin: 'true')
                        else
                          user.folders.find_by(origin: 'true')
                        end
        new_url = origin_folder.urls.create(
          title: url.title,
          memo: url.memo,
          url: url.url,
          importance: url.importance,
          notification: url.notification
        )
        { folder: { id: origin_folder.id, name: origin_folder.name, urls: [new_url] } }
      else
        new_folder = user.folders.create(name: folder_name)
        new_url = new_folder.urls.create(
          title: url.title,
          memo: url.memo,
          url: url.url,
          importance: url.importance,
          notification: url.notification
        )
        { folder: { id: new_folder.id, name: new_folder.name, urls: new_url } }
      end
    end
  end
end
