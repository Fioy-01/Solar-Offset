import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

const PrizeDrawSection: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: '#e6f7ff',
        padding: '60px 20px',
        textAlign: 'center',
      }}
    >
      <Title>Win a Mystery Prize 🎁</Title>
      <Paragraph style={{ maxWidth: 600, margin: '0 auto' }}>
        If you purchase our product, you’ll have a chance to win a mysterious reward
        —from eco-friendly gadgets to exclusive green gifts.
        Join our sustainable journey today!
      </Paragraph>

      <img
        src="/gift-box.png" 
        alt="Mystery Gift"
        style={{
          width: 200,
          height: 200,
          marginTop: 20,
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}
      />
    </div>
  );
};

export default PrizeDrawSection;
