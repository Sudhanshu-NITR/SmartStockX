from django.shortcuts import render
from django.http import JsonResponse

def index(request):
    return render(request, 'index.html')

def ping(request):
    return JsonResponse({'status': 'ok'})