import { history, Link } from '@umijs/max';
import { Button, Form, Input, message, Select, Space, Typography } from 'antd';
import type { FC } from 'react';
import { useState } from 'react';
import { registerUser } from './service';
import useStyles from './style.style';

const FormItem = Form.Item;
const { Option } = Select;
const { Title } = Typography;

const Register: FC = () => {
  const { styles } = useStyles();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (values: any) => {
    console.log(' onFinish called with values:', values);
    setSubmitting(true);
    try {

      const res = await registerUser({
        email: values.email,
        password: values.password,
        confirm: values.confirm
      });


      console.log('return res:', res);

      if (res.success) {
        message.success('Registration successful!');
        history.push({
          pathname: '/user/register-result',
          search: `?account=${values.email}`,
        });
      } else {
        message.error(res.message || 'Registration failed, please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      message.error('An error occurred during registration. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className={styles.main}>
      <div style={{ textAlign: 'center', marginBottom: 40, marginTop: 40 }}>
        <img src="/bee.jpg" alt="Tree New Bee" style={{ width: 48, height: 48, borderRadius: 8 }} />
        <div style={{ fontSize: 24, fontWeight: 'bold', marginTop: 8 }}>Tree New Bee</div>
        <div style={{ fontSize: 14, color: '#888' }}>Committed to Solar Power Generation</div>
      </div>

      <h3>Register</h3>
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        initialValues={{ prefix: '44' }}
      >
        <FormItem
          name="email"
          rules={[
            { required: true, message: 'Please enter your email!' },
            { type: 'email', message: 'Invalid email format!' },
          ]}
        >
          <Input size="large" placeholder="Email" />
        </FormItem>

        <FormItem
          name="password"
          rules={[{ required: true, message: 'Please enter your password!' }]}
        >
          <Input.Password size="large" placeholder="Password" />
        </FormItem>

        <FormItem
          name="confirm"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('Passwords do not match!');
              },
            }),
          ]}
        >
          <Input.Password size="large" placeholder="Confirm Password" />
        </FormItem>

        <FormItem>
          <Button size="large" loading={submitting} type="primary" htmlType="submit" block>
            Register
          </Button>
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Link to="/user/login">Use Existing Account to Login</Link>
          </div>
        </FormItem>
      </Form>
    </div>
  );
};

export default Register;
