import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Typography,
  Row,
  Col,
  Card,
  Divider,
  Space,
  Statistic,
  Tag
} from 'antd';
import {
  Link,
  useNavigate
} from 'react-router-dom';
import {
  ThunderboltOutlined,
  GlobalOutlined,
  LineChartOutlined,
  BarChartOutlined,
  RiseOutlined,
  ArrowRightOutlined,
  CalculatorOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const [impactData, setImpactData] = useState({
    projectsCompleted: 0,
    countriesSupported: 0,
    panelsInstalled: 0,
    carbonReduced: 0
  });

  useEffect(() => {
    axios.get('/api/statistics/summary')
      .then(response => {
        setImpactData(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  // Handle click on "Calculate Now" button
  const handleCalculateClick = () => {
    try {
      navigate('/carbon-footprint');
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = '/carbon-footprint';
    }
  };

  // Handle click on "Fund Now" button
  const handleFundingClick = () => {
    try {
      navigate('/funding');
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = '/funding';
    }
  };

  return (
    <div style={{ padding: '24px' }}>

      <div
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/welcome.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '40px 24px',
          borderRadius: '8px',
          color: 'white',
          textAlign: 'center',
          marginBottom: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <Title level={1} style={{ color: 'white', marginBottom: '16px', textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>Solar Offset</Title>
        <Paragraph style={{ color: 'white', fontSize: '16px', maxWidth: '800px', margin: '0 auto 24px', textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
          Reduce your carbon footprint and promote sustainable development by supporting global solar projects. Your contribution can help communities in developing countries access clean energy while reducing global carbon emissions.
        </Paragraph>

        <Button
          type="default"
          size="large"
          style={{ background: 'white', borderColor: 'white', color: '#1890ff' }}
          onClick={handleFundingClick}
        >
          Fund Now <ArrowRightOutlined />
        </Button>
        <Button
          type="default"
          size="large"
          style={{ background: 'white', borderColor: 'white', color: '#1890ff' }}
          onClick={() => navigate('/user/login')}
        >
          Log In<ArrowRightOutlined />
        </Button>

      </div>


      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="stat-card">
            <Statistic
              title="Completed Projects"
              value={impactData.projectsCompleted}
              prefix={<LineChartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8 }}>
              <Tag color="blue">In Progress: 14</Tag>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="stat-card">
            <Statistic
              title="Countries Covered"
              value={impactData.countriesSupported}
              prefix={<GlobalOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: 8 }}>
              <Tag color="purple">Mainly in Africa</Tag>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="stat-card">
            <Statistic
              title="Solar Panels Installed"
              value={impactData.panelsInstalled}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#fa8c16' }}
              formatter={value => `${value.toLocaleString()}`}
            />
            <div style={{ marginTop: 8 }}>
              <Tag color="orange">Total Capacity: 4250 kW</Tag>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="stat-card">
            <Statistic
              title="Total Carbon Reduction"
              value={impactData.carbonReduced}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix="tons"
            />
            <div style={{ marginTop: 8 }}>
              <Tag color="green">Equivalent to 36,225 trees planted</Tag>
            </div>
          </Card>
        </Col>
      </Row>


      <div style={{ marginBottom: '40px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
          Why Choose Solar Offset?
        </Title>
        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} sm={24} md={8}>
            <Card
              hoverable
              className="feature-card"
              cover={
                <div
                  style={{
                    height: 160,
                    background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <BarChartOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                </div>
              }
            >
              <Card.Meta
                title="Carbon Emission Comparison"
                description="Compare carbon emissions across different countries and understand the impact of solar energy in reducing these emissions."
              />
              <Divider dashed />
              <Space>
                <Button type="link" size="small">View Comparison Data</Button>
                <Tag color="blue">Detailed Analysis</Tag>
              </Space>
            </Card>
          </Col>

          <Col xs={24} sm={24} md={8}>
            <Card
              hoverable
              className="feature-card"
              cover={
                <div
                  style={{
                    height: 160,
                    background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <LineChartOutlined style={{ fontSize: 48, color: '#52c41a' }} />
                </div>
              }
            >
              <Card.Meta
                title="Track Your Funding"
                description="Track the solar projects you fund and monitor their impact on carbon reduction, energy generation, and more."
              />
              <Divider dashed />
              <Space>
                <Button type="link" size="small">View Project Progress</Button>
                <Tag color="green">Real-time Updates</Tag>
              </Space>
            </Card>
          </Col>

          <Col xs={24} sm={24} md={8}>
            <Card
              hoverable
              className="feature-card"
              cover={
                <div
                  style={{
                    height: 160,
                    background: 'linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <ThunderboltOutlined style={{ fontSize: 48, color: '#fa8c16' }} />
                </div>
              }
            >
              <Card.Meta
                title="Fund Solar Projects"
                description="Directly fund solar panel installations in specific countries. Your contribution will help communities in need access clean energy."
              />
              <Divider dashed />
              <Space>
                <Button type="link" size="small" onClick={handleFundingClick}>Browse Fundable Projects</Button>
                <Tag color="orange">High Impact</Tag>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>


      <Card style={{ textAlign: 'center' }} className="calculator-card">
        <Space direction="vertical" size="middle">
          <Title level={4}>Calculate Your Carbon Footprint</Title>
          <Paragraph style={{ maxWidth: '600px', margin: '0 auto' }}>
            Want to understand how your household energy consumption affects the environment? Use our carbon footprint calculator to learn how much carbon emissions you can offset by funding solar projects.
          </Paragraph>
          <Button type="default" onClick={handleCalculateClick} icon={<CalculatorOutlined />}>
            Calculate Now
          </Button>
        </Space>
      </Card>


      <style jsx global>{`
        .stat-card {
          transition: all 0.3s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }
        
        .feature-card {
          transition: all 0.3s ease;
          height: 100%;
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }
        
        .cta-card {
          transition: all 0.3s ease;
        }
        
        .cta-card:hover {
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }
        
        .calculator-card {
          transition: all 0.3s ease;
        }
        
        .calculator-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .ant-tag {
          transition: all 0.3s ease;
        }
        
        .ant-tag:hover {
          transform: scale(1.05);
        }
        
        .ant-btn {
          transition: all 0.3s ease;
        }
        
        .ant-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default Welcome;