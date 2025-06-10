from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['id'] = user.id
        token['tipo_usuario'] = user.user_type
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['username'] = self.user.username
        data['id'] = self.user.id
        data['tipo_usuario'] = self.user.user_type  
        return data
