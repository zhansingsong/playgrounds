{% import '_macro/_article.swig' as article1 %}
{% import '_macro/_pagination.swig' as pagination %}
<div class="bd u-cf">
	<div class="l u-fl">
		<div class="lc">
			{% for post in site.posts  %}
			{{ article1.article(post) }}
			{% endfor %}
		</div>
	</div>
	<div class="r u-fr">
		{% include "_aside.swig" %}
	</div>
</div>
{{ pagination.pagination(site.data.mock.pagination) }}
