require './app'

map "/assets" do
  run App.sprockets
end

map "/" do
  run App
end