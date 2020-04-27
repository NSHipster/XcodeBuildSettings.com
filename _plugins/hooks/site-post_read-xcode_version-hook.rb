# frozen_string_literal: true

Jekyll::Hooks.register :site, :post_read do |site|
  output = `xed --version`
  site.data['xcode_version'] = output.scan(/\d+\.\d+\.\d+/).first
end
