import React, { useState } from 'react';
import {
  Card,
  Select,
  Typography,
  Button,
  Row,
  Col,
  Collapse,
  Modal,
  Input,
  Radio,
} from 'antd';

// @ant-design/icons
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import ReviewSection from './components/ReviewSection';
import PrizeDrawSection from './components/PrizeDrawSection';

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

const FundingPage: React.FC = () => {
  // stepModalVisible 
  const [stepModalVisible, setStepModalVisible] = useState(false);
  const [stepModalContent, setStepModalContent] = useState({ title: '', content: '' });
  const stepDetails = {
    1: {
      title: 'Step 1: Roof Assessment',
      content: 'Measure your roof area, check its orientation (south-facing is best), and identify any shading that could reduce sunlight exposure. This helps estimate panel capacity.'
    },
    2: {
      title: 'Step 2: Choose Panels & Systems',
      content: 'Compare panel types, power ratings, and warranties. Decide between traditional setups and systems using optimizers or microinverters for better efficiency.'
    },
    3: {
      title: 'Step 3: Prepare for Installation',
      content: 'Find a certified installer, explore government subsidies, and determine if you want to connect to the grid or use off-grid battery storage based on your needs.'
    }
  };
  //selectedCountry
  const [selectedCountry, setSelectedCountry] = useState<string>('kenya');

  const countryInfo = {
    kenya: {
      name: 'Kenya',
      description: "Kenya has abundant solar energy resources, yet many rural areas still lack stable electricity supply. Donating solar panels can provide lighting and basic electricity for remote communities, improving education and healthcare conditions, while aligning with the Kenyan government's renewable energy development initiatives.",
    },
    turkey: {
      name: 'Turkey',
      description: 'Southern Turkey enjoys abundant sunshine, making it ideal for solar energy development. In recent years, natural disasters such as earthquakes have severely damaged infrastructure in some regions. Donating solar panels can aid post-disaster reconstruction, enhance energy self-sufficiency, and support Turkey’s national strategy for transitioning to green energy.',
    },
    southern_india: {
      name: 'Southern India',
      description: 'Southern India receives ample sunlight, yet rural areas often experience unstable electricity supply, affecting agriculture and daily life. Donating solar panels can provide reliable power to farmers and schools, promoting educational development and rural revitalization, in line with India’s National Solar Mission.',
    },
    south_africa: {
      name: 'South Africa',
      description: 'South Africa, despite its rich solar resources, has faced a severe power crisis in recent years, with frequent load shedding affecting livelihoods and economic growth. Donating solar panels can provide continuous power support to impoverished communities and remote areas, improving quality of life and promoting sustainable energy transition locally.',
    },
    singapore: {
      name: 'Singapore',
      description: 'Singapore, with its limited land area and high energy dependence, actively promotes green energy development. By donating solar panels to less developed neighboring regions, Singapore can fulfill its regional cooperation commitments, enhance its green national image, and contribute to achieving the long-term goals of the Green Plan 2030.',
    },
    latvia: {
      name: 'Latvia',
      description: 'Latvia, an EU member state, generally has a good energy infrastructure, yet some rural areas still face electricity shortages. Donating solar panels can help these regions accelerate their green transition, enhance energy independence, and align with the EU’s sustainable development policies.',
    },
    malaysia: {
      name: 'Malaysia',
      description: 'Malaysia enjoys abundant sunshine year-round, especially in East Malaysia where many remote villages lack stable grid access. Donating solar panels can provide basic electricity support for local communities, improve residents’ living conditions, and help Malaysia achieve the development goals outlined in its Renewable Energy Roadmap.',
    },
  };

  const onCountryChange = (value: string) => {
    setSelectedCountry(value);
  };

  const [checkoutStep, setCheckoutStep] = useState<number>(1);

  const [selectedProduct, setSelectedProduct] = useState<string>('');

  const [useExistingAddress, setUseExistingAddress] = useState<boolean>(true);

  const [newAddress, setNewAddress] = useState<string>('');

  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [selectedDeliveryCountry, setSelectedDeliveryCountry] = useState<string>('kenya');
  const [postalCode, setPostalCode] = useState<string>('');

  const [checkoutModalVisible, setCheckoutModalVisible] = useState<boolean>(false);

  // when user selects a product
  const handleSelectProduct = (productName: string) => {
    setSelectedProduct(productName);
    setCheckoutStep(1);
    setCheckoutModalVisible(true);
  };

  // when user clicks "Previous" button
  const handlePrevStep = () => {
    if (checkoutStep > 1) {
      setCheckoutStep(checkoutStep - 1);
    }
  };

  // first step: add to cart
  const handleAddToCart = () => {
    // TODO: 
    setCheckoutStep(2);
  };

  // second step: confirm order
  const handleConfirmOrder = () => {
    // TODO: 可在此调用后端接口，确认订单，返回订单ID等
    setCheckoutStep(3);
  };

  // third step: enter address and contact information
  const handleAddressNextStep = () => {
    // TODO: 可在此调用后端接口，保存地址和联系方式
    setCheckoutStep(4);
  };

  const createContribution = async (amount: string) => {
    const response = await fetch('/api/contributions/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: 1,
        product: selectedProduct,
        address: useExistingAddress ? 'existing' : newAddress,
        phone: phoneNumber,
        country: selectedDeliveryCountry,
        postal_code: postalCode,
        project_id: 1,
        amount, 
      }),
    });

    const data = await response.json();
    return data.contribution_id || data.id;
  };



  return (
    // PayPalScriptProvider
    <PayPalScriptProvider
      options={{
        'client-id': 'AeSrsHJnr0u3raqTQaXBizqIXIUbkMYFOpURD-29NG-GS2hhjvT6s9FH2VzXD6jKzsVUG-jIGR8zwZb3',       // Sandbox Client ID
        'currency': 'USD',         // 
        'intent': 'capture'        // intent: "capture" or "authorize"
      }}
    >
      <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#fff' }}>
        <div
          style={{
            backgroundImage: `url('/solar-global-bg.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            padding: '60px 20px',
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.4)', 
            backgroundBlendMode: 'overlay',
          }}
        >

          <Title level={2} style={{ marginBottom: 24 }}>Select a Country</Title>
          <Paragraph style={{ maxWidth: 800, margin: '0 auto' }}>
            Review the background information corresponding to the selected country to help you make a decision.
          </Paragraph>
          <Select
            style={{ width: 300, marginTop: 16 }}
            value={selectedCountry}
            onChange={onCountryChange}
            placeholder="Please select a country"
          >
            {Object.keys(countryInfo).map((key) => (
              <Option key={key} value={key}>
                {countryInfo[key as keyof typeof countryInfo].name}
              </Option>
            ))}
          </Select>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
            <Card
              hoverable
              style={{
                maxWidth: 700,
                width: '100%',
                borderRadius: 12,
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.05)',
                padding: 24,
                backgroundColor: '#ffffff',
                border: '1px solid #f0f0f0',
                textAlign: 'left',
              }}
            >
              <Title level={4}>{countryInfo[selectedCountry].name}</Title>
              <Paragraph>{countryInfo[selectedCountry].description}</Paragraph>
            </Card>
          </div>
        </div>

        <PrizeDrawSection />


        <div style={{ backgroundColor: '#f9f9f9', padding: '40px 20px', textAlign: 'center' }}>
          <Title level={2} style={{ marginBottom: 24 }}>
            Product Selection Guide
          </Title>
          <Paragraph style={{ maxWidth: 800, margin: '0 auto' }}>
            Not sure which solar system suits your home? Follow these simple steps to make an informed decision.
          </Paragraph>
          <Row gutter={[16, 16]} style={{ marginTop: 32 }}>
            <Col xs={24} sm={8}>
              <Card
                hoverable
                style={{ textAlign: 'center' }}
                onClick={() => {
                  setStepModalVisible(true);
                  setStepModalContent(stepDetails[1]);
                }}
              >
                <Title level={4}>Step 1</Title>
                <Paragraph>
                  Measure your available roof area, note its orientation (south-facing is ideal),
                  and check for shading or obstacles that may block sunlight.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card
                hoverable
                style={{ textAlign: 'center' }}
                onClick={() => {
                  setStepModalVisible(true);
                  setStepModalContent(stepDetails[2]);
                }}
              >

                <Title level={4}>Step 2</Title>
                <Paragraph>
                  Explore different panel types, power ratings, and warranties. Consider installation methods
                  and choose between standard or optimized systems.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card
                hoverable
                style={{ textAlign: 'center' }}
                onClick={() => {
                  setStepModalVisible(true);
                  setStepModalContent(stepDetails[3]);
                }}
              >
                <Title level={4}>Step 3</Title>
                <Paragraph>
                  Contact certified installers, confirm available subsidies, and prepare for grid connection
                  or off-grid storage options depending on your needs.
                </Paragraph>
              </Card>
            </Col>
          </Row>
          <Modal
            title={stepModalContent.title}
            visible={stepModalVisible}
            footer={null}
            centered
            onCancel={() => setStepModalVisible(false)}
          >
            <Paragraph>{stepModalContent.content}</Paragraph>
          </Modal>
        </div>

        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <Title level={2} style={{ marginBottom: 16 }}>
            Customized Services
          </Title>
          <Paragraph style={{ maxWidth: 800, margin: '0 auto' }}>
            If you have additional requirements, please contact us for customized solutions.
          </Paragraph>
          <Paragraph style={{ marginTop: 16 }}>
            Or call us directly at <a href="tel:+441234567890">+44 1234 567890</a>
          </Paragraph>

        </div>

        <div style={{ backgroundColor: '#fff', padding: '40px 20px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
            Donation Options
          </Title>
          <Paragraph style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
            Choose how you'd like to bring clean energy to communities in need.
            You can either fund a shared solar station or donate a home-based rooftop system.
          </Paragraph>

          <Row gutter={[16, 16]} style={{ marginTop: 32, maxWidth: 1200, margin: '0 auto' }}>
            <Col xs={24} sm={12}>
              <Card
                hoverable
                style={{ textAlign: 'center', padding: '20px', cursor: 'pointer' }}
                onClick={() => handleSelectProduct('Solar Roof-Light Kit')}
              >
                <div style={{ margin: '0 auto 24px', textAlign: 'center' }}>
                  <img
                    src="/solar-house.png"
                    alt="Solar House Icon"
                    style={{ width: 72, height: 'auto', objectFit: 'contain' }}
                  />
                </div>
                <Title level={4}>Solar Roof-Light Kit</Title>
                <Paragraph>
                  Provide a family with a rooftop solar system including battery and lighting — perfect for daily living essentials.
                </Paragraph>
                <Paragraph>
                  Starting at: <b>£200</b> (Includes panel, battery, lights, and USB charging ports)
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} sm={12}>
              <Card
                hoverable
                style={{ textAlign: 'center', padding: '20px', cursor: 'pointer' }}
                onClick={() => handleSelectProduct('Power a Community Together')}
              >
                <div style={{ margin: '0 auto 24px', textAlign: 'center' }}>
                  <img
                    src="/community-solar.png"
                    alt="Community Solar Icon"
                    style={{ width: 72, height: 'auto', objectFit: 'contain' }}
                  />
                </div>
                <Title level={4}>Power a Community Together</Title>
                <Paragraph>
                  Fund solar hubs for schools, clinics or shared community needs in areas with unstable or no electricity.
                </Paragraph>
                <Paragraph>
                  Starting at: <b>£200</b> per donation (Supports centralized microgrid deployment)
                </Paragraph>
              </Card>
            </Col>
          </Row>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Paragraph>
              Each donation includes installation, warranty and community education support.
            </Paragraph>
          </div>
        </div>



        <Modal
          title="Purchase Process" // purchase process
          visible={checkoutModalVisible}
          onCancel={() => {
            setCheckoutModalVisible(false);
            setCheckoutStep(1);
            setSelectedProduct('');
          }}
          footer={null}
        >
          {/* first step: add to cart
          */}
          {checkoutStep === 1 && (
            <div style={{ textAlign: 'center' }}>
              <Title level={4}>Add to Cart </Title>
              <Paragraph>
                Selected product: {selectedProduct}
              </Paragraph>
              <div style={{ marginTop: 24 }}>
                <Button type="primary" onClick={handleAddToCart}>
                  Add to Cart 
                </Button>
              </div>
            </div>
          )}

          {/* second step: confirm order
          */}
          {checkoutStep === 2 && (
            <div style={{ textAlign: 'center' }}>
              <Title level={4}>Order Confirmation </Title>
              <Paragraph>
                Cart: {selectedProduct}
              </Paragraph>
              <div style={{ marginTop: 24 }}>
                <Button style={{ marginRight: 16 }} onClick={handlePrevStep}>
                  Previous
                </Button>
                <Button type="primary" onClick={handleConfirmOrder}>
                  Confirm Order 
                </Button>
              </div>
            </div>
          )}

          {/* third step: enter address and contact information
          */}
          {checkoutStep === 3 && (
            <div style={{ textAlign: 'center' }}>
              <Title level={4}>Enter Address and Contact Information </Title>
              <Paragraph>
                Please choose to use an existing address or enter a new one:
              </Paragraph>
              <Radio.Group
                style={{ marginBottom: 16 }}
                value={useExistingAddress}
                onChange={(e) => setUseExistingAddress(e.target.value)}
              >
                <Select
                  style={{ width: '100%', marginBottom: 16 }}
                  value={selectedDeliveryCountry}
                  onChange={setSelectedDeliveryCountry}
                  placeholder="Select a country for delivery"
                >
                  {Object.keys(countryInfo).map((key) => (
                    <Option key={key} value={key}>
                      {countryInfo[key as keyof typeof countryInfo].name}
                    </Option>
                  ))}
                </Select>
                <Input
                  placeholder="Enter Postal Code"
                  style={{ marginBottom: 16 }}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
                <Radio value={true}>Use Existing Address </Radio>
                <Radio value={false}>Enter New Address </Radio>
              </Radio.Group>
              {!useExistingAddress && (
                <Input
                  placeholder="Please enter your address"
                  style={{ marginBottom: 16 }}
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                />
              )}
              <Input
                placeholder="Please enter your contact information" 
                style={{ marginBottom: 16 }}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <div style={{ marginTop: 24 }}>
                <Button style={{ marginRight: 16 }} onClick={handlePrevStep}>
                  Previous
                </Button>
                <Button type="primary" onClick={handleAddressNextStep}>
                  Next 
                </Button>
              </div>
            </div>
          )}

          {/* fourth step: payment
          */}
          {checkoutStep === 4 && (
            <div style={{ textAlign: 'center' }}>
              <Title level={4}>Pay Order </Title>
              <Paragraph>Select Payment Method:</Paragraph>
              <Radio.Group defaultValue="paypal" style={{ marginBottom: 16 }}>
                <Radio value="paypal">PayPal</Radio>
              </Radio.Group>

              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        description: selectedProduct,
                        amount: {
                          value: "0.20", 
                        },
                      },
                    ],
                  });
                }}
                onApprove={async (data, actions) => {
                  const order = await actions.order.capture();
                  const amount = order.purchase_units?.[0]?.amount?.value || '0';

                  try {
                    const contributionId = await createContribution(amount); 

                    const response = await fetch('/api/payments/', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        user_id: 1,
                        contribution_id: contributionId,
                        payment_method: 'paypal',
                        amount,
                      }),
                    });

                    const result = await response.json();
                    const paymentId = result.payment_id || result.id;

                    await fetch(`/api/payments/${paymentId}/status`, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ status: 'success' }),
                    });

                    alert(`Payment successful, Transaction ID: ${order.id}`);
                    setCheckoutModalVisible(false);
                    setCheckoutStep(1);
                    setSelectedProduct('');
                  } catch (err) {
                    console.error('[PayPal] payment error:', err);
                    alert('Payment succeeded but failed to save record.');
                  }
                }}




                onError={(err) => {
                  console.error("Payment error:", err);
                  alert("An error occurred during payment, please try again.");
                }}
              />
              <div style={{ marginTop: 16 }}>
                <Button onClick={handlePrevStep}>Previous</Button>
              </div>
            </div>
          )}
        </Modal>

        <ReviewSection />

        <div style={{ backgroundColor: '#fcf8f6', padding: '60px 20px', textAlign: 'center' }}>
          <Title level={2} style={{ marginBottom: 40, color: '#2a0a3c', fontWeight: 700 }}>
            Frequently asked questions.
          </Title>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <Collapse
              accordion
              expandIconPosition="end"
              bordered={false}
              style={{ backgroundColor: 'transparent' }}
            >
              {[...Array(5)].map((_, i) => (
                <Panel
                  key={i + 1}
                  header={
                    <span style={{ fontWeight: 600, color: '#2a0a3c' }}>
                      {[
                        "Is there enough sunlight in my region for solar panels?",
                        "Why include battery storage with donated solar panels?",
                        "Do I need government approval or special permission?",
                        "What if my roof or home isn't suitable for panels?",
                        "How does the donation process work, and is it truly free?",
                      ][i]}
                    </span>
                  }
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    marginBottom: 16,
                    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #f0f0f0',
                  }}
                >
                  <Paragraph style={{ margin: 0, fontSize: 14, color: '#444' }}>
                    {[
                      "Yes. All the regions we support—such as Malaysia, Singapore, South Africa, Southern India, Turkey, and Kenya—receive high levels of solar radiation year-round. This makes them ideal locations for solar panel use, with some areas receiving over 5 kWh/m²/day of sunlight.",
                      "Battery storage allows families to use solar energy even at night or during power outages. In many rural or remote areas where grid electricity is unstable or unavailable, batteries help ensure reliable lighting, phone charging, and basic appliances.",
                      "In most areas, no special permission is needed for small-scale solar installations, especially for off-grid setups. However, we work with local partners and community leaders to ensure all installations follow national and local regulations.",
                      "If your roof is not suitable due to material, angle, or shade, we offer flexible solutions such as ground-mounted panels or portable solar kits. Our team assesses each location before installation to find the safest and most effective option.",
                      "Yes, for qualified households and communities, the solar panels and basic installation are fully covered by donor contributions. We work with trusted local NGOs to handle logistics, verification, and support, ensuring transparency and fairness.",
                    ][i]}
                  </Paragraph>
                </Panel>
              ))}
            </Collapse>
          </div>
        </div>


      </div>
    </PayPalScriptProvider>
  );
};
export default FundingPage;
