{% import '_macro/_mlist.swig' as mlist %}
<div class="aside">
	<div class="recents">
	{{ mlist.mlist(site.data.mock.aside.recents) }}
	{{ mlist.mlist(site.data.mock.aside.categories) }}
	{{ mlist.mlist(site.data.mock.aside.tags) }}
	{{ mlist.mlist(site.data.mock.aside.archives) }}
	</div>	
</div>