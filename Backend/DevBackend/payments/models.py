from django.db import models
from django.contrib.auth.models import User



# Create your models here.
#Mpesa Transaction Model
class MpesaRequest(models.Model):
    phone_number = models.CharField(max_length=15)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    account_reference = models.CharField(max_length=50)
    transaction = models.CharField(max_length=255)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

class MpesaResponse(models.Model):
    request = models.ForeignKey(MpesaRequest, on_delete=models.CASCADE)
    merchant_request_id = models.CharField(max_length=255)
    checkout_request_id = models.CharField(max_length=10)
    response_description = models.CharField(max_length=255)
    response_code = models.CharField(max_length=10)
    customer_message = models.CharField(max_length=255)
    result_code = models.CharField(max_length=10, null=True, blank=True)
    result_desc = models.CharField(max_length=255, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
