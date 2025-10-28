import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Layout,
  Card,
  Row,
  Col,
  Typography,
  Statistic,
  Table,
  Tag,
  Progress,
  Button,
  Select,
  DatePicker,
  Tabs,
  Badge,
  Divider,
  Space,
  Tooltip
} from 'antd';
import {
  RiseOutlined,
  GlobalOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ToolOutlined,
  ExclamationCircleOutlined,
  DollarOutlined,
  CalendarOutlined,
  TeamOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import { Line, Pie } from '@ant-design/charts';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

const FundingManagement: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState([moment().subtract(6, 'months'), moment()]);
  const [countryFilter, setCountryFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  
  // 添加loading状态
  const [loading, setLoading] = useState(true);
  
  // 将mock数据改为状态
  const [fundingFlowData, setFundingFlowData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  
  // 获取数据的函数
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 并行请求三个API
        const [transactionsRes, countriesRes, trendsRes] = await Promise.all([
          axios.get('/api/funding/transactions'),
          axios.get('/api/funding/countries'),
          axios.get('/api/funding/monthly-trends')
        ]);
        
        setFundingFlowData(transactionsRes.data);
        setCountryData(countriesRes.data);
        setMonthlyData(trendsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Status mapping display
  const statusMap = {
    installed: { color: 'green', text: 'Installed', icon: <CheckCircleOutlined /> },
    installing: { color: 'blue', text: 'Installing', icon: <ToolOutlined /> },
    preparing: { color: 'orange', text: 'Preparing', icon: <ClockCircleOutlined /> },
    planning: { color: 'purple', text: 'Planning', icon: <ExclamationCircleOutlined /> },
  };

  // 计算统计数据
  const totalFunding = fundingFlowData.reduce((sum, item) => sum + item.amount, 0);
  const totalPanels = countryData.reduce((sum, item) => sum + item.totalPanels, 0);
  const totalCarbonSaved = countryData.reduce((sum, item) => sum + item.carbonSaved, 0);
  const installedPanels = countryData.reduce((sum, item) => sum + item.installedPanels, 0);
  const totalProjects = countryData.reduce((sum, item) => sum + item.projects, 0);

  // Pie chart data - distribution by country
  const fundingPieData = countryData.map(item => ({
    type: item.country,
    value: item.totalFunding,
  }));

  // Line chart configuration
  const lineConfig = {
    data: monthlyData,
    xField: 'month',
    yField: 'amount',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
    yAxis: {
      label: {
        formatter: (v: string) => `$${Number(v).toLocaleString()}`,
      },
    },
  };

  // Pie chart configuration
  const pieConfig = {
    appendPadding: 10,
    data: fundingPieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      formatter: (datum: any) => `${datum.type}: $${(datum.value).toLocaleString()}`,
    },
    interactions: [{ type: 'element-active' }],
  };

  // Filtered funding data
  const filteredFundingData = fundingFlowData.filter(item => {
    // Using native JavaScript date comparison
    const itemDate = new Date(item.date);
    const startDate = timeRange[0] ? timeRange[0].toDate() : new Date(0);
    const endDate = timeRange[1] ? timeRange[1].toDate() : new Date();
    const dateMatch = itemDate >= startDate && itemDate <= endDate;
    const countryMatch = countryFilter.length === 0 || countryFilter.includes(item.country);
    const statusMatch = statusFilter.length === 0 || statusFilter.includes(item.status);
    return dateMatch && countryMatch && statusMatch;
  });

  // Table column definitions
  const columns = [
    {
      title: 'Funding Date',
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => {
        // Using native date formatting
        const date = new Date(text);
        return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
      },
      sorter: (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      filters: countryData.map(country => ({ text: country.country, value: country.country })),
      onFilter: (value: string, record: any) => record.country === value,
    },
    {
      title: 'Community',
      dataIndex: 'community',
      key: 'community',
      ellipsis: true,
    },
    {
      title: 'Donor',
      dataIndex: 'donorName',
      key: 'donorName',
    },
    {
      title: 'Amount (£)',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: number) => `£${text.toLocaleString()}`,
      sorter: (a: any, b: any) => a.amount - b.amount,
    },
    {
      title: 'Solar Panels',
      dataIndex: 'panels',
      key: 'panels',
      sorter: (a: any, b: any) => a.panels - b.panels,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: keyof typeof statusMap) => (
        <Tag icon={statusMap[status].icon} color={statusMap[status].color}>
          {statusMap[status].text}
        </Tag>
      ),
      filters: Object.entries(statusMap).map(([key, value]) => ({ text: value.text, value: key })),
      onFilter: (value: string, record: any) => record.status === value,
    },
    {
      title: 'Completion Date',
      dataIndex: 'completionDate',
      key: 'completionDate',
      render: (text: string) => {
        // Using native date formatting
        const date = new Date(text);
        return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
      },
    },
    {
      title: 'Carbon Reduction (tons)',
      dataIndex: 'carbonSaved',
      key: 'carbonSaved',
      render: (text: number) => `${text.toFixed(1)} tons`,
      sorter: (a: any, b: any) => a.carbonSaved - b.carbonSaved,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Button type="link" size="small">View Details</Button>
      ),
    },
  ];

  
  const countryColumns = [
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'Number of Projects',
      dataIndex: 'projects',
      key: 'projects',
      sorter: (a: any, b: any) => a.projects - b.projects,
    },
    {
      title: 'Total Funding (£)',
      dataIndex: 'totalFunding',
      key: 'totalFunding',
      render: (text: number) => `£${text.toLocaleString()}`,
      sorter: (a: any, b: any) => a.totalFunding - b.totalFunding,
    },
    {
      title: 'Solar Panels',
      dataIndex: 'totalPanels',
      key: 'totalPanels',
      render: (text: number, record: any) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <span>
            Total: {text} panels
          </span>
          <Space>
            <Badge status="success" text={`Installed: ${record.installedPanels}`} />
            <Badge status="processing" text={`Installing: ${record.installingPanels}`} />
          </Space>
        </Space>
      ),
      sorter: (a: any, b: any) => a.totalPanels - b.totalPanels,
    },
    {
      title: 'Installation Progress',
      key: 'installProgress',
      render: (_: any, record: any) => {
        const percent = Math.round(((record.installedPanels + record.installingPanels * 0.5) / record.totalPanels) * 100);
        return (
          <Tooltip title={`Installed: ${record.installedPanels}, Installing: ${record.installingPanels}, Planning: ${record.totalPanels - record.installedPanels - record.installingPanels}`}>
            <Progress
              percent={percent}
              size="small"
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
          </Tooltip>
        );
      },
      sorter: (a: any, b: any) => {
        const percentA = ((a.installedPanels + a.installingPanels * 0.5) / a.totalPanels);
        const percentB = ((b.installedPanels + b.installingPanels * 0.5) / b.totalPanels);
        return percentA - percentB;
      },
    },
    {
      title: 'Carbon Reduction (tons)',
      dataIndex: 'carbonSaved',
      key: 'carbonSaved',
      render: (text: number) => `${text.toFixed(1)} tons`,
      sorter: (a: any, b: any) => a.carbonSaved - b.carbonSaved,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" size="small">View Details</Button>
          <Button type="link" size="small">Fund This Country</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Navigation bar removed */}
      <div
        style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e1f5fe 100%)',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}
      >
        <Title level={3}>Funding Management Dashboard</Title>
        <Paragraph>
          Track and manage funding flows, installation status, and carbon reduction benefits of global solar projects.
        </Paragraph>
        {/* Statistic cards */}
        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable className="stat-card">
              <Statistic
                title={<Space><DollarOutlined /> Total Funding</Space>}
                value={totalFunding}
                precision={0}
                valueStyle={{ color: '#3f8600' }}
                prefix="£"
                suffix=""
                formatter={(value) => `${value?.toLocaleString()}`}
              />
              <div style={{ marginTop: 8 }}>
                <RiseOutlined style={{ color: '#3f8600' }} /> 12% increase from last month
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable className="stat-card">
              <Statistic
                title={<Space><ThunderboltOutlined /> Total Solar Panels</Space>}
                value={totalPanels}
                precision={0}
                valueStyle={{ color: '#0050b3' }}
                suffix={<small style={{ fontSize: '12px', marginLeft: '4px' }}>panels</small>}
              />
              <div style={{ marginTop: 8 }}>
                Installed: {installedPanels} ({Math.round((installedPanels / totalPanels) * 100)}%)
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable className="stat-card">
              <Statistic
                title={<Space><GlobalOutlined /> Funded Countries</Space>}
                value={countryData.length}
                valueStyle={{ color: '#1890ff' }}
              />
              <div style={{ marginTop: 8 }}>
                <Badge status="processing" text={`Total Projects: ${totalProjects}`} />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable className="stat-card">
              <Statistic
                title={<Space><ThunderboltOutlined /> Total Carbon Reduction</Space>}
                value={totalCarbonSaved}
                precision={1}
                valueStyle={{ color: '#389e0d' }}
                suffix="tons"
              />
              <div style={{ marginTop: 8 }}>
                <ThunderboltOutlined style={{ color: '#389e0d' }} /> Equivalent to planting {Math.round(totalCarbonSaved * 45)} trees
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      {/* Main content tabs */}
      <Card style={{ marginBottom: 24 }}>
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={<span><DollarOutlined /> Funding Flow</span>}
            key="1"
          >
            <div style={{ marginBottom: 16 }}>
              <Row gutter={16} align="middle">
                <Col span={12}>
                  <span style={{ marginRight: 8 }}>Time Range:</span>
                  <RangePicker
                    value={timeRange}
                    onChange={(dates) => {
                      // Ensure we have valid date values
                      if (dates && dates.length === 2) {
                        setTimeRange(dates as any);
                      }
                    }}
                    style={{ width: 250 }}
                  />
                </Col>
                <Col span={6}>
                  <span style={{ marginRight: 8 }}>Country:</span>
                  <Select
                    mode="multiple"
                    style={{ width: 180 }}
                    placeholder="Select countries"
                    onChange={(values) => setCountryFilter(values)}
                  >
                    {countryData.map(country => (
                      <Option key={country.country} value={country.country}>{country.country}</Option>
                    ))}
                  </Select>
                </Col>
                <Col span={6}>
                  <span style={{ marginRight: 8 }}>Status:</span>
                  <Select
                    mode="multiple"
                    style={{ width: 180 }}
                    placeholder="Select status"
                    onChange={(values) => setStatusFilter(values)}
                  >
                    {Object.entries(statusMap).map(([key, value]) => (
                      <Option key={key} value={key}>
                        <Tag color={value.color}>{value.text}</Tag>
                      </Option>
                    ))}
                  </Select>
                </Col>
              </Row>
              <Divider />
              <Row gutter={16}>
                <Col span={24}>
                  <Title level={4}>Funding Flow Details</Title>
                  <Table
                    dataSource={filteredFundingData}
                    columns={columns}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                    className="animate-table"
                    scroll={{ x: 1100 }}
                    loading={loading}
                  />
                </Col>
              </Row>
            </div>
          </TabPane>
          <TabPane
            tab={<span><GlobalOutlined /> Country Overview</span>}
            key="2"
          >
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col xs={24} lg={12}>
                <Card title={<Space><PieChartOutlined /> Funding Distribution</Space>} bordered={false}>
                  <div style={{ height: 300 }}>
                    <Pie {...pieConfig} />
                  </div>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title={<Space><LineChartOutlined /> Monthly Funding Trend</Space>} bordered={false}>
                  <div style={{ height: 300 }}>
                    <Line {...lineConfig} />
                  </div>
                </Card>
              </Col>
            </Row>
            <Divider />
            <Title level={4}>Country Funding Details</Title>
            <Table
              dataSource={countryData}
              columns={countryColumns}
              rowKey="country"
              pagination={{ pageSize: 10 }}
              className="animate-table"
              loading={loading}
            />
          </TabPane>
        </Tabs>
      </Card>
      {/* Add CSS to support animation effects */}
      <style jsx global>{`
        .animate-table .ant-table-tbody > tr {
          transition: all 0.3s ease;
        }
        .animate-table .ant-table-tbody > tr:hover {
          transform: translateY(-3px);
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .ant-card {
          transition: all 0.3s ease;
        }
        .ant-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .ant-progress-bg {
          transition: width 0.8s cubic-bezier(0.34, 1.61, 0.7, 1);
        }
        .ant-tag {
          transition: all 0.3s ease;
        }
        .ant-tag:hover {
          transform: scale(1.05);
        }
        .stat-card {
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default FundingManagement;