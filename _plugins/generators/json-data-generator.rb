# frozen_string_literal: true

require 'json'

module Jekyll
  class JSONDataGenerator < Generator
    priority :low

    def generate(site)
      path = 'data/build_settings.json'
      Dir.mkdir(File.dirname(path)) unless File.exist?(File.dirname(path))
      File.write(path, site.data['build_settings'].to_json)
    end
  end
end
