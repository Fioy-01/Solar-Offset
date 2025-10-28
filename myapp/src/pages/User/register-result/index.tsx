import { Link, useSearchParams } from '@umijs/max';
import { Button, Result } from 'antd';
import React from 'react';
import useStyles from './style.style';

const RegisterResult: React.FC<Record<string, unknown>> = () => {
  const { styles } = useStyles();
  const [params] = useSearchParams();

  const actions = (
    <div className={styles.actions}>
      <a href="">
        <Button size="large" type="primary">
          <span>Check Email</span>
        </Button>
      </a>
      <Link to="/">
        <Button size="large">Back to Home</Button>
      </Link>
    </div>
  );

  const email = params?.get('account') || 'AntDesign@example.com';
  return (
    <Result
      className={styles.registerResult}
      status="success"
      title={
        <div className={styles.title}>
          <span>Your account: {email} has been successfully registered</span>
        </div>
      }
      subTitle="An activation email has been sent to your inbox. The email is valid for 24 hours. Please check your email and click the link to activate your account."
      extra={actions}
    />
  );
};

export default RegisterResult;
