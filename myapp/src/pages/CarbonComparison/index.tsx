import React, { useState } from 'react';
import { Card, Select, Spin, Row, Col, Typography, Divider } from 'antd';
import { BarChartOutlined, PieChartOutlined } from '@ant-design/icons';
import { Bar, Pie } from '@ant-design/charts';
import { useQuery } from '@tanstack/react-query';
import { fetchChartData } from '../../services/chartService';

const { Option } = Select;
const { Title, Paragraph } = Typography;

const CarbonBenefitComparison: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('Kenya');

  const { data, isLoading, error } = useQuery({
    queryKey: ['chartData', selectedCountry],
    queryFn: () => fetchChartData(selectedCountry),
  });

  if (isLoading) {
    return <Spin style={{ margin: '100px auto', display: 'block' }} />;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error fetching data, please try again later.</div>;
  }

  if (data?.paused) {
    return <div style={{ color: 'orange' }}>Data update paused, please try again later.</div>;
  }

  const barData = data?.barData ?? [];
  const pieData = data?.pieData ?? [];
  const equivalentTrees = data?.equivalentTrees ?? 0;
  const pollutionDiff = data?.pollutionDiff ?? 0;

  const barConfig = {
    data: barData,
    xField: 'type',         // X-axis represents the category
    yField: 'value',        // Y-axis represents the value
    seriesField: 'type',
    legend: false,
    color: ({ type }: any) => (type === 'CO₂ Emission' ? '#FF5252' : '#4CAF50'),
    maxBarWidth: 40,

    autoFit: false,         // ✅ Disable auto width adjustment
    width: 1200,            // ✅ Fixed chart width (adjustable)
    height: 300,            // ✅ Set chart height
    appendPadding: [20, 30, 20, 100],  // ✅ Left padding for Y-axis labels

    yAxis: {
      label: {
        style: {
          fill: '#000',
          fontSize: 14,
        },
        autoHide: false,
        autoRotate: false,
      },
    },
  };

  const pieConfig = {
    appendPadding: 10,
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'element-active' }],
    color: ['#2A5CAA', '#4CAF50', '#FF5252'],
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={1} style={{ color: '#2A5CAA' }}>
          Global Carbon Footprint Comparison Analysis
        </Title>
        <Paragraph style={{ maxWidth: 700, margin: '0 auto', color: '#607D8B' }}>
          Compare carbon emissions and electricity sources by country to understand the environmental impact of solar transformation.
        </Paragraph>
      </div>

      {/* Country & Time Selection */}
      <Row justify="center" gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col>
          <span style={{ marginRight: 8, fontWeight: 500 }}>Select Country:</span>
          <Select value={selectedCountry} style={{ width: 200 }} onChange={val => setSelectedCountry(val)}>
            <Option value="Kenya">Kenya</Option>
            <Option value="Turkey">Turkey</Option>
            <Option value="Southern India">Southern India</Option>
            <Option value="South Africa">South Africa</Option>
            <Option value="Singapore">Singapore</Option>
            <Option value="Latvia">Latvia</Option>
            <Option value="Malaysia">Malaysia</Option>
          </Select>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card
            hoverable
            style={{ borderRadius: 12 }}
            title={
              <span>
                <BarChartOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                Carbon Emission Comparison (Million Tons / Year)
              </span>
            }
          >
            <Bar {...barConfig} style={{ height: 100 }} />
            <Divider dashed />
            <Paragraph>
              <Paragraph>
                <strong>Pollution Difference:</strong> {pollutionDiff} million tons of CO₂ per year<br />
                <strong>Equivalent Trees:</strong> {equivalentTrees.toLocaleString()} trees
              </Paragraph>
            </Paragraph>
          </Card>
        </Col>

        <Col span={24}>
          <Card
            hoverable
            style={{ borderRadius: 12 }}
            title={
              <span>
                <PieChartOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                Electricity Supply Structure (%)
              </span>
            }
          >
            <Pie {...pieConfig} style={{ height: 300 }} />
            <Divider dashed />
            <Paragraph>
              This chart shows how energy is sourced in the selected country. Look for the share of wind, solar, hydro, and fossil fuel.
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CarbonBenefitComparison;
