// components/AppLayout.tsx
import { Layout, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Header, Content } = Layout;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', fontSize: 24 }}>
        <div>OX Admin Panel</div>
        <Button onClick={logout} type="primary" danger>
          Logout
        </Button>
      </Header>
      <Content style={{ padding: 24 }}>{children}</Content>
    </Layout>
  );
};

export default AppLayout;
