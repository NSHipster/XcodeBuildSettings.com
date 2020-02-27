# frozen_string_literal: true

require 'bundler'
Bundler.require

require 'rake/clean'

require 'json'

directory '_data'

directory '_data/build_settings'
CLEAN << '_data/build_settings'

task default: ['_data/build_settings'] do |t|
  Dir['/Applications/Xcode.app/Contents/Plugins/**/*.strings'].each do |path|
    build_settings = {}

    plist = CFPropertyList::List.new(file: path)
    strings = CFPropertyList.native_types(plist.value)

    strings.each do |key, value|
      case key
      when /^\[(.+)\]-name$/
        build_settings[Regexp.last_match(1)] ||= {}
        build_settings[Regexp.last_match(1)][:name] = value
      when /^\[(.+)\]-description$/
        build_settings[Regexp.last_match(1)] ||= {}
        build_settings[Regexp.last_match(1)][:description] = value
      when /^\[(.+)\]-description-\[(.+)\]$/
        build_settings[Regexp.last_match(1)] ||= {}
        build_settings[Regexp.last_match(1)][:values] ||= {}
        build_settings[Regexp.last_match(1)][:values][Regexp.last_match(2)] = value
      end
    end

    next if build_settings.empty?

    filename = File.join(t.source, File.basename(path, '.strings')) + '.json'
    File.write(filename, build_settings.to_json)
  end
end
