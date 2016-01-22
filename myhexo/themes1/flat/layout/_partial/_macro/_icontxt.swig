{% macro icontxt icontxtData %}
<dl class="icontxt u-cf {{ icontxtData.class }}">
	<dt>
		<i class="iconfont">{{ icontxtData.icon }}</i><span>：</span>
	</dt>
	{% for item in icontxtData.items %}
	{% if icontxtData.click %}
	<dd><a href="#">{{ item }}</a></dd>
	{% else %}
	<dd>{{ item }}</dd>
	{% endif %}
	{% endfor %}
</dl>
{% endmacro %}