import { useEffect, useState } from 'react';
import { Table, message, Button, Layout } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;

interface Product {
  id: number;
  sku: string;
  supplier: string;
  barcode: string;
  lastUpdateTime: string;
}

const PAGE_SIZE = 10;

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const subdomain = localStorage.getItem('subdomain');

  useEffect(() => {
    if (!token || !subdomain) {
      navigate('/');
      return;
    }
    fetchProducts(page);
  }, [page, token, subdomain, navigate]);

  const fetchProducts = async (pageNumber: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://${subdomain}.ox-sys.com/variations?page=${pageNumber}&size=${PAGE_SIZE}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      if (!res.ok) throw new Error('Ошибка при получении данных');
      const data = await res.json();
      setProducts(data.items);
      setTotal(data.total_count);
    } catch (error) {
      message.error('Ошибка загрузки продуктов');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  const columns = [
    { title: 'SKU', dataIndex: 'sku', key: 'sku' },
    { title: 'Supplier', dataIndex: 'supplier', key: 'supplier' },
    { title: 'Barcode', dataIndex: 'barcode', key: 'barcode' },
    { title: 'Last Update', dataIndex: 'lastUpdateTime', key: 'lastUpdateTime' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#fff',
          fontSize: 24,
        }}
      >
        <div>OX Admin Panel</div>
        <div>
          <Button onClick={logout} type="primary" danger>
            Logout
          </Button>
        </div>
      </Header>
      <Content style={{ padding: 24, maxWidth: 1200, margin: 'auto' }}>
        <Button style={{ marginBottom: 16 }}>
          <Link to="/search">Поиск продуктов</Link>
        </Button>
        <Table
          columns={columns}
          dataSource={products}
          loading={loading}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: PAGE_SIZE,
            total,
            onChange: setPage,
          }}
          locale={{ emptyText: 'Продукты не найдены' }}
        />
      </Content>
    </Layout>
  );
};

export default ProductsPage;
