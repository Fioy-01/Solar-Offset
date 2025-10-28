import {
  HeartTwoTone,
  SmileTwoTone,
  UserOutlined,
  TeamOutlined,
  LockOutlined,
  EditOutlined
} from '@ant-design/icons';
import React, { useRef, useState, useEffect } from "react";
import { ActionType, PageContainer, ProColumns, ProTable } from "@ant-design/pro-components";
import { useIntl } from '@umijs/max';
import axios from 'axios';
import {
  Alert,
  Card,
  Typography,
  Modal,
  Select,
  Tag,
  Button,
  Row,
  Col,
  Statistic,
  Divider,
  Space,
  Avatar,
  Badge,
  message
} from 'antd';
import { useNavigate } from "@umijs/max";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const Admin: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [status, setStatus] = useState<string>('');
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    newUsersToday: 0
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const intl = useIntl();

  const statusColors = {
    'user': { color: '#108ee9', icon: <UserOutlined /> },
    'admin': { color: '#52c41a', icon: <TeamOutlined /> },
  };

  // 获取统计数据
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get('/api/admin/statistics');
        setStatistics(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        message.error('Failed to load statistics');
      }
    };
    
    fetchStatistics();
  }, []);

  const columns: ProColumns<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'textarea',
      ellipsis: true,
      width: 80,
    },
    {
      title: 'Username',
      dataIndex: 'name',
      valueType: 'text',
      ellipsis: true,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            style={{ marginRight: 8, backgroundColor: record.status === 'admin' ? '#52c41a' : '#1890ff' }}
            icon={record.status === 'admin' ? <TeamOutlined /> : <UserOutlined />}
          />
          {record.name}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      valueType: 'select',
      width: 120,
      valueEnum: {
        'user': { text: 'User', status: 'Processing' },
        'admin': { text: 'Admin', status: 'Success' },
      },
      render: (_, record) => (
        <Tag icon={statusColors[record.status].icon} color={statusColors[record.status].color}>
          {record.status === 'admin' ? 'Admin' : 'User'}
        </Tag>
      ),
    },
    {
      title: 'Registration Date',
      dataIndex: 'registrationDate',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: 'Actions',
      dataIndex: 'op',
      valueType: 'option',
      width: 120,
      render: (_, record) => [
        <Button
          key="edit"
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleChangeStatus(record)}
        >
          Change Status
        </Button>
      ],
    },
  ];

  const handleChangeStatus = (user: any) => {
    setCurrentUser(user);
    setStatus(user.status);
    setIsModalVisible(true);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
  };

  const handleOk = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      // 发送更新请求到后端
      await axios.put('/api/admin/user/status', {
        userId: currentUser.id,
        status: status
      });
      
      message.success('User status updated successfully');
      // 刷新
      actionRef.current?.reload();
      // 刷新
      const response = await axios.get('/api/admin/statistics');
      setStatistics(response.data);
    } catch (error) {
      console.error('Error updating user status:', error);
      message.error('Failed to update user status');
    } finally {
      setLoading(false);
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const jumpto = (name: any) => {
    console.log(name);
    navigate('/key/diagnosis', { state: { name: name } });
  };

  // 处理表格数据加载
  const handleSearch = async (params: any) => {
    try {
      const queryParams = {
        id: params.id,
        name: params.name,
        status: params.status,
        current: params.current || 1,
        pageSize: params.pageSize || 10
      };
      
      // 发送请求到后端
      const response = await axios.get('/api/admin/users', { params: queryParams });
      
      return {
        data: response.data.data || [],
        success: true,
        total: response.data.total || 0
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to load users');
      return {
        data: [],
        success: false,
        total: 0
      };
    }
  };

  return (
    <PageContainer>
      <div style={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e1f5fe 100%)',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <Row gutter={16}>
          <Col xs={24} md={18}>
            <Title level={3}>User Management Console</Title>
            <Paragraph>
              Manage Solar Offset platform user accounts, assign permissions, and monitor account activity.
            </Paragraph>
          </Col>
          <Col xs={24} md={6}>
          </Col>
        </Row>
      </div>

      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="stat-card">
            <Statistic
              title="Total Users"
              value={statistics.totalUsers}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8 }}>
              <Badge status="processing" text={`Active: ${statistics.activeUsers}`} />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="stat-card">
            <Statistic
              title="Administrators"
              value={statistics.adminUsers}
              prefix={<LockOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: 8 }}>
              <Badge status="success" text="All admin permissions normal" />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="stat-card">
            <Statistic
              title="New Users Today"
              value={statistics.newUsersToday}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
            <div style={{ marginTop: 8 }}>
              <Badge status="warning" text="Needs review: 1" />
            </div>
          </Card>
        </Col>
      </Row>

      <Card
        className="table-card"
        title={
          <Space>
            <TeamOutlined />
            <span>User List</span>
          </Space>
        }
      >
        <Alert
          message="System Notice"
          description="Please note that all user status changes are recorded in the system log. Please be cautious when assigning administrator privileges."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <ProTable<any>
          pagination={{ pageSize: 10, current: 1 }}
          rowKey="id"
          search={{
            labelWidth: 120,
            defaultCollapsed: false,
          }}
          scroll={{ x: 'max-content' }}
          options={{
            density: true,
            fullScreen: true,
            reload: true,
          }}
          actionRef={actionRef}
          columns={columns}
          request={(params) => handleSearch(params)}
          rowClassName={() => 'table-row-hover'}
        />
      </Card>

      <Modal
        title={
          <Space>
            <EditOutlined />
            <span>Modify User Status</span>
          </Space>
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Save"
        cancelText="Cancel"
        confirmLoading={loading}
        okButtonProps={{
          style: { background: '#1890ff', borderColor: '#1890ff' }
        }}
      >
        {currentUser && (
          <>
            <p><strong>User:</strong> {currentUser.name}</p>
            <p><strong>Current Status:</strong>
              <Tag
                color={statusColors[currentUser.status].color}
                style={{ marginLeft: 8 }}
              >
                {currentUser.status}
              </Tag>
            </p>
            <Divider />
            <p><strong>Select New Status:</strong></p>
          </>
        )}
        <Select
          value={status}
          onChange={handleStatusChange}
          style={{ width: '100%' }}
        >
          <Option value="user">
            <UserOutlined style={{ marginRight: 8, color: '#108ee9' }} />
            Regular User
          </Option>
          <Option value="admin">
            <TeamOutlined style={{ marginRight: 8, color: '#52c41a' }} />
            Administrator
          </Option>
        </Select>
      </Modal>

      {/* Add CSS animations and styles */}
      <style jsx global>{`
        .stat-card {
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }
        .table-card {
          transition: all 0.3s ease;
        }
        .table-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .table-row-hover {
          transition: all 0.3s ease;
        }
        .table-row-hover:hover {
          background-color: #f0f7ff !important;
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
    </PageContainer>
  );
};

export default Admin;