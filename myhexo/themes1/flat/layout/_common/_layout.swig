<!DOCTYPE html>
<html lang="en">
{% include "../_partial/_head.swig" %}
<body>
	<div class="container">
		{% include "../_partial/_header.swig" %}
		{% include "../_partial/_nav.swig" %}
		{% block content %}
		{% endblock %}
		{% include "../_partial/_footer.swig" %}
	</div>
	{% block jscript %}
	{% endblock %}
</body>
</html>