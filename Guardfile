require './app'

guard 'sprockets2', :sprockets => App.sprockets, :precompile => App.precompile do
  watch(%r{^assets/.+$})
  watch('app.rb')
end