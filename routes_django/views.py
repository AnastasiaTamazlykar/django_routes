# -*- coding: utf-8 -*-
from django.shortcuts import render_to_response
from django.template import RequestContext
from mongoengine import Q

__author__ = 'AnastasiaTamazlykar'
from django.views.generic.base import TemplateView
from django.http import HttpResponse
from models import Route


class MainView(TemplateView):
    template_name = 'main.html'

    def get(self, request, *args, **kwargs):
        if 'begin_point' in request.GET:
            begin = request.GET['begin_point'].split(' ')
            end = request.GET['end_point'].split(' ')
            if request.GET['isSaved'] == 'true':
                route = Route(begin_point={"type": "Point",
                                           "coordinates": map(float, begin)},
                              end_point={"type": "Point",
                                         "coordinates": map(float, end)},
                              begin_address=request.GET['begin_address'],
                              end_address=request.GET['end_address'])
                route.save()
                return HttpResponse(u'Мaршрут успешно сохранен')
            else:
                list = Route.objects(Q(begin_point__near=
                                       {"type": "Point", "coordinates": map(float, begin)})
                                     and Q(end_point__near=
                                           {"type": "Point", "coordinates": map(float, end)}))
                return render_to_response('main.html', {'routes': list}, context_instance=RequestContext(request))
        routes = Route.objects.all()
        return render_to_response('main.html', {'routes': routes}, context_instance=RequestContext(request))


def get_context_data(self, **kwargs):
    context = super(MainView, self).get_context_data(**kwargs)
    return context

