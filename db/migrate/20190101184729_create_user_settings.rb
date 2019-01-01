class CreateUserSettings < ActiveRecord::Migration[5.2]
  def change
    create_table :user_settings do |t|
      t.string :cuisine
      t.integer :radius
      t.integer :user_id

      t.timestamps
    end
  end
end
