# frozen_string_literal: true

require 'fileutils'

Jekyll::Hooks.register :site, :post_write do |site|
  %w(csv json).each do |ext|
    FileUtils.cp(File.join(site.source, "data/build_settings.#{ext}"), site.dest)
  end
end
