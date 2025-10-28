import React, { useState } from 'react';
import axios from 'axios';
import {
  Form,
  Input,
  Button,
  Card,
  Select,
  Slider,
  Row,
  Col,
  Typography,
  Divider,
  Radio,
  Statistic,
  Space,
  Alert,
  Spin,
  Tag,
  Result,
  Steps,
  InputNumber,
  Tooltip,
  message
} from 'antd';
import {
  HomeOutlined,
  ThunderboltOutlined,
  InfoCircleOutlined,
  CalculatorOutlined,
  EnvironmentOutlined,
  SaveOutlined,
  QuestionCircleOutlined,
  BarChartOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { Step } = Steps;

const CarbonFootprint: React.FC = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [compareWithUK, setCompareWithUK] = useState(false);

  // 处理表单提交
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      
      const response = await axios.post('/api/carbon-footprint/calculate', {
        propertyAge: values.propertyAge,
        insulation: values.insulation,
        electricityType: values.electricityType,
        electricityUsage: values.electricityUsage
      });

      
      setResult(response.data);
      setCurrentStep(1);
    } catch (error) {
      console.error('Error calculating carbon footprint:', error);
      message.error('Failed to calculate carbon footprint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  
  const handleReset = () => {
    form.resetFields();
  };

  
  const toggleCompareView = () => {
    setCompareWithUK(!compareWithUK);
  };

 
  const recalculate = () => {
    setCurrentStep(0);
    setResult(null);
  };

  return (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e1f5fe 100%)',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}
      >
        <Row gutter={16}>
          <Col xs={24} md={18}>
            <Title level={3}>
              <EnvironmentOutlined /> Household Carbon Footprint Calculator
            </Title>
            <Paragraph>
              Calculate your household's carbon footprint, understand your environmental impact, and discover how to offset carbon emissions by funding solar projects.
            </Paragraph>
          </Col>
          <Col xs={24} md={6} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Button type="primary" icon={<CalculatorOutlined />} onClick={recalculate} disabled={currentStep === 0}>
              Recalculate
            </Button>
          </Col>
        </Row>
      </div>

      <Steps
        current={currentStep}
        style={{ marginBottom: 24 }}
        items={[
          {
            title: 'Enter Information',
            description: 'Fill in residential and energy usage information',
            icon: <HomeOutlined />
          },
          {
            title: 'View Results',
            description: 'Learn about your carbon footprint and reduction suggestions',
            icon: <CalculatorOutlined />
          },
        ]}
      />

      {currentStep === 0 ? (
        <Card
          title={<><HomeOutlined /> Household Information</>}
          className="form-card"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              propertyAge: '1980-2000',
              insulation: 'average',
              electricityType: 'yearly',
              electricityUsage: 3300
            }}
          >
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <span>
                      Property Age
                      <Tooltip title="Different era properties use different building standards, affecting their energy efficiency.">
                        <QuestionCircleOutlined style={{ marginLeft: 8 }} />
                      </Tooltip>
                    </span>
                  }
                  name="propertyAge"
                  rules={[{ required: true, message: 'Please select property age' }]}
                >
                  <Select>
                    <Option value="pre1950">Before 1950</Option>
                    <Option value="1950-1980">1950-1980</Option>
                    <Option value="1980-2000">1980-2000</Option>
                    <Option value="post2000">After 2000</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <span>
                      Insulation Status
                      <Tooltip title="Good insulation can reduce energy consumption and carbon emissions.">
                        <QuestionCircleOutlined style={{ marginLeft: 8 }} />
                      </Tooltip>
                    </span>
                  }
                  name="insulation"
                  rules={[{ required: true, message: 'Please select insulation status' }]}
                >
                  <Select>
                    <Option value="poor">Poor (No insulation or single-glazed windows)</Option>
                    <Option value="average">Average (Partial insulation, double-glazed windows)</Option>
                    <Option value="good">Good (Full house insulation, energy-efficient windows)</Option>
                    <Option value="excellent">Excellent (High-spec insulation, triple-glazed windows)</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Divider dashed />

            <Form.Item
              label={
                <span>
                  <ThunderboltOutlined /> Electricity Usage
                  <Tooltip title="Your electricity consumption is an important factor in calculating your carbon footprint.">
                    <QuestionCircleOutlined style={{ marginLeft: 8 }} />
                  </Tooltip>
                </span>
              }
            >
              <Row gutter={24}>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="electricityType"
                    noStyle
                  >
                    <Radio.Group>
                      <Radio value="yearly">Annual Usage</Radio>
                      <Radio value="monthly">Monthly Average</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col xs={24} md={16}>
                  <Form.Item
                    name="electricityUsage"
                    noStyle
                    rules={[{ required: true, message: 'Please enter electricity usage' }]}
                  >
                    <InputNumber
                      min={1}
                      max={100000}
                      style={{ width: '100%' }}
                      addonAfter="kWh"
                      placeholder="Please enter electricity usage"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Paragraph type="secondary" style={{ marginTop: 8 }}>
                <InfoCircleOutlined /> Tip: The average UK household uses approximately 3,300 kWh per year, or about 275 kWh per month.
              </Paragraph>
            </Form.Item>

            <Divider />

            <Form.Item>
              <Space size="middle">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<CalculatorOutlined />} 
                  size="large"
                  loading={loading}
                >
                  Calculate Carbon Footprint
                </Button>
                <Button onClick={handleReset} size="large">
                  Reset
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      ) : (
        <Spin spinning={loading}>
          {result && (
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={16}>
                <Card className="result-card">
                  <Result
                    status={result.comparisonPercentage > 10 ? "warning" : "success"}
                    title={
                      <Space direction="vertical" size="small">
                        <span>Your Annual Carbon Footprint</span>
                        <span style={{ fontSize: '36px', color: result.comparisonPercentage > 10 ? '#fa8c16' : '#52c41a' }}>
                          {result.carbonFootprint.toLocaleString()} kg CO₂
                        </span>
                      </Space>
                    }
                    subTitle={
                      <Button
                        type="link"
                        onClick={toggleCompareView}
                        icon={<BarChartOutlined />}
                      >
                        {compareWithUK ? "Hide Comparison" : "Compare to UK Average"}
                      </Button>
                    }
                  />

                  {compareWithUK && (
                    <Card style={{ marginTop: 16, backgroundColor: '#f9f9f9' }}>
                      <Row gutter={16} align="middle">
                        <Col span={12} style={{ textAlign: 'center' }}>
                          <Statistic
                            title="Your Carbon Footprint"
                            value={result.carbonFootprint}
                            suffix="kg CO₂/year"
                            valueStyle={{ color: result.comparisonPercentage > 0 ? '#fa8c16' : '#52c41a' }}
                          />
                        </Col>
                        <Col span={12} style={{ textAlign: 'center' }}>
                          <Statistic
                            title="UK Average"
                            value={result.ukAverageCarbonFootprint}
                            suffix="kg CO₂/year"
                            valueStyle={{ color: '#1890ff' }}
                          />
                        </Col>
                      </Row>
                      <div style={{ marginTop: 16 }}>
                        <div style={{ height: 16, backgroundColor: '#e6f7ff', borderRadius: 8, position: 'relative', overflow: 'hidden' }}>
                          <div
                            style={{
                              position: 'absolute',
                              left: '50%',
                              top: 0,
                              bottom: 0,
                              width: '4px',
                              backgroundColor: '#000',
                              opacity: 0.2,
                              transform: 'translateX(-50%)'
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              left: '0',
                              top: 0,
                              bottom: 0,
                              width: `${result.comparisonPercentage > 0 ? (50 + Math.min(result.comparisonPercentage / 2, 50)) : 50}%`,
                              backgroundColor: result.comparisonPercentage > 0 ? '#fa8c16' : '#52c41a',
                              borderRadius: '8px 0 0 8px',
                              transition: 'width 0.8s'
                            }}
                          />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                          <Text>Below Average</Text>
                          <Text>Average</Text>
                          <Text>Above Average</Text>
                        </div>
                      </div>
                      <Alert
                        message={
                          result.comparisonPercentage > 0
                            ? `Your carbon footprint is ${Math.abs(result.comparisonPercentage)}% above the UK average`
                            : `Your carbon footprint is ${Math.abs(result.comparisonPercentage)}% below the UK average`
                        }
                        type={result.comparisonPercentage > 0 ? "warning" : "success"}
                        style={{ marginTop: 16 }}
                        showIcon
                      />
                    </Card>
                  )}

                  <Divider />

                  <Title level={4}>Reduction Suggestions</Title>
                  {result.suggestions.map((suggestion: string, index: number) => (
                    <Alert
                      key={index}
                      message={suggestion}
                      type="info"
                      showIcon
                      style={{ marginBottom: 12 }}
                      icon={<SaveOutlined />}
                    />
                  ))}
                </Card>
              </Col>

              <Col xs={24} lg={8}>
                <Card
                  title="How to Offset Your Carbon Footprint"
                  className="offset-card"
                  actions={[
                    <Button type="primary" block icon={<ThunderboltOutlined />}>
                      Fund Solar Projects
                    </Button>
                  ]}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Statistic
                      title="Recommended Solar Panels to Fund"
                      value={result.solarPanelsNeeded}
                      suffix="panels"
                      valueStyle={{ color: '#1890ff' }}
                    />
                    <Statistic
                      title="Estimated Funding Amount"
                      value={result.costToOffset}
                      prefix="£"
                      precision={0}
                      valueStyle={{ color: '#52c41a' }}
                    />

                    <Divider dashed />

                    <Alert
                      message="Why Choose Solar Projects?"
                      description="Funding solar projects in developing countries not only effectively offsets your carbon emissions but also provides clean electricity to local communities, creates jobs, and promotes sustainable development."
                      type="success"
                      showIcon
                    />

                    <div style={{ marginTop: 16 }}>
                      <Text strong>Your contribution will:</Text>
                      <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                        <li>Offset your entire carbon footprint annually</li>
                        <li>Provide clean electricity to approximately {result.solarPanelsNeeded * 4} people</li>
                        <li>Continue to create positive environmental impact for 25 years</li>
                      </ul>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>
          )}
        </Spin>
      )}

      <style jsx global>{`
        .form-card, .result-card, .offset-card {
          transition: all 0.3s ease;
        }
        .form-card:hover, .result-card:hover, .offset-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .ant-btn {
          transition: all 0.3s ease;
        }
        .ant-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .ant-tag {
          transition: all 0.3s ease;
        }
        .ant-tag:hover {
          transform: scale(1.05);
        }
        .ant-progress-bg {
          transition: width 0.8s cubic-bezier(0.34, 1.61, 0.7, 1);
        }
        .ant-statistic-content {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default CarbonFootprint;