class User < ApplicationRecord
  validates :username, uniqueness: true, presence: true
  has_secure_password

  has_one :user_setting
  has_many :user_places
end
