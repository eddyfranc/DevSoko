from .models import MpesaRequest, MpesaResponse

class MpesaRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = MpesaRequest
        fields = ['phone_number', 'amount', 'account_reference', 'transaction']
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['amount'] = str(instance.amount)
        return ret

class MpesaResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = MpesaResponse
        fields = '__all__'
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        return ret

