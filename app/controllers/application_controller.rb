class ApplicationController < ActionController::Base
  def issue_token(data)
    JWT.encode(data, secret)
  end

  def get_current_user
    id = decoded_token['id']
    User.find_by(id: id)
  end

  def decoded_token
    token = request.headers['Authorization']
    begin
      JWT.decode(token, secret).first
    rescue JWT::DecodeError
      {}
    end
  end
  
  def secret
    ENV['MY_SUPER_SECRET'] || "123456" # remove before deploy
  end
end
