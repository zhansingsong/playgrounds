{% macro article articleData %}
{% import '_icontxt.swig' as icontxt %}
<div class="article">
	<p class="date"><i class="iconfont">&#xe603;</i><span>{{ date(articleData.date) }}</span></p>
	<div class="body">
	{{ articleData.photos.length }}
		{% for photo in articleData.photos %}
		<a href="#"><img src="{{ url_for(photo) }}" alt="{{ articleData.img.alt }}"></a>
		{% endfor %}
		<div class="main">
			<h3 class="title"><a href="#">{{ articleData.title }}</a></h3>
			<div class="row u-cf">
				<div class="u-fl">
				{% if page.categories %}
				{% set categoriesData = {"icon": "&#xe602;", "items": page.categories, "click": "click"} %}
				{{ icontxt.icontxt(categoriesData) }}
				{% endif %}

				{% if page.tags %}
				{% set tagsData = {"icon": "&#xe607;", "items": page.tags, "click": "click"} %}
				{{ icontxt.icontxt(tagsData) }}
				{% endif %}

				{% set heatData = {"icon": "&#xe605;", "items": ["1123"]} %}
				{{ icontxt.icontxt(heatData) }}
				</div>
				<div class="u-fr">
				{% set tagsData = {"icon": "&#xe607;", "items": ["12条评论"], "click": "click"} %}
					{{ icontxt.icontxt(site.data.mock.metas.comments) }}
				</div>
			</div>
			<div class="content">
				<p class="abstract">	{{ articleData.content }}</p>
				<div class="more u-cf">
					<a href="#" class="more">阅读全文 》</a>
				</div>
			</div>
			<div class="share">
				
			</div>
		</div>
	</div>
</div>
{% endmacro %}