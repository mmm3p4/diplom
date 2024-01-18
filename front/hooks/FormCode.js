import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AuthService from '../services/Auth.service';
import { useNavigation } from '@react-navigation/native';

const FormCode = (props) => {
  const [errors, setErrors] = useState('');
  const navigation = useNavigation();

  const handleSubmit = async (code) => {
    try {
      const response = await AuthService.postActivationCode(props.props.email, code);

      if (props.props.subscribed) {
        await AuthService.postSubscribed(props.props.email, true);
      }
      // await AuthService.login(props.props.username, props.props.password);
      navigation.navigate('Главная');
    } catch (error) {
      setErrors(error?.response?.data?.message || 'Неверный код');
    }
  };


  return (
    <Formik
      initialValues={{
        code: '',
      }}
      validationSchema={Yup.object({
        code: Yup.string().required('Введите код активации!'),
      })}
      onSubmit={(values) => handleSubmit(values.code)}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        isValid,
        dirty,
        isSubmitting,
        resetForm,
      }) => (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
        <View style={{ backgroundColor: '#F0DAE1', padding: 20, marginTop: 20, borderWidth: 2, borderColor: "#9A1656", borderRadius: 10, alignItems: "center"}}>
          <Text style={{ fontSize: 19, color: '#9A1656', fontWeight: 'bold', marginBottom: 15, textAlign: 'center'  }}>
            Введите код активации, который пришел на вашу электронную почту
          </Text>

          <View  style={{ justifyContent: 'center', alignItems: 'center' }}>
            <TextInput
              onChangeText={handleChange('code')}
              onBlur={handleBlur('code')}
              value={values.code}
              placeholder="Введите код"
              style={{ width: 180, height: 50, borderColor: '#9A1656', borderWidth: 1, marginTop: 20, marginBottom: 20, borderRadius: 10, backgroundColor: "white", padding: 7 }}
            />
            {errors.code && <Text style={{ color: 'red' }}>{errors.code}</Text>}
          </View>

          {errors.length > 0 && (
            <View>
              <Text style={{ color: 'red' }}>{errors}</Text>
            </View>
          )}

          <Button
            title="Отправить"
            onPress={handleSubmit}
            disabled={!isValid || !dirty || isSubmitting}
            color="#9A1656"
          />
        </View>
        </View>
      )}
      
    </Formik>
  );
};

export default FormCode;
