class Api::V1::UserPlacesController < ApplicationController

  def add
    @user = User.find_by(username: places_params[:username])
    new_place = @user.user_places.create(user_id: @user.id, placeObj: places_params[:place])
    if new_place
      render json: {place: new_place}
    else
      render json: {error: "EEERRRRRRROOOOORRRRRR!!!!!"}
    end
  end

  def places_params
    params.require(:user_place).permit(:place, :username)
  end
end
