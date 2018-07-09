from django.conf.urls import url

from . import views

app_name = 'blog'
urlpatterns = [
    url(r'^$', views.index, name='index'),  # 首页
    url(r'^post/(?P<pk>[0-9]+)/$', views.detail, name='detail'),  # 博客详情
    url(r'^archives/(?P<year>[0-9]{4})/(?P<month>[0-9]{1,2})/$',
        views.archives, name='archives'),  # 归档
    url(r'^category/(?P<pk>[0-9]+)/$', views.category, name='category'),  # 分类
]
