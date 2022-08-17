## UUManager
UUManagerは、ネットを使って調べ物をしたり、資料集めをしたいと言うような需要を満たす為に制作されたアプリです。  
サイトのurlを保存するといった基本的な機能以外にも、保存したurlごとに通知日を設定したり、独自のタイトルを付与出来る機能など、多くのニーズに答えられることを心掛けました。その他の機能に付きましては、下記の機能一覧をご参照ください。  
 

![titleLogo](https://user-images.githubusercontent.com/91232959/185062742-23bb99c1-c454-4743-96c1-06669a9545e0.png)

## URL
https://uumanager.com/

## サンプルアカウント
 - email: `sample_user@example.com`
 - password: `sample_user`

## 機能一覧
- ユーザー登録、ログイン機能
- url保存機能
  - お気に入り機能(mui)
  - タイトル機能
  - コメント機能
  - 通知機能
  - フォルダー作成機能
- url一覧機能
  - 検索機能
  - sort機能
  - リンク機能
  - ページネーション機能(mui)
- カレンダー機能(fullcalendar)
- 閲覧履歴機能
- ログイン履歴機能(chart.js)

## AWS構成図
![configurationDiagram drawio](https://user-images.githubusercontent.com/91232959/184792748-1ee8ef01-d536-4ade-b7c3-23c0cfdab3a7.png)

## 使用技術
- Ruby 2.7.4
- Ruby on Rails 6.1.4.4
- PostgreSQL 14.4
- Puma 5.0
- Typescript 4.5.5
- React 17.0.2
- Nginx
- Docker/Docker-compose
- AWS
  - VPC
  - EC2
  - Route53
- cypress 9.4.1
