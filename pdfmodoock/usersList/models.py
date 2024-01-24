from django.db import models

# Create your models here.
class Template(models.Model):
    name = models.CharField(max_length=200)
    img = models.CharField(max_length=250)
    description = models.TextField()