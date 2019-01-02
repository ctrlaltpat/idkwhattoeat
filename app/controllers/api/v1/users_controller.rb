class Api::V1::UsersController < ApplicationController

  def signin
    @user = User.find_by(username: params[:username])
    if @user && @user.authenticate(params[:password])
      render json: {
        id: @user.id,
        token: issue_token({id: @user.id}),
        username: @user.username,
        firstname: @user.firstname,
        lastname: @user.lastname,
        email: @user.email,
        cuisine: @user.user_setting.cuisine,
        radius: @user.user_setting.radius,
        history: @user.user_places
      }
    else
      render json: {error: 'Username/password invalid.', log: @user.errors.full_messages}, status: 401
    end
  end

  def signup
    @user = User.new(user_params)
    if @user.valid?
      @user.save
      @user.create_user_setting(cuisine:'', radius: 500)
      @user.user_places.none
      user = @user
      if user
        render json: {
          id: user.id,
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          cuisine: user.user_setting.cuisine,
          radius: user.user_setting.radius
        }
      else
        render json: {error: 'wrong', log: @user.errors.full_messages}, status: 401
      end
    end
  end
  
  def validate
    @user = get_current_user
    if @user
      render json: {
        id: @user.id,
        token: issue_token({id: @user.id}),
        username: @user.username,
        firstname: @user.firstname,
        lastname: @user.lastname,
        email: @user.email,
        cuisine: @user.user_setting.cuisine,
        radius: @user.user_setting.radius,
        history: @user.user_places.order('id DESC')
      }
    else
      render json: {error: 'Username/password invalid.'}, status: 401
    end
  end

  def user_params
    params.require(:user).permit(:username, :firstname, :lastname, :email, :password)
  end
end
