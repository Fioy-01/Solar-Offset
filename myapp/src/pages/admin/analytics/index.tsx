import React, { useState } from 'react';
import {
  Layout,
  Card,
  Row,
  Col,
  Typography,
  Statistic,
  Button,
  Select,
  Tabs,
  Divider,
  Table,
  Tag,
  Progress,
  Empty
} from 'antd';
import {
  GlobalOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
  LineChartOutlined,
  CompassOutlined,
  ArrowUpOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { Line, Pie, Column } from '@ant-design/charts';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// Country solar potential data
const countrySolarData = [
  {
    country: 'Kenya',
    solarPotential: 5.5, // kWh/m²/day
    populationBenefit: 'High',
    electricityAccess: 75, // % of population with reliable electricity
    carbonIntensity: 0.32, // kg CO₂/kWh
    installationCost: 1200, // $ per kW
    fundedProjects: 12,
    totalFunding: 85000
  },
  {
    country: 'Ghana',
    solarPotential: 5.2,
    populationBenefit: 'High',
    electricityAccess: 85,
    carbonIntensity: 0.28,
    installationCost: 1350,
    fundedProjects: 9,
    totalFunding: 73000
  },
  {
    country: 'Ethiopia',
    solarPotential: 5.8,
    populationBenefit: 'Very High',
    electricityAccess: 45,
    carbonIntensity: 0.19,
    installationCost: 1100,
    fundedProjects: 15,
    totalFunding: 95000
  },
  {
    country: 'Tanzania',
    solarPotential: 5.4,
    populationBenefit: 'High',
    electricityAccess: 40,
    carbonIntensity: 0.24,
    installationCost: 1250,
    fundedProjects: 8,
    totalFunding: 65000
  },
  {
    country: 'Morocco',
    solarPotential: 5.6,
    populationBenefit: 'Medium',
    electricityAccess: 99,
    carbonIntensity: 0.46,
    installationCost: 1050,
    fundedProjects: 10,
    totalFunding: 78000
  },
  {
    country: 'Senegal',
    solarPotential: 5.3,
    populationBenefit: 'High',
    electricityAccess: 70,
    carbonIntensity: 0.38,
    installationCost: 1300,
    fundedProjects: 7,
    totalFunding: 59000
  },
];

// Total data
const totalFunding = countrySolarData.reduce((sum, item) => sum + item.totalFunding, 0);
const totalProjects = countrySolarData.reduce((sum, item) => sum + item.fundedProjects, 0);
const totalSolarCapacity = 4250; // kW
const totalCarbonReduction = 805; // tons
const totalPanelsInstalled = 15680;
const totalBeneficiaries = 42600; // people

// Monthly carbon reduction data
const carbonReductionData = [
  { month: 'Jan', value: 45 },
  { month: 'Feb', value: 52 },
  { month: 'Mar', value: 61 },
  { month: 'Apr', value: 65 },
  { month: 'May', value: 72 },
  { month: 'Jun', value: 78 },
  { month: 'Jul', value: 80 },
  { month: 'Aug', value: 82 },
  { month: 'Sep', value: 85 },
  { month: 'Oct', value: 89 },
  { month: 'Nov', value: 95 },
  { month: 'Dec', value: 100 }
];

// Project impact comparison data
const impactComparisonData = [
  { country: 'Kenya', carbonSaved: 182, beneficiaries: 9800, electricityGenerated: 420 },
  { country: 'Ghana', carbonSaved: 145, beneficiaries: 7500, electricityGenerated: 380 },
  { country: 'Ethiopia', carbonSaved: 210, beneficiaries: 11200, electricityGenerated: 480 },
  { country: 'Tanzania', carbonSaved: 120, beneficiaries: 6300, electricityGenerated: 310 },
  { country: 'Morocco', carbonSaved: 90, beneficiaries: 4500, electricityGenerated: 290 },
  { country: 'Senegal', carbonSaved: 58, beneficiaries: 3300, electricityGenerated: 210 }
];

// Chart configurations
const carbonLineConfig = {
  data: carbonReductionData,
  xField: 'month',
  yField: 'value',
  point: {
    size: 5,
    shape: 'diamond',
  },
  label: {
    style: {
      fill: '#aaa',
    },
  },
  color: '#52c41a',
};

const potentialPieConfig = {
  appendPadding: 10,
  data: countrySolarData.map(item => ({
    type: item.country,
    value: item.solarPotential
  })),
  angleField: 'value',
  colorField: 'type',
  radius: 0.8,
  label: {
    type: 'outer',
    formatter: (datum) => `${datum.type}: ${datum.value}`,
  },
  interactions: [{ type: 'element-active' }],
};

const impactColumnConfig = {
  data: impactComparisonData,
  isGroup: true,
  xField: 'country',
  yField: 'value',
  seriesField: 'type',
  columnStyle: {
    radius: [20, 20, 0, 0],
  },
};

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('impact');
  const [compareCountry, setCompareCountry] = useState('Ethiopia');

  // Table column configuration
  const countryColumns = [
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      sorter: (a, b) => a.country.localeCompare(b.country),
    },
    {
      title: 'Solar Potential (kWh/m²/day)',
      dataIndex: 'solarPotential',
      key: 'solarPotential',
      sorter: (a, b) => a.solarPotential - b.solarPotential,
      render: (value) => (
        <Tag color={value > 5.5 ? 'green' : value > 5.0 ? 'lime' : 'gold'}>
          {value} kWh/m²/day
        </Tag>
      )
    },
    {
      title: 'Electricity Access',
      dataIndex: 'electricityAccess',
      key: 'electricityAccess',
      sorter: (a, b) => a.electricityAccess - b.electricityAccess,
      render: (value) => (
        <Progress
          percent={value}
          size="small"
          strokeColor={value < 50 ? '#faad14' : value < 80 ? '#1890ff' : '#52c41a'}
        />
      )
    },
    {
      title: 'Installation Cost ($/kW)',
      dataIndex: 'installationCost',
      key: 'installationCost',
      sorter: (a, b) => a.installationCost - b.installationCost,
      render: (value) => `$${value.toLocaleString()}`
    },
    {
      title: 'Number of Projects',
      dataIndex: 'fundedProjects',
      key: 'fundedProjects',
      sorter: (a, b) => a.fundedProjects - b.fundedProjects,
    },
    {
      title: 'Total Funding',
      dataIndex: 'totalFunding',
      key: 'totalFunding',
      sorter: (a, b) => a.totalFunding - b.totalFunding,
      render: (value) => `$${value.toLocaleString()}`
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" size="small">Fund This Country</Button>
      ),
    },
  ];

  const getImpactData = () => {
    const selectedCountry = impactComparisonData.find(item => item.country === compareCountry);
    if (!selectedCountry) return [];

    // UK data (fixed values for comparison)
    const ukData = {
      country: 'UK',
      carbonSaved: 65,
      beneficiaries: 2400,
      electricityGenerated: 220
    };

    // Convert to chart format
    return [
      { country: 'UK', type: 'Carbon Reduction (tons)', value: ukData.carbonSaved },
      { country: 'UK', type: 'Beneficiaries (÷100)', value: ukData.beneficiaries / 100 },
      { country: 'UK', type: 'Electricity Generated (MWh)', value: ukData.electricityGenerated },
      { country: selectedCountry.country, type: 'Carbon Reduction (tons)', value: selectedCountry.carbonSaved },
      { country: selectedCountry.country, type: 'Beneficiaries (÷100)', value: selectedCountry.beneficiaries / 100 },
      { country: selectedCountry.country, type: 'Electricity Generated (MWh)', value: selectedCountry.electricityGenerated }
    ];
  };

  // Update column chart config
  const updatedImpactConfig = {
    ...impactColumnConfig,
    data: getImpactData()
  };

  return (
    <Content style={{ padding: '0 24px', marginTop: 16 }}>
      <div
        className="site-layout-background"
        style={{
          padding: 24,
          minHeight: 280,
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e1f5fe 100%)',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <Title level={2}>Solar Offset | Project Overview & Impact Analysis</Title>
          <Paragraph>
            Reduce your carbon footprint and promote sustainable development by supporting global solar projects. View project impact, compare solar potential across different countries, and make informed funding decisions.
          </Paragraph>
        </div>

        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card>
              <Statistic
                title="Total Funding"
                value={totalFunding}
                precision={0}
                valueStyle={{ color: '#3f8600' }}
                prefix="$"
                formatter={(value) => `${value.toLocaleString()}`}
              />
              <div style={{ marginTop: 8 }}>
                <ArrowUpOutlined style={{ color: '#3f8600' }} /> 18% YoY Growth
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card>
              <Statistic
                title="Total Projects"
                value={totalProjects}
                valueStyle={{ color: '#1890ff' }}
              />
              <div style={{ marginTop: 8 }}>
                Covering {countrySolarData.length} countries
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card>
              <Statistic
                title="Total Capacity"
                value={totalSolarCapacity}
                valueStyle={{ color: '#722ed1' }}
                suffix="kW"
              />
              <div style={{ marginTop: 8 }}>
                {totalPanelsInstalled.toLocaleString()} solar panels
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card>
              <Statistic
                title="Carbon Reduction"
                value={totalCarbonReduction}
                precision={0}
                valueStyle={{ color: '#52c41a' }}
                suffix="tons"
              />
              <div style={{ marginTop: 8 }}>
                <ThunderboltOutlined style={{ color: '#52c41a' }} /> Equivalent to planting {Math.round(totalCarbonReduction * 45).toLocaleString()} trees
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card>
              <Statistic
                title="Beneficiaries"
                value={totalBeneficiaries}
                precision={0}
                valueStyle={{ color: '#fa8c16' }}
                formatter={(value) => `${value.toLocaleString()}`}
              />
              <div style={{ marginTop: 8 }}>
                <GlobalOutlined style={{ color: '#fa8c16' }} /> Improved living conditions
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card>
              <Button
                type="primary"
                size="large"
                block
                style={{ marginTop: 8, height: 70, fontSize: 16, fontWeight: 'bold' }}
              >
                Fund Projects Now
              </Button>
            </Card>
          </Col>
        </Row>

        <Card style={{ marginBottom: 24 }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
          >
            <TabPane
              tab={<span><ThunderboltOutlined />Project Impact</span>}
              key="impact"
            >
              <Row gutter={16}>
                <Col xs={24} lg={12}>
                  <Card title="Monthly Carbon Reduction Trend" bordered={false}>
                    <div style={{ height: 300 }}>
                      <Line {...carbonLineConfig} />
                    </div>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card
                    title="UK vs Funded Country Comparison"
                    bordered={false}
                    extra={
                      <Select
                        value={compareCountry}
                        style={{ width: 120 }}
                        onChange={setCompareCountry}
                      >
                        {countrySolarData.map(country => (
                          <Option key={country.country} value={country.country}>{country.country}</Option>
                        ))}
                      </Select>
                    }
                  >
                    <div style={{ height: 300 }}>
                      <Column {...updatedImpactConfig} />
                    </div>
                  </Card>
                </Col>
              </Row>

              <Divider orientation="left">Project Impact Details</Divider>
              <Paragraph>
                <InfoCircleOutlined style={{ marginRight: 8 }} />
                The same funding can produce greater carbon reduction effects in developing countries. For example, solar projects in {compareCountry} generate
                <Text strong style={{ margin: '0 4px' }}>
                  {Math.round((impactComparisonData.find(i => i.country === compareCountry)?.carbonSaved || 0) / 65 * 100 - 100)}%
                </Text>
                more carbon reduction than in the UK, while also providing clean energy and job opportunities for local communities.
              </Paragraph>

              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col xs={24} md={8}>
                  <Card>
                    <Statistic
                      title="Total Carbon Reduction"
                      value={totalCarbonReduction}
                      suffix="tons CO₂"
                      precision={0}
                      valueStyle={{ color: '#52c41a' }}
                    />
                    <Paragraph style={{ marginTop: 16 }}>
                      Equivalent to removing {Math.round(totalCarbonReduction / 4.6).toLocaleString()} cars from the road for one year,
                      or planting {(totalCarbonReduction * 45).toLocaleString()} trees in the UK.
                    </Paragraph>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card>
                    <Statistic
                      title="Total Clean Energy Generated"
                      value={2180}
                      suffix="MWh/year"
                      precision={0}
                      valueStyle={{ color: '#1890ff' }}
                    />
                    <Paragraph style={{ marginTop: 16 }}>
                      Providing enough electricity to power approximately {(2180 * 0.8).toLocaleString()} homes for a year,
                      reducing dependence on fossil fuels.
                    </Paragraph>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card>
                    <Statistic
                      title="Total Social Impact"
                      value={42600}
                      suffix="people benefiting"
                      precision={0}
                      valueStyle={{ color: '#fa8c16' }}
                      formatter={(value) => `${value.toLocaleString()}`}
                    />
                    <Paragraph style={{ marginTop: 16 }}>
                      Including communities gaining stable electricity, creating approximately {Math.round(totalProjects * 5).toLocaleString()} local jobs,
                      and supporting educational and medical facilities.
                    </Paragraph>
                  </Card>
                </Col>
              </Row>
            </TabPane>

            <TabPane
              tab={<span><CompassOutlined />Country Comparison</span>}
              key="compare"
            >
              <Row gutter={16}>
                <Col span={24}>
                  <Card title="Solar Potential Comparison" bordered={false}>
                    <div style={{ marginBottom: 16 }}>
                      <Text>
                        Data shows that these countries have much higher solar generation potential than the UK average (2.8 kWh/m²/day), meaning funding can have a greater impact in these regions.
                      </Text>
                    </div>
                    <Row gutter={16}>
                      <Col xs={24} md={12} lg={8}>
                        <div style={{ height: 300 }}>
                          <Pie {...potentialPieConfig} />
                        </div>
                      </Col>
                      <Col xs={24} md={12} lg={16}>
                        <Table
                          dataSource={countrySolarData}
                          columns={countryColumns}
                          rowKey="country"
                          pagination={false}
                          scroll={{ x: 900 }}
                          className="animate-table"
                          size="middle"
                        />
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>

              <Divider orientation="left">Why Fund Solar Projects in These Countries?</Divider>
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Card title="Environmental Benefits" bordered={false}>
                    <Paragraph>
                      These countries have above-average solar potential, capable of generating more clean energy. For example, Ethiopia's solar potential (5.8 kWh/m²/day) is more than twice that of the UK (2.8 kWh/m²/day).
                    </Paragraph>
                    <Paragraph>
                      Additionally, these countries often rely on high-carbon emission energy sources such as diesel generators and coal. Replacing these energy sources can produce more significant carbon reduction effects.
                    </Paragraph>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card title="Social Benefits" bordered={false}>
                    <Paragraph>
                      Many developing countries have low electricity coverage rates, such as Ethiopia (45%) and Tanzania (40%). Solar projects can provide basic electricity services to areas without access.
                    </Paragraph>
                    <Paragraph>
                      These projects also create local employment opportunities, promote economic development, support the operation of educational and medical facilities, and improve local quality of life.
                    </Paragraph>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card title="Economic Benefits" bordered={false}>
                    <Paragraph>
                      The installation cost of solar systems in these countries is typically lower than in developed countries, allowing the same amount of funding to install more solar systems. For example, the cost of installing a 1kW solar system in Morocco ($1050) is about 40% lower than in the UK.
                    </Paragraph>
                    <Paragraph>
                      These projects also reduce local dependence on imported fuels, lower energy costs, and improve energy security.
                    </Paragraph>
                  </Card>
                </Col>
              </Row>
            </TabPane>

            <TabPane
              tab={<span><BarChartOutlined />My Contribution</span>}
              key="personal"
            >
              <Empty
                image={Empty.PRESENTED_IMAGE_DEFAULT}
                description={
                  <span>
                    Please <a href="#">login</a> to view your personal contributions and impact analysis
                  </span>
                }
              >
                <Button type="primary">Login Now</Button>
              </Empty>
            </TabPane>
          </Tabs>
        </Card>

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
        `}</style>
      </div>
    </Content>
  );
};

export default Dashboard;