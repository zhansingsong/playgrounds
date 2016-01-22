{% macro pagination paginationData %}
<div class="pagination">
	<a href="#">上一页</a>
	{% for i in paginationData %}
	<a href="#">{{ i }}</a>
	{% endfor %}
	<a href="#">下一页</a>
</div>
{% endmacro %}