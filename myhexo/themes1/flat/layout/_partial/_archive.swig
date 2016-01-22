<div class="archive">
{{ list_archives() }}
{{ post.date.year() }}
	{% for page1 in site.posts %}
{{   page1.date.year()  }}
{{ page1.title }}
	{% endfor %}

{# 		{% if page.archive %}
	<h1>testasa</h1>{{  page.year }}
	{% endif %}
	{{ page.month }} #}
</div>