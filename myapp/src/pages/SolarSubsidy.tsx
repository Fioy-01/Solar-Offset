import React, { useEffect, useState } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';

type SolarSubsidy = {
  id: number;
  country: string;
  renewablepercentage: number;
  carbonIntensity: number;
};

const SolarSubsidy: React.FC = () => {
  const [data, setData] = useState<SolarSubsidy[]>([]);

  useEffect(() => {
    // @ts-ignore
    setData([
      { id: 1, country: 'Kenya', renewablepercentage: 89.7, carbonIntensity: 97.04 },
      { id: 2, country: 'Turkey', renewablepercentage: 42.2, carbonIntensity: 423.18 },
      { id: 3, country: 'Southern India', renewablepercentage: 27.31, carbonIntensity: 503.93 },
      { id: 4, country: 'South Africa', renewablepercentage: 11.4, carbonIntensity: 655.50 },
      { id: 5, country: 'Singapore', renewablepercentage: 42.4, carbonIntensity: 484.75 },
      { id: 6, country: 'Latvia', renewablepercentage: 64.4, carbonIntensity: 194.99 },
      { id: 7, country: 'Malaysia', renewablepercentage: 19.8, carbonIntensity: 464.29 },
    ]);
  }, []);

  const columns = [
    { title: 'Country', dataIndex: 'country', key: 'country' },
    { title: 'Renewable Percentage (%)', dataIndex: 'renewablepercentage', key: 'renewablepercentage' },
    { title: 'Carbon Intensity (kWh CO₂)', dataIndex: 'carbonIntensity', key: 'carbonIntensity' },
  ];

  return (
    <div style={{ padding: '20px' }}>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <img src="/solar.jpg" alt="Solar Panel" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '12px' }} />
      </div>

      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Solar Funding Tracking</h1>

      <ProTable
        columns={columns}
        dataSource={data}
        rowKey="id"
        search={false}
        pagination={{ pageSize: 10 }}
        options={false}
      />
    </div>
  );
};

export default SolarSubsidy;
