from django.http import HttpResponse
from rest_framework.decorators import api_view
from django.template.loader import render_to_string
from django.template.loader import get_template
from io import BytesIO
from xhtml2pdf import pisa
import os
from rest_framework.response import Response
from .models import Template
from .serializers import TemplateSerializer
from django.http import JsonResponse
from rest_framework import status



def render_to_pdf(template_src, context_dict={}):
    print(template_src)
    template = get_template(template_src)
    print(type(template))
    html  = template.render(context_dict)
    result = BytesIO()
    pdf = pisa.pisaDocument(BytesIO(html.encode("ISO-8859-1")), result)
    if not pdf.err:
        return HttpResponse(result.getvalue(), content_type='application/pdf')
    return None


@api_view(['POST'])
def generate_pdf(request):
    data = request.data
    template_name= data['templateName']
    resultat = data['resultat'].split('\n')
    data['resultat'] = resultat
    pdf = render_to_pdf(f'usersList/{template_name}_template.html', data)
    response = HttpResponse(pdf, content_type='application/pdf')
    filename = "Invoice_%s.pdf" %("12341231")
    content = "attachment; filename='%s'" %(filename)
    response['Content-Disposition'] = content
    return response

@api_view(['GET'])
def get_template_data(request):
    if request.method == 'GET':
        templates = Template.objects.all()
        serializer = TemplateSerializer(templates, many=True)
        return JsonResponse(serializer.data, safe=False)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)

@api_view(['POST'])
def create_template_data(request):
    serializer = TemplateSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_template(request, pk):
    try:
        template = Template.objects.get(pk=pk)
    except Template.DoesNotExist:
        return Response({'error': 'Template not found.'}, status=status.HTTP_404_NOT_FOUND)

    template.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)