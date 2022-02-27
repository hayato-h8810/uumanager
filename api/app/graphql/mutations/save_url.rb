# frozen_string_literal: true

module Mutations
  class SaveUrl < BaseMutation
    argument :url, InputTypes::UrlInput, required: true

    argument :folder_name, String, required: false

    field :folder, ObjectTypes::Folder, null: false

    def resolve(url:, folder_name: nil)
      user = context[:current_user]
      # フォルダーの指定がなかった場合、ユーザーごとに作成されるデフォルトのフォルダーを使用する。
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
        { folder: {
          id: origin_folder.id,
          name: origin_folder.name,
          urls: [{
            id: new_url.id,
            title: new_url.title,
            memo: new_url.memo,
            notification: new_url.notification,
            url: new_url.url,
            folder_id: new_url.folder_id,
            importance: new_url.importance
          }]
        } }
      # フォルダーが指定されていて、そのフォルダーが既に存在している場合。
      elsif user.folders.find_by(name: folder_name)
        specified_folder = user.folders.find_by(name: folder_name)
        new_url = specified_folder.urls.create(
          title: url.title,
          memo: url.memo,
          url: url.url,
          importance: url.importance,
          notification: url.notification
        )
        { folder: {
          id: specified_folder.id,
          name: specified_folder.name,
          urls: [{
            id: new_url.id,
            title: new_url.title,
            memo: new_url.memo,
            notification: new_url.notification,
            url: new_url.url,
            folder_id: new_url.folder_id,
            importance: new_url.importance
          }]
        } }
      # 指定されたフォルダーがまだ一度も作成されていない場合。
      else
        new_folder = user.folders.create(name: folder_name)
        new_url = new_folder.urls.create(
          title: url.title,
          memo: url.memo,
          url: url.url,
          importance: url.importance,
          notification: url.notification
        )
        { folder: {
          id: new_folder.id,
          name: new_folder.name,
          urls: [{
            id: new_url.id,
            title: new_url.title,
            memo: new_url.memo,
            notification: new_url.notification,
            url: new_url.url,
            folder_id: new_url.folder_id,
            importance: new_url.importance
          }]
        } }
      end
    end
  end
end
