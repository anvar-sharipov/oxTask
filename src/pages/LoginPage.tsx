import { useState } from 'react';
import { Layout, Form, Input, Button, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;
const { Title } = Typography;

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    const { username, password, subdomain } = values;
    setLoading(true);

    try {
      const response = await fetch(`https://${subdomain}.ox-sys.com/security/auth_check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: new URLSearchParams({
          _username: username,
          _password: password,
          _subdomain: subdomain,
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        message.success('Успешно авторизован!');
        localStorage.setItem('token', data.token);
        localStorage.setItem('subdomain', subdomain);
        navigate('/products');
      } else {
        message.error(data.message || 'Ошибка авторизации');
      }
    } catch (error) {
      message.error('Сервер не отвечает');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ color: '#fff', fontSize: 24, textAlign: 'center' }}>OX Login</Header>
      <Content style={{ padding: 24, maxWidth: 400, margin: '48px auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
          Вход в систему
        </Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Username"
            name="username"
            initialValue="user_task"
            rules={[{ required: true, message: 'Введите имя пользователя' }]}
          >
            <Input placeholder="Введите имя пользователя" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            initialValue="user_task"
            rules={[{ required: true, message: 'Введите пароль' }]}
          >
            <Input.Password placeholder="Введите пароль" />
          </Form.Item>

          <Form.Item
            label="Subdomain"
            name="subdomain"
            initialValue="toko"
            rules={[{ required: true, message: 'Введите субдомен' }]}
          >
            <Input placeholder="Введите субдомен" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} size="large">
              Войти
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
}

export default LoginPage;
