import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSolarData } from '../../services/chartService';

import { Card, Select, Spin, Row, Col, Typography, Divider } from 'antd';
import {
  GlobalOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import { Line } from '@ant-design/charts';

const { Option } = Select;
const { Title, Paragraph } = Typography;

const SolarAnalysis: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('Kenya');

  const { data, isLoading, error } = useQuery({
    queryKey: ['solarData', selectedCountry],
    queryFn: () => fetchSolarData(selectedCountry),
  });

  if (isLoading) {
    return <Spin style={{ margin: '100px auto', display: 'block' }} />;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error fetching data, please try again later.</div>;
  }

  const lineData = (data?.lineData ?? []).map((item) => {
    const rawValue = item.value;
  
    let numericValue = 0;
    if (
      rawValue !== null &&
      rawValue !== undefined &&
      rawValue !== 'null' &&
      rawValue !== 'undefined' &&
      !isNaN(Number(rawValue))
    ) {
      numericValue = Number(rawValue);
    }
  
    return {
      ...item,
      year: Number(item.year),
      value: numericValue,
    };
  });

  const installationData = lineData.filter((item) => item.type === 'Installation Cost');
  const potentialData = lineData.filter((item) => item.type === 'Solar Potential');

  const leftLineConfig = {
    data: installationData,
    xField: 'year',
    yField: 'value',
    smooth: true,
    xAxis: { title: { text: 'Year' } },
    yAxis: { title: { text: 'Cost (GBP)' } },
    color: () => '#FFA726',
    legend: false,
    tooltip: {
      showMarkers: true,
      formatter: (datum: any) => ({
        name: 'Installation Cost',
        value: `${datum.value} GBP`,
      }),
    },    
  };

  const rightLineConfig = {
    data: potentialData,
    xField: 'year',
    yField: 'value',
    smooth: true,
    xAxis: { title: { text: 'Year' } },
    yAxis: { title: { text: 'Solar Potential (GBP/year)' } },
    color: () => '#66BB6A',
    legend: false,
    tooltip: {
      showMarkers: true,
      formatter: (datum: any) => ({
        name: 'Solar Potential',
        value: `${datum.value} GBP/year`,
      }),
    },    
  };

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: '24px' }}>
      {/* Top header section */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={1} style={{ color: '#2A5CAA' }}>
          <GlobalOutlined style={{ marginRight: 8 }} />
          Global Solar Installation Cost and Social Benefit Analysis
        </Title>
        <Paragraph style={{ maxWidth: 700, margin: '0 auto', color: '#607D8B' }}>
          Quickly compare solar installation costs and potentials across countries to uncover sustainable development value.
        </Paragraph>
        <div style={{ marginTop: 16 }}>
          <span style={{ marginRight: 8, fontWeight: 500 }}>Select Country:</span>
          <Select
            showSearch
            placeholder="Enter country name"
            value={selectedCountry}
            style={{ width: 200 }}
            onChange={(val) => setSelectedCountry(val)}
          >
            <Option value="Kenya">Kenya</Option>
            <Option value="Turkey">Turkey</Option>
            <Option value="Southern India">Southern India</Option>
            <Option value="South Africa">South Africa</Option>
            <Option value="Singapore">Singapore</Option>
            <Option value="Latvia">Latvia</Option>
            <Option value="Malaysia">Malaysia</Option>
          </Select>
        </div>
      </div>

      {/* Main content section */}
      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} md={12}>
          <Card
            hoverable
            style={{ borderRadius: 12 }}
            title={
              <span>
                <LineChartOutlined style={{ marginRight: 8, color: '#fa8c16' }} />
                Installation Cost Analysis (GBP)
              </span>
            }
          >
            <Line {...leftLineConfig} style={{ height: 260 }} />
            <Divider dashed />
            <Paragraph>
              This chart shows the cost trend of installing solar systems over the years in the selected region.
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            hoverable
            style={{ borderRadius: 12 }}
            title={
              <span>
                <LineChartOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                Solar Potential and Benefits (GBP/year)
              </span>
            }
          >
            <Line {...rightLineConfig} style={{ height: 260 }} />
            <Divider dashed />
            <Paragraph>
              Higher potential indicates greater solar exposure and more electricity generation from the same system.
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SolarAnalysis;
