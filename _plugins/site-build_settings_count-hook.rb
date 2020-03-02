# frozen_string_literal: true

Jekyll::Hooks.register :site, :post_read do |site|
  site.data['build_settings_count'] = site.data['build_settings'].values.reduce(0) do |count, nested|
    count + nested['build_settings'].count
  end
end
