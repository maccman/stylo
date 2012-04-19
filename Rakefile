namespace :macgap do
  task :build do
    `macgap build --name Stylo ./public`
  end
end

namespace :pegjs do
  task :build do
    `pegjs assets/javascripts/app/parsers/css.pegjs assets/javascripts/app/parsers/css.module.js`
  end
end