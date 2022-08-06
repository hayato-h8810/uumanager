rails c << EOS

  if User.find_by(email:'sample_user@example.com') then

    sample_user=User.find_by(email:'sample_user@example.com')
    sample_user.update(name:'sample_user')

    sample_user.folders.destroy_all

    rails_folder=sample_user.folders.create(name:'rails')
    react_folder=sample_user.folders.create(name:'react')
    nginx_folder=sample_user.folders.create(name:'nginx')
    docker_folder=sample_user.folders.create(name:'docker')
    graphql_folder=sample_user.folders.create(name:'graphql')
    aws_folder=sample_user.folders.create(name:'aws')

    rails_folder.urls.create(
      [
        {notification:Time.new.strftime('%F'),importance:5,url:'https://api.rubyonrails.org/',title:'rails公式ドキュメント',memo:''},
        {notification:Time.new.ago(2.days).strftime('%F'),importance:5,url:'https://railsguides.jp/',title:'railsガイド',memo:'日本語のサイト'},
        {notification:Time.new.since(1.days).strftime('%F'),importance:1,url:'https://qiita.com/annaaida/items/81d8a3f1b7ae3b52dc2b',title:'action mailer',memo:'メール送信機能の実装。'},
        {notification:Time.new.since(9.days).strftime('%F'),importance:2,url:'https://qiita.com/mmmm/items/efda48f1ac0267c95c29',title:'日付操作',memo:'日付をずらす時に使う。'},
        {importance:1,url:'https://pikawaka.com/rails/dotenv-rails',title:'dotenv-rails',memo:'環境変数ファイルの設定方法。'},
        {notification:Time.new.since(3.months).strftime('%F'),importance:2,url:'https://qiita.com/yumikokh/items/b5fd604e12720027b4d5',title:'corsの設定',memo:'railsをapiとして使う場合の設定。'},
        {notification:Time.new.since(8.days).strftime('%F'),importance:3,url:'https://qiita.com/tatane616/items/c00182179e498aa9c53e',title:'bcryptについて',memo:'パスワードのハッシュ化。'},
        {notification:Time.new.since(10.days).strftime('%F'),importance:2,url:'https://qiita.com/piggydev/items/074e020e07af7ebc872d',title:'rubocopについて',memo:'フォーマットなどのgem'}
      ]
    ).each_with_index do |url,i|
      url.browsingHistories.create(date:Time.new.ago(i.days).strftime('%F'),user_id:sample_user.id)
    end

    react_folder.urls.create(
      [
        {notification:Time.new.since(7.days).strftime('%F'),importance:5,url:'https://reactjs.org/',title:'react公式ドキュメント',memo:''},
        {notification:Time.new.since(1.days).strftime('%F'),importance:5,url:'https://www.typescriptlang.org/',title:'typescript公式',memo:''},
        {notification:Time.new.since(1.days).strftime('%F'),importance:5,url:'https://js.studio-kingdom.com/typescript/',title:'typescript公式(日本語)',memo:''},
        {notification:Time.new.since(1.months).strftime('%F'),importance:2,url:'https://qiita.com/Sotq_17/items/7c7ab9880597336b3ee5',title:'ディレクトリ構成について',memo:'ディレクトリ構成の一例'},
        {notification:Time.new.ago(3.days).strftime('%F'),importance:3,url:'https://zenn.dev/nekoniki/articles/f8600d1ab7d908',title:'styled-components',memo:'typescriptとstyled-components'},
        {notification:Time.new.since(15.days).strftime('%F'),importance:4,url:'https://www.ey-office.com/blog_archive/2022/03/03/learned-the-proxy-setting-of-create-react-app/',title:'proxyについて',memo:''},
        {notification:Time.new.since(29.days).strftime('%F'),importance:3,url:'https://zenn.dev/ro_komatsuna/articles/eslint_setup',title:'eslintとprettier',memo:'フォーマットなど'}
      ]
    ).each_with_index do |url,i|
      url.browsingHistories.create(date:Time.new.ago(i.days).strftime('%F'),user_id:sample_user.id)
    end

    nginx_folder.urls.create(
      [
        {notification:Time.new.since(39.days).strftime('%F'),importance:5,url:'https://www.nginx.com/',title:'nginx公式サイト',memo:''},
        {notification:Time.new.ago(12.days).strftime('%F'),importance:5,url:'https://www.nginx.co.jp/',title:'nginx日本公式サイト',memo:''}
      ]
    ).each_with_index do |url,i|
      url.browsingHistories.create(date:Time.new.ago(i.days).strftime('%F'),user_id:sample_user.id)
    end

    docker_folder.urls.create(
      [
        {notification:Time.new.ago(1.days).strftime('%F'),importance:5,url:'https://docs.docker.com/',title:'docker公式',memo:''},
        {notification:Time.new.since(22.days).strftime('%F'),importance:3,url:'https://qiita.com/nimusukeroku/items/72bc48a8569a954c7aa2',title:'コマンド一覧',memo:''},
        {notification:Time.new.since(3.days).strftime('%F'),importance:4,url:'https://mebee.info/2021/08/05/post-40153/',title:'ipアドレス確認',memo:'コンテナのipアドレス確認方法'},
        {notification:Time.new.since(14.days).strftime('%F'),importance:4,url:'https://zenn.dev/ryuu/scraps/a1efb79aaa1bb2',title:'コンテナとイメージ全削除',memo:'全てのコンテナ、またはイメージをまとめて削除するコマンド'}
      ]
    ).each_with_index do |url,i|
      url.browsingHistories.create(date:Time.new.ago(i.days).strftime('%F'),user_id:sample_user.id)
    end

    graphql_folder.urls.create(
      [
        {notification:Time.new.since(18.days).strftime('%F'),importance:5,url:'https://www.apollographql.com/docs/react/',title:'apollo client 公式',memo:'reactでgraphqlを使う場合の公式ドキュメント'},
        {notification:Time.new.since(16.days).strftime('%F'),importance:5,url:'https://graphql-ruby.org/',title:'graphql-rubyのドキュメント',memo:'railsでgraphqlを使う場合の公式ドキュメント'}
      ]
    ).each_with_index do |url,i|
      url.browsingHistories.create(date:Time.new.ago(i.days).strftime('%F'),user_id:sample_user.id)
    end

    aws_folder.urls.create(
      [
        {notification:Time.new.since(2.days).strftime('%F'),importance:4,url:'https://weseek.co.jp/tech/2196/',title:'awsの設定方法',memo:''},
        {notification:Time.new.since(12.days).strftime('%F'),importance:2,url:'https://qiita.com/sayama0402/items/011644191dfdbde9c646',title:'awsと、Let\'s Encrypt',memo:'ssl証明書のダウンロード方法。'},
        {notification:Time.new.since(15.days).strftime('%F'),importance:5,url:'https://aws.amazon.com/jp/',title:'aws公式',memo:''}
      ]
    ).each_with_index do |url,i|
      url.browsingHistories.create(date:Time.new.ago(i.days).strftime('%F'),user_id:sample_user.id)
    end

  else

    sample_user=User.create(name:'sample_user',email:'sample_user@example.com',password:'sample_user')

    rails_folder=sample_user.folders.create(name:'rails')
    react_folder=sample_user.folders.create(name:'react')
    nginx_folder=sample_user.folders.create(name:'nginx')
    docker_folder=sample_user.folders.create(name:'docker')
    graphql_folder=sample_user.folders.create(name:'graphql')
    aws_folder=sample_user.folders.create(name:'aws')

    rails_folder.urls.create(
      [
        {notification:Time.new.strftime('%F'),importance:5,url:'https://api.rubyonrails.org/',title:'rails公式ドキュメント',memo:''},
        {notification:Time.new.ago(2.days).strftime('%F'),importance:5,url:'https://railsguides.jp/',title:'railsガイド',memo:'日本語のサイト'},
        {notification:Time.new.since(1.days).strftime('%F'),importance:1,url:'https://qiita.com/annaaida/items/81d8a3f1b7ae3b52dc2b',title:'action mailer',memo:'メール送信機能の実装。'},
        {notification:Time.new.since(9.days).strftime('%F'),importance:2,url:'https://qiita.com/mmmm/items/efda48f1ac0267c95c29',title:'日付操作',memo:'日付をずらす時に使う。'},
        {importance:1,url:'https://pikawaka.com/rails/dotenv-rails',title:'dotenv-rails',memo:'環境変数ファイルの設定方法。'},
        {notification:Time.new.since(3.months).strftime('%F'),importance:2,url:'https://qiita.com/yumikokh/items/b5fd604e12720027b4d5',title:'corsの設定',memo:'railsをapiとして使う場合の設定。'},
        {notification:Time.new.since(8.days).strftime('%F'),importance:3,url:'https://qiita.com/tatane616/items/c00182179e498aa9c53e',title:'bcryptについて',memo:'パスワードのハッシュ化。'},
        {notification:Time.new.since(10.days).strftime('%F'),importance:2,url:'https://qiita.com/piggydev/items/074e020e07af7ebc872d',title:'rubocopについて',memo:'フォーマットなどのgem'}
      ]
    ).each_with_index do |url,i|
      url.browsingHistories.create(date:Time.new.ago(i.days).strftime('%F'),user_id:sample_user.id)
    end

    react_folder.urls.create(
      [
        {notification:Time.new.since(7.days).strftime('%F'),importance:5,url:'https://reactjs.org/',title:'react公式ドキュメント',memo:''},
        {notification:Time.new.since(1.days).strftime('%F'),importance:5,url:'https://www.typescriptlang.org/',title:'typescript公式',memo:''},
        {notification:Time.new.since(1.days).strftime('%F'),importance:5,url:'https://js.studio-kingdom.com/typescript/',title:'typescript公式(日本語)',memo:''},
        {notification:Time.new.since(1.months).strftime('%F'),importance:2,url:'https://qiita.com/Sotq_17/items/7c7ab9880597336b3ee5',title:'ディレクトリ構成について',memo:'ディレクトリ構成の一例'},
        {notification:Time.new.ago(3.days).strftime('%F'),importance:3,url:'https://zenn.dev/nekoniki/articles/f8600d1ab7d908',title:'styled-components',memo:'typescriptとstyled-components'},
        {notification:Time.new.since(15.days).strftime('%F'),importance:4,url:'https://www.ey-office.com/blog_archive/2022/03/03/learned-the-proxy-setting-of-create-react-app/',title:'proxyについて',memo:''},
        {notification:Time.new.since(29.days).strftime('%F'),importance:3,url:'https://zenn.dev/ro_komatsuna/articles/eslint_setup',title:'eslintとprettier',memo:'フォーマットなど'}
      ]
    ).each_with_index do |url,i|
      url.browsingHistories.create(date:Time.new.ago(i.days).strftime('%F'),user_id:sample_user.id)
    end

    nginx_folder.urls.create(
      [
        {notification:Time.new.since(39.days).strftime('%F'),importance:5,url:'https://www.nginx.com/',title:'nginx公式サイト',memo:''},
        {notification:Time.new.ago(12.days).strftime('%F'),importance:5,url:'https://www.nginx.co.jp/',title:'nginx日本公式サイト',memo:''}
      ]
    ).each_with_index do |url,i|
      url.browsingHistories.create(date:Time.new.ago(i.days).strftime('%F'),user_id:sample_user.id)
    end

    docker_folder.urls.create(
      [
        {notification:Time.new.ago(1.days).strftime('%F'),importance:5,url:'https://docs.docker.com/',title:'docker公式',memo:''},
        {notification:Time.new.since(22.days).strftime('%F'),importance:3,url:'https://qiita.com/nimusukeroku/items/72bc48a8569a954c7aa2',title:'コマンド一覧',memo:''},
        {notification:Time.new.since(3.days).strftime('%F'),importance:4,url:'https://mebee.info/2021/08/05/post-40153/',title:'ipアドレス確認',memo:'コンテナのipアドレス確認方法'},
        {notification:Time.new.since(14.days).strftime('%F'),importance:4,url:'https://zenn.dev/ryuu/scraps/a1efb79aaa1bb2',title:'コンテナとイメージ全削除',memo:'全てのコンテナ、またはイメージをまとめて削除するコマンド'}
      ]
    ).each_with_index do |url,i|
      url.browsingHistories.create(date:Time.new.ago(i.days).strftime('%F'),user_id:sample_user.id)
    end

    graphql_folder.urls.create(
      [
        {notification:Time.new.since(18.days).strftime('%F'),importance:5,url:'https://www.apollographql.com/docs/react/',title:'apollo client 公式',memo:'reactでgraphqlを使う場合の公式ドキュメント'},
        {notification:Time.new.since(16.days).strftime('%F'),importance:5,url:'https://graphql-ruby.org/',title:'graphql-rubyのドキュメント',memo:'railsでgraphqlを使う場合の公式ドキュメント'}
      ]
    ).each_with_index do |url,i|
      url.browsingHistories.create(date:Time.new.ago(i.days).strftime('%F'),user_id:sample_user.id)
    end

    aws_folder.urls.create(
      [
        {notification:Time.new.since(2.days).strftime('%F'),importance:4,url:'https://weseek.co.jp/tech/2196/',title:'awsの設定方法',memo:''},
        {notification:Time.new.since(12.days).strftime('%F'),importance:2,url:'https://qiita.com/sayama0402/items/011644191dfdbde9c646',title:'awsと、Let\'s Encrypt',memo:'ssl証明書のダウンロード方法。'},
        {notification:Time.new.since(15.days).strftime('%F'),importance:5,url:'https://aws.amazon.com/jp/',title:'aws公式',memo:''}
      ]
    ).each_with_index do |url,i|
      url.browsingHistories.create(date:Time.new.ago(i.days).strftime('%F'),user_id:sample_user.id)
    end

  end

  exit
EOS
