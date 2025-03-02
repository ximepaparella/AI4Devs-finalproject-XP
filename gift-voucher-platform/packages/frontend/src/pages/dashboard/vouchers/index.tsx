import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import Typography from 'antd/lib/typography';
import Table from 'antd/lib/table';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Space from 'antd/lib/space';
import Tag from 'antd/lib/tag';
import Dropdown from 'antd/lib/dropdown';
import Menu from 'antd/lib/menu';
import Modal from 'antd/lib/modal';
import message from 'antd/lib/message';
import { 
  SearchOutlined, 
  PlusOutlined, 
  MoreOutlined, 
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined
} from '@ant-design/icons/lib';
import MainLayout from '@/components/layout/MainLayout';

const { Title } = Typography;

// Mock data for vouchers
const mockVouchers = [
  {
    id: '1',
    code: 'GIFT100',
    amount: 100,
    status: 'active',
    store: 'Electronics Store',
    createdAt: '2023-01-15',
    expiresAt: '2023-12-31',
  },
  {
    id: '2',
    code: 'GIFT50',
    amount: 50,
    status: 'redeemed',
    store: 'Fashion Outlet',
    createdAt: '2023-02-10',
    expiresAt: '2023-11-30',
  },
  {
    id: '3',
    code: 'GIFT200',
    amount: 200,
    status: 'expired',
    store: 'Home Goods',
    createdAt: '2022-12-05',
    expiresAt: '2023-06-30',
  },
  {
    id: '4',
    code: 'GIFT75',
    amount: 75,
    status: 'active',
    store: 'Bookstore',
    createdAt: '2023-03-20',
    expiresAt: '2024-03-20',
  },
  {
    id: '5',
    code: 'GIFT150',
    amount: 150,
    status: 'active',
    store: 'Sports Shop',
    createdAt: '2023-04-01',
    expiresAt: '2024-04-01',
  },
];

export default function VouchersPage() {
  const { data: session } = useSession();
  const [searchText, setSearchText] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);

  // Filter vouchers based on search text
  const filteredVouchers = mockVouchers.filter(
    (voucher) =>
      voucher.code.toLowerCase().includes(searchText.toLowerCase()) ||
      voucher.store.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleDeleteVoucher = () => {
    // In a real app, you would call an API to delete the voucher
    message.success(`Voucher ${selectedVoucher?.code} deleted successfully`);
    setDeleteModalVisible(false);
  };

  const showDeleteModal = (voucher: any) => {
    setSelectedVoucher(voucher);
    setDeleteModalVisible(true);
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'active':
        return <Tag color="green">Active</Tag>;
      case 'redeemed':
        return <Tag color="blue">Redeemed</Tag>;
      case 'expired':
        return <Tag color="red">Expired</Tag>;
      default:
        return <Tag>Unknown</Tag>;
    }
  };

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Store',
      dataIndex: 'store',
      key: 'store',
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Expires',
      dataIndex: 'expiresAt',
      key: 'expiresAt',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="view" icon={<EyeOutlined />}>
                View Details
              </Menu.Item>
              <Menu.Item key="edit" icon={<EditOutlined />}>
                Edit
              </Menu.Item>
              <Menu.Item key="download" icon={<DownloadOutlined />}>
                Download
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item 
                key="delete" 
                icon={<DeleteOutlined />} 
                danger 
                onClick={() => showDeleteModal(record)}
              >
                Delete
              </Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <MainLayout showSidebar title="Vouchers - Gifty">
      <div className="mb-6 flex justify-between items-center">
        <Title level={2}>Vouchers</Title>
        <Button type="primary" icon={<PlusOutlined />} className="btn-primary">
          Create Voucher
        </Button>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search vouchers by code or store"
          prefix={<SearchOutlined />}
          onChange={handleSearch}
          className="max-w-md"
        />
      </div>

      <Table 
        columns={columns} 
        dataSource={filteredVouchers} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Delete Voucher"
        open={deleteModalVisible}
        onOk={handleDeleteVoucher}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete voucher <strong>{selectedVoucher?.code}</strong>?</p>
        <p>This action cannot be undone.</p>
      </Modal>
    </MainLayout>
  );
} 