rails c << EOS

  authenticating_users=User.where.not(confirmation_sent_at:nil)

  authenticating_users.each do |user|

    if (Time.new - user.confirmation_sent_at).floor / 3600 >= 1 then
      user.destroy
    end

  end

  exit

EOS
