# frozen_string_literal: true

require 'bundler'
Bundler.require

require 'rake/clean'

require 'pp'
require 'json'
require 'open3'
require 'pathname'
require 'parallel'
require 'open-uri'
require 'nokogiri'
require 'reverse_markdown'

CLOBBER << '_site'

directory '_data'

CLEAN << '_data/build_settings.json'
directory '_data/build_settings_groups'
CLEAN << '_data/build_settings_groups'

task default: [:data]

task data: ['_data/build_settings_groups'] do |t|
  build_settings = {}

  xcspec_files = Dir["#{path_to_xcode}/**/*.xcspec"]
  xcspec_files.each do |path|
    next unless json = plutil_to_json(path)

    group_build_settings = {}

    name, description = nil

    entries = case json
              when Hash then [json]
              when Array
                filtered = json.select { |d| d['Type'] == 'BuildSettings' }
                filtered.empty? ? json : filtered
              end

    entries.each do |entry|
      name = canonicalize(entry['Name'])
      description = entry['Description']
      options = entry['Properties'] || entry['Options'] || []

      options.each do |option|
        next unless option_name = option['Name']
        next unless option_name.match?(/^(?!_)[A-Z_]+/)

        group_build_settings[option_name] ||= {}
        group_build_settings[option_name]['name'] = option['DisplayName']
        group_build_settings[option_name]['description'] = option['Description']
        group_build_settings[option_name]['type'] = option['Type']
        group_build_settings[option_name]['default_value'] = option['DefaultValue']
        group_build_settings[option_name]['category'] = option['Category']
        group_build_settings[option_name]['values'] = option['Values']
        group_build_settings[option_name]['command_line_arguments'] = option['CommandLineArgs']
      end
    end

    next if group_build_settings.empty?

    build_settings.merge!(group_build_settings)

    filename = File.join(t.source, normalize(name || File.basename(path, '.*'))) + '.json'

    json = {
      path: path,
      name: name,
      description: description,
      build_settings: group_build_settings.keys.filter { |key| key.match?(/^[A-Z_]+$/) }.sort
    }.to_json

    File.write(filename, json)
  end

  strings_files = (
      xcspec_files.map { |f| f.pathmap('%X') + '.strings' } +
      Dir["#{path_to_xcode}/Contents/PlugIns/**/*.strings"]
    ).uniq

  Parallel.each(strings_files) do |path|
    plist = CFPropertyList::List.new(file: path)
    strings = CFPropertyList.native_types(plist.value)
    next unless strings

    name = canonicalize(strings['Name'] || File.basename(path, '.*'))
    description = strings['Description']

    # filename = File.join(t.source, normalize(name)) + '.json'

    strings.each do |key, value|
      case key
      when /^\[(.+)\]-name$/i
        build_settings[Regexp.last_match(1)] ||= {}
        build_settings[Regexp.last_match(1)]['name'] = value
      when /^\[(.+)\]-description$/i
        build_settings[Regexp.last_match(1)] ||= {}
        build_settings[Regexp.last_match(1)]['description'] = value
      when /^\[(.+)\]-description-\[(.+)\]$/i
        build_settings[Regexp.last_match(1)] ||= {}
        build_settings[Regexp.last_match(1)]['values'] ||= {}
        if build_settings[Regexp.last_match(1)]['values'].is_a?(Array)
          build_settings[Regexp.last_match(1)]['values'] = {}
        end
        build_settings[Regexp.last_match(1)]['values'][Regexp.last_match(2)] = value
      end
    end

  # next if build_settings.empty?

  # puts path, name

  #     json = {
  #       path: path,
  #       name: name,
  #       description: description,
  #       build_settings: build_settings
  #     }.to_json

  #     File.write(filename, json)
  rescue StandardError => e
    puts path, e
    next
  end

  doc = Nokogiri::HTML(open('https://help.apple.com/xcode/mac/11.4/en.lproj/itcaec37c2a6.html'))
  doc.search('div.Subhead').each do |listing|
    next unless heading = listing.at('h2').unlink

    name, id = heading.text.scan(/^(.+) \((.+)\)$/)[0]
    description_tags = listing.children.map(&:to_html)

    next unless build_settings[id]

    build_settings[id]['name'] = name
    build_settings[id]['description'] = ReverseMarkdown.convert(description_tags.join("\n")).strip
  end

  pp build_settings

  File.write('_data/build_settings.json', build_settings.to_json)
end

private

def path_to_xcode
  if ENV['DEVELOPER_DIR']
    Pathname.new(ENV['DEVELOPER_DIR'] + "/../..").cleanpath.to_s
  else
    "/Applications/Xcode.app"
  end
end

def plutil_to_json(path)
  input = File.read(path)
  command = ['plutil', '-convert', 'json', '-', '-o', '-'].join(' ')
  output, error = Open3.capture3(command, stdin_data: input)
  JSON.parse(output)
rescue StandardError
  nil
end

def canonicalize(name)
  case name
  when 'CoreBuildSystem' then 'Core Build System'
  when 'Ld' then 'Link Executables'
  when 'StripSymbols' then 'Strip Symbols'
  when 'Libtool' then 'Create Static Library'
  when 'PBXCp' then 'Source Versioning'
  when 'TextBasedAPITool' then 'Text-Based API Tool'

  when 'SwiftBuildSettings' then 'Swift Build Settings'

  when 'Apple Clang' then 'Clang'
  when 'Cpp' then 'C Preprocessor'
  when /Interface Builder/
    name.gsub(/Interface Builder/, '').strip
  when 'Compile RC Project' then 'Reality Composer Project Compiler'
  when 'Compile Skybox' then 'ARKit Skybox Compiler'
  when 'Compile USDZ' then 'USDZ Compiler'
  when 'Intent Definition' then 'Siri Intent Definition Compiler'
  when 'Process SceneKit Document' then 'SceneKit Document Processor'
  when 'OSACompile' then 'OSA Compiler'
  when 'SceneKitShaderCompiler' then 'SceneKitShaderCompiler'
  else
    name
  end
end

def normalize(name)
  return nil unless name

  name.gsub(/[\s\.\(\)\-]+/, '')
end
