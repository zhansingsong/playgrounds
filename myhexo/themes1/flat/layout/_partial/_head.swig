<head>
	<meta charset="utf-8">
	<title>{{ config.title }}</title>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		{{ open_graph({twitter_id: theme.twitter, google_plus: theme.google_plus, fb_admins: theme.fb_admins, fb_app_id: theme.fb_app_id}) }}
	{{ css('css/style.css') }}
	{% if theme.favicon %}
	  <link rel="shortcut icon" type="image/x-icon" href="{{ url_for(theme.favicon) }}?v={{ theme.version }}" />
	{% endif %}
</head>