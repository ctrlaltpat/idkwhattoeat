class CreateUserPlaces < ActiveRecord::Migration[5.2]
  def change
    create_table :user_places do |t|
      t.string :placeObj
      t.integer :user_id

      t.timestamps
    end
  end
end
