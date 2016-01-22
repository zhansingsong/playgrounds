{% extends "_common/_layout.swig" %}
{% block content %}
{% include "_partial/_post.swig" %}
{% include "_partial/_comment.swig" %}
{% endblock %}
{% block jscript %}
{% include "_partial/_script.swig" %}
{% endblock %}