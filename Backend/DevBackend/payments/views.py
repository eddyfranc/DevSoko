from django.shortcuts import render


#Mpesa Views

from rest_framework import status
from rest_framework import viewsets 
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import MpesaRequest, MpesaResponse, Order
from .serializers import MpesaRequestSerializer, MpesaResponseSerializer
from django.conf import settings
import base64
import requests
from datetime import datetime
from decimal import Decimal

@api_view(['POST'])
@permission_classes([AllowAny])
def stk_push(request):
    print("Received STK push request:", request.data)  # <-- This will show in your backend terminal
    data = request.data.copy()
    data.pop('product_id', None)  # Remove product_id as it's not needed for MpesaRequest
    data['amount'] = Decimal(str(data['amount']))
    serializer = MpesaRequestSerializer(data=data)
    if serializer.is_valid():
        order = Order.objects.create(buyer=None, product=None, quantity=1, status='pending')
        mpesa_request = serializer.save(order=order)
        response_data = initiate_stk_push(mpesa_request)
        print("Mpesa API response:", response_data)
        if response_data.get('ResponseCode') != '0':
            mpesa_response = MpesaResponse.objects.create(
                request=mpesa_request,
                merchant_request_id=response_data.get('MerchantRequestID', ''),
                checkout_request_id=response_data.get('CheckoutRequestID', ''),
                response_description=response_data.get('ResponseDescription', ''),
                response_code=response_data.get('ResponseCode', ''),
                customer_message=response_data.get('CustomerMessage', ''),
            )
            return Response({'detail': 'STK push failed', 'error': response_data}, status=400)
        mpesa_response = MpesaResponse.objects.create(
            request=mpesa_request,
            merchant_request_id=response_data.get('MerchantRequestID', ''),
            checkout_request_id=response_data.get('CheckoutRequestID', ''),
            response_description=response_data.get('ResponseDescription', ''),
            response_code=response_data.get('ResponseCode', ''),
            customer_message=response_data.get('CustomerMessage', ''),
        )
        response_serializer = MpesaResponseSerializer(mpesa_response)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    else:
        print("Serializer errors:", serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def initiate_stk_push(mpesa_request):
    access_token = get_access_token()
    api_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest" #sandbox URL
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    print("Access Token:", access_token)  # Debugging line
    phone = mpesa_request.phone_number.lstrip('+')
    payload = {
        "BusinessShortCode": settings.MPESA_SHORTCODE,
        "Password": generate_password(),
        "Timestamp": datetime.now().strftime('%Y%m%d%H%M%S'),
        "TransactionType": "CustomerPayBillOnline",
        "Amount": float(mpesa_request.amount),  # Convert Decimal to float
        "PartyA": phone,
        "PartyB": settings.MPESA_SHORTCODE,
        "PhoneNumber": phone,
        "CallBackURL": "http://127.0.0.1:8000/api/mpesa_callback/",  # Update with your actual callback URL
        "AccountReference": mpesa_request.account_reference,
        "TransactionDesc": mpesa_request.transaction
    }
    response = requests.post(api_url, json=payload, headers=headers)
    return response.json()
def get_access_token():
    consumer_key = settings.MPESA_CONSUMER_KEY
    consumer_secret = settings.MPESA_CONSUMER_SECRET
    api_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    response = requests.get(api_url, auth=(consumer_key, consumer_secret))
    access_token = response.json().get('access_token')
    return access_token
def generate_password():
    shortcode = settings.MPESA_SHORTCODE
    passkey = settings.MPESA_PASSKEY
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    data_to_encode = shortcode + passkey + timestamp
    encoded_string = base64.b64encode(data_to_encode.encode())
    return encoded_string.decode('utf-8')

@api_view(['POST'])
@permission_classes([AllowAny])
def mpesa_callback(request):
    callback_data = request.data
    stk_callback = callback_data.get('Body', {}).get('stkCallback', {})
    checkout_request_id = stk_callback.get('CheckoutRequestID')
    result_code = stk_callback.get('ResultCode')
    result_desc = stk_callback.get('ResultDesc')
    try:
        mpesa_request = MpesaRequest.objects.get(mpesa_response__checkout_request_id=checkout_request_id)
        mpesa_response = mpesa_request.mpesa_response
        mpesa_response.result_code = result_code
        mpesa_response.result_desc = result_desc
        mpesa_response.save()
        if result_code == 0:
            mpesa_request.order.status = 'paid'
            mpesa_request.order.save()
    except MpesaRequest.DoesNotExist:
        pass  # Log or handle
    return Response({'ResultCode': 0, 'ResultDesc': 'Success'})