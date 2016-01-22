{% if page.comments %}
<div id="comment">
	<h3 class="title"> {{ __('comment') }} </h3>
	{% if config.disqus_shortname %}
	<div id="disqus_thread">
		<noscript>Please enable JavaScript to view the <a href="//disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
	</div>
	{% endif %}	
</div>
{% endif %}