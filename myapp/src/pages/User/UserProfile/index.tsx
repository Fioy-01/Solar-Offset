import { Card, Descriptions, Layout, Spin, message, Typography, Row, Col, Empty, Input, Button, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const { Content } = Layout;
const { Title } = Typography;

const UserProfile: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalAmount: 0, totalKWh: 0, totalCO2: 0 });

  const productStats: any = {
    'Solar Roof-Light Kit': {
      label: 'Solar Roof-Light Kit',
      basePrice: 200,
      kWhPerUnit: 150,
      CO2PerKWh: 0.6,
    },
    'Power a Community Together': {
      label: 'Power a Community Together',
      basePrice: 100,
      kWhPerUnit: 400,
      CO2PerKWh: 0.6,
    },
  };

  useEffect(() => {
    console.log("🔥 useEffect running");
    const fetchData = async () => {
      console.log("📦 fetching user info...");
      try {
        setLoading(true);
  
        // get user info
        const userRes = await axios.get('/api/users/info');
        const user = userRes.data;
        setUserInfo(user);
        form.setFieldsValue(user);
  
        // get user orders
        const ordersRes = await axios.get(`/api/contributions/user/${user.id}`);
        setOrders(ordersRes.data);
  
        //calculate summary
        let totalAmount = 0;
        let totalKWh = 0;
        let totalCO2 = 0;
  
        ordersRes.data.forEach((order: any) => {
          const stats = productStats[order.product || 'Solar Roof-Light Kit']; // fallback
          const units = order.amount / stats.basePrice;
          const kWh = units * stats.kWhPerUnit;
          const co2 = kWh * stats.CO2PerKWh;
  
          totalAmount += order.amount;
          totalKWh += kWh;
          totalCO2 += co2;
        });
  
        setSummary({ totalAmount, totalKWh, totalCO2 });
  
      } catch (err) {
        message.error('Failed to load user info');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      axios.post('/api/users/update', {
        ...values,
        id: userInfo?.id,  // Assuming userInfo has an id field
      })      
      setUserInfo(values);
      setEditing(false);
      message.success('Saved successfully');
    } catch (err) {
      message.error('Save failed');
    }
  };

  return (
    <Layout style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', paddingTop: 24 }}>
        <img src="/bee.jpg" alt="bee logo" style={{ width: 32, height: 32, verticalAlign: 'middle' }} />
        <Title level={3} style={{ display: 'inline-block', marginLeft: 8, marginBottom: 0 }}>Tree New Bee</Title>
        <p style={{ marginBottom: 0, color: '#666' }}>Committed to Solar Power Generation</p>
      </div>

      <Content style={{ padding: '20px 20px', maxWidth: 1200, margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: 100 }}>
            <Spin tip="Loading..." size="large" />
          </div>
        ) : (
          <Row gutter={[32, 32]} align="top" justify="center">
            <Col xs={24} md={12}>
              <Card
                hoverable
                style={{
                  borderRadius: 12,
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  padding: 16,
                  transition: 'transform 0.3s ease',
                }}
                bodyStyle={{ padding: 16 }}
              >
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <img
                    src={userInfo?.avatar || '/default-avatar.png'}
                    alt="avatar"
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      backgroundColor: '#eee',
                      border: '2px solid #ccc',
                    }}
                  />
                </div>

                <Form form={form} layout="vertical" disabled={!editing}>
                  <Form.Item name="username" label="🧾 Username">
                    <Input placeholder="Enter username" />
                  </Form.Item>
                  <Form.Item name="age" label="🎂 Age">
                    <Input placeholder="Enter age" type="number" min={0} />
                  </Form.Item>
                  <Form.Item name="gender" label="⚥ Gender">
                    <Input placeholder="Enter gender" />
                  </Form.Item>
                  <Form.Item name="phone" label="📞 Phone" rules={[{ pattern: /^1[3-9]\d{9}$/, message: 'Enter a valid phone number' }]}>
                    <Input placeholder="Enter phone number" />
                  </Form.Item>
                  <Form.Item name="email" label="✉️ Email" rules={[{ type: 'email', message: 'Enter a valid email address' }]}>
                    <Input placeholder="Enter email" />
                  </Form.Item>
                  <Form.Item name="address" label="📍 Address">
                    <Input placeholder="Enter address" />
                  </Form.Item>
                </Form>

                {editing ? (
                  <div style={{ textAlign: 'right' }}>
                    <Button onClick={() => setEditing(false)} style={{ marginRight: 8 }}>Cancel</Button>
                    <Button type="primary" onClick={handleSave}>Save</Button>
                  </div>
                ) : (
                  <div style={{ textAlign: 'right' }}>
                    <Button onClick={() => setEditing(true)}>Edit</Button>
                  </div>
                )}
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card
                hoverable
                style={{
                  borderRadius: 12,
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  padding: 16,
                  transition: 'transform 0.3s ease',
                }}
                bodyStyle={{ padding: 16 }}
              >
                <Title level={4}>My Funded Projects</Title>
                <p>Total Amount Donated: £{summary.totalAmount.toFixed(2)}</p>
                <p>Estimated Annual Power Output: {summary.totalKWh.toFixed(1)} kWh</p>
                <p>Estimated Annual CO₂ Reduction: {summary.totalCO2.toFixed(1)} kg CO₂</p>
              </Card>

              {orders.length === 0 ? (
                <Empty description="No donation records found" style={{ backgroundColor: '#fff', padding: '24px 0', marginTop: 24 }} />
              ) : (
                <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                  {orders.map((donation: any, index) => {
                    const stats = productStats[donation.product];
                    const units = donation.amount / stats.basePrice;
                    const power = units * stats.kWhPerUnit;
                    const co2 = power * stats.CO2PerKWh;

                    return (
                      <Col span={24} key={index}>
                        <Card
                          hoverable
                          style={{ borderRadius: 10, transition: 'transform 0.3s ease' }}
                        >
                          <p><b>Project Type:</b> {stats.label}</p>
                          <p><b>Funded Country:</b> {donation.country || '--'}</p>
                          <p><b>Amount:</b> £{donation.amount}</p>
                          <p><b>Estimated Power Output:</b> {power.toFixed(1)} kWh</p>
                          <p><b>Estimated CO₂ Reduction:</b> {co2.toFixed(1)} kg CO₂</p>
                          <p style={{ color: '#888' }}>Date: {donation.date}</p>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              )}
            </Col>
          </Row>
        )}
      </Content>
    </Layout>
  );
};

export default UserProfile;
