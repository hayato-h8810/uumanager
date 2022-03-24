# frozen_string_literal: true

module Mutations
  class SaveUrl < BaseMutation
    argument :url, InputTypes::UrlInput, required: true
    argument :folder_id, String, required: false
    argument :folder_name, String, required: false

    type ObjectTypes::Folder

    def resolve(url:, folder_name: nil, folder_id: nil)
      user = context[:current_user]
      # フォルダーの指定がなかった場合、ユーザーごとに作成されるデフォルトのフォルダーを使用する。
      if !folder_name && !folder_id
        origin_folder = if !user.folders.find_by(origin: 'true')
                          user.folders.create(name: 'root', origin: 'true')
                        else
                          user.folders.find_by(origin: 'true')
                        end
        origin_folder.urls.create(
          title: url.title,
          memo: url.memo,
          url: url.url,
          importance: url.importance,
          notification: url.notification
        )

        { id: origin_folder.id, name: origin_folder.name, urls: origin_folder.urls.all }
      # フォルダーが指定されていて、そのフォルダーが既に存在している場合。
      elsif folder_id
        specified_folder = user.folders.find_by(id: folder_id)
        specified_folder.urls.create(
          title: url.title,
          memo: url.memo,
          url: url.url,
          importance: url.importance,
          notification: url.notification
        )

        { id: specified_folder.id, name: specified_folder.name, urls: specified_folder.urls.all }
      # 指定されたフォルダーがまだ一度も作成されていない場合。
      else
        new_folder = user.folders.create(name: folder_name)
        new_folder.urls.create(
          title: url.title,
          memo: url.memo,
          url: url.url,
          importance: url.importance,
          notification: url.notification
        )

        { id: new_folder.id, name: new_folder.name, urls: new_folder.urls.all }
      end
    end
  end
end
