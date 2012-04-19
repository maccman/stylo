require 'rubygems'
require 'bundler'
require 'pathname'
require 'sinatra/json'
require 'sinatra/reloader'

Bundler.require

require 'sprockets/commonjs'
require 'stylus/tilt'
require 'stylus/import_processor'

module AssetHelpers
  def asset_path(source)
    '/assets/' + settings.sprockets.find_asset(source).digest_path
  end
end

class App < Sinatra::Base
  set :root, Pathname(File.expand_path('../', __FILE__))
  set :raise_errors, true
  set :show_exceptions, true
  set :sprockets, Sprockets::Environment.new(root)
  set :precompile, [ /\w+\.(?!js|css).+/, /application.(css|js)$/ ]

  configure do
    sprockets.append_path(root.join('assets', 'javascripts'))
    sprockets.append_path(root.join('assets', 'stylesheets'))
    sprockets.append_path(root.join('assets', 'images'))

    sprockets.append_path(root.join('vendor', 'assets', 'javascripts'))
    sprockets.append_path(root.join('vendor', 'assets', 'stylesheets'))

    sprockets.register_engine '.styl', Tilt::StylusTemplate
    sprockets.register_preprocessor 'text/css', Stylus::ImportProcessor
    Stylus.paths.concat sprockets.paths

    sprockets.context_class.instance_eval do
      include AssetHelpers
    end
  end

  helpers Sinatra::JSON

  helpers do
    include AssetHelpers

    def url(path)
      base = "#{request.scheme}://#{request.env['HTTP_HOST']}"
      base + path
    end
  end

  use Rack::Auth::Basic, "Protected Area" do |username, password|
    (username == 'dragon' && password == 'slayer') ||
      (username == 'stylo' && password == 'password1')
  end

  get '/' do
    send_file File.join(settings.public_folder, 'index.html')
  end
end