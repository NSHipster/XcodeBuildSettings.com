# frozen_string_literal: true

require 'csv'

module Jekyll
  class CSVDataGenerator < Generator
    priority :low

    def generate(site)
      path = 'data/build_settings.csv'
      Dir.mkdir(File.dirname(path)) unless File.exist?(File.dirname(path))

      CSV.open(path, 'wb') do |csv|
        csv << %w[id name description]
        site.data['build_settings'].each do |key, value|
          csv << [key, value['name'], value['description']]
        end
      end
    end
  end
end
