import { useEffect, useState } from 'react';
import { Input, Table, message, Button, Layout } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;

interface Product {
  id: number;
  sku: string;
  supplier: string;
  barcode: string;
  lastUpdateTime: string;
  name?: string;
}

const SearchPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const token = localStorage.getItem('token');
  const subdomain = localStorage.getItem('subdomain');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !subdomain) {
      navigate('/');
      return;
    }
    fetchAllProducts();
  }, [token, subdomain, navigate]);

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://${subdomain}.ox-sys.com/variations?page=1&size=1000`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      if (!res.ok) throw new Error('Ошибка загрузки данных');
      const data = await res.json();

      // Если в API нет отдельного поля "name", можно заменить на sku или supplier для поиска
      const itemsWithName = data.items.map((item: any) => ({
        ...item,
        name: item.sku || '',
      }));

      setProducts(itemsWithName);
      setFilteredProducts(itemsWithName);
    } catch (error) {
      message.error('Ошибка загрузки продуктов');
    } finally {
      setLoading(false);
    }
  };

  const sortBySearchTerm = (items: Product[], term: string) => {
    const lowerTerm = term.toLowerCase();

    return items
      .filter(item => item.name && item.name.toLowerCase().includes(lowerTerm))
      .sort((a, b) => {
        const aName = a.name!.toLowerCase();
        const bName = b.name!.toLowerCase();

        const aIndex = aName.indexOf(lowerTerm);
        const bIndex = bName.indexOf(lowerTerm);

        if (aIndex === bIndex) return 0;
        return aIndex < bIndex ? -1 : 1;
      });
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);

    if (val.trim() === '') {
      setFilteredProducts(products);
      return;
    }

    const sorted = sortBySearchTerm(products, val);
    setFilteredProducts(sorted);
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
    { title: 'Name', dataIndex: 'name', key: 'name' },
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
          <Button type="link" style={{ color: '#fff', marginRight: 16 }}>
            <Link to="/products" style={{ color: '#fff' }}>
              Продукты
            </Link>
          </Button>
          <Button type="primary" onClick={logout} danger>
            Logout
          </Button>
        </div>
      </Header>
      <Content style={{ padding: 16, maxWidth: 900, margin: '0 auto' }}>
        <Input.Search
          placeholder="Поиск по названию продукта"
          allowClear
          onChange={onSearchChange}
          value={search}
          style={{ marginBottom: 16, width: '100%' }}
          enterButton
          size="large"
        />
        <Table
          columns={columns}
          dataSource={filteredProducts}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 20, showSizeChanger: true }}
          locale={{ emptyText: 'Продукты не найдены' }}
        />
      </Content>
    </Layout>
  );
};

export default SearchPage;
