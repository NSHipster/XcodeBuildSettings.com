require 'json'

module Jekyll
  module JSONFilter
    def json_escape(input)
        JSON.generate("#{input}", quirks_mode: true)
    end

    def json_compress(input)
        JSON.dump(JSON.parse(input))
    end
  end
end

Liquid::Template.register_filter(Jekyll::JSONFilter)
