require 'active_support/all'

module Jekyll
  module InflectionFilter
    include ActiveSupport::Inflector
  end
end

Liquid::Template.register_filter(Jekyll::InflectionFilter)
