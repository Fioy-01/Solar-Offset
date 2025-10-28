import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { ProFormText, ProFormCaptcha } from '@ant-design/pro-components';
import { Helmet, history } from '@umijs/max';
import { Button, Form, message } from 'antd';
import React from 'react';
import { getResetCode, resetPassword } from '@/services/ant-design-pro/api';

const ForgotPassword: React.FC = () => {
  const [form] = Form.useForm();

  const handleReset = async (values: any) => {
    const res = await resetPassword(values);
    if (res?.status === 'ok') {
      message.success('Password reset successful, please login.');
      history.push('/user/login');
    } else {
      message.error(res?.message || 'Password reset failed.');
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '80px auto', padding: 24, background: '#fff', borderRadius: 8 }}>
      <Helmet>
        <title>Forgot Password - Tree New Bee</title>
      </Helmet>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <img
          src="/bee.jpg"
          alt="Tree New Bee"
          style={{ width: 48, height: 48, verticalAlign: 'middle', borderRadius: 8 }}
        />
        <span style={{ fontSize: 24, fontWeight: 'bold', marginLeft: 12, verticalAlign: 'middle' }}>
          Tree New Bee
        </span>
        <div style={{ fontSize: 14, color: '#888', marginTop: 4 }}>
          Committed to Solar Power Generation
        </div>
      </div>

      <h2 style={{ textAlign: 'center' }}>Forgot Password</h2>
      <p style={{ textAlign: 'center', color: '#888' }}>We'll help you reset it via email</p>

      <Form form={form} onFinish={handleReset} layout="vertical">
        <ProFormText
          name="email"
          fieldProps={{ size: 'large', prefix: <MailOutlined /> }}
          placeholder="Enter your registered email"
          rules={[
            { required: true, message: 'Please enter your email!' },
            { type: 'email', message: 'Invalid email format!' },
          ]}
        />
        <ProFormCaptcha
          name="code"
          fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
          placeholder="Enter the code sent to your email"
          rules={[{ required: true, message: 'Please enter the code!' }]}
          captchaTextRender={(timing, count) => {
            if (timing) {
              return `${count}s`;
            }
            return 'Send Code';
          }}
          onGetCaptcha={async (email: string) => {
            const res = await getResetCode({ email });
            if (res?.status === 'ok') {
              message.success('Code sent! Please check your email.');
            } else {
              message.error(res?.message || 'Failed to send code.');
            }
          }}
        />
        <ProFormText.Password
          name="newPassword"
          placeholder="New Password (at least 6 characters)"
          rules={[
            { required: true, message: 'Please enter a new password!' },
            { min: 6, message: 'Password too short!' },
          ]}
        />
        <ProFormText.Password
          name="confirmPassword"
          placeholder="Confirm New Password"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Please confirm your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('Passwords do not match!');
              },
            }),
          ]}
        />
        <Button type="primary" htmlType="submit" size="large" block>
          Reset Password
        </Button>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <a onClick={() => history.push('/user/login')}>Back to Login</a>
        </div>
      </Form>
    </div>
  );
};

export default ForgotPassword;
