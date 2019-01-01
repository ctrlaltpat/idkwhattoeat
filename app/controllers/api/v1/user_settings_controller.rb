class Api::V1::UserSettingsController < ApplicationController

  def update
    @user = User.find_by(username: params[:username])
    @user.user_setting.update(cuisine: params[:cuisine], radius: params[:radius])
    render json: {cuisine: @user.user_setting.cuisine, radius: @user.user_setting.radius}
  end

  def settings_params
    params.require(:settings).permit(:cuisine, :radius, :username)
  end
end
