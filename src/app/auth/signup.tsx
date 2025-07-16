import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/src/context/auth/AuthContext';
import { GenderOptions } from '@/src/modules/login/google/components/GenderOption';
import { Gender } from '@/src/modules/login/enums/Gender';

export default function SignupPage() {
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState(Gender.NONE);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { token, provider } = useLocalSearchParams();
  const { signup } = useAuth();

  const handleSignup = async () => {
    if (!nickname.trim()) {
      Alert.alert('오류', '닉네임을 입력해주세요.');
      return;
    }     

    setLoading(true);
    try {
      await signup({
        provider: provider as string,
        token: token as string,
        nickname: nickname.trim(),
        gender: gender,
      });
      
      // 회원가입 성공 시 메인 화면으로 이동
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('오류', '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>
      <Text style={styles.subtitle}>추가 정보를 입력해주세요</Text>
      
      <TextInput
        style={styles.input}
        placeholder="닉네임"
        value={nickname}
        onChangeText={setNickname}
        maxLength={20}
      />
      
      <GenderOptions genderSelected={gender} setGender={setGender} />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]} 
          onPress={handleCancel}
        >
          <Text style={styles.cancelButtonText}>취소</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.signupButton]} 
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={styles.signupButtonText}>
            {loading ? '가입 중...' : '가입하기'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  signupButton: {
    backgroundColor: '#4285F4',
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  signupButtonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});