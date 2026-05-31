'use client';

import React from 'react';
import { motion } from 'framer-motion';
import MobilePreview from './ui/MobilePreview';

interface TemplateShowcaseProps {
  templateId: number;
}

const TemplateShowcase: React.FC<TemplateShowcaseProps> = ({ templateId }) => {
  const renderTemplate = () => {
    switch (templateId) {
      case 1:
        return (
          <div className="w-full h-full bg-white">
            {/* Header */}
            <div className="bg-linear-to-r from-blue-600 to-blue-400 text-white p-6">
              <h1 className="text-2xl font-bold mb-2">Tech Solutions</h1>
              <p className="text-sm opacity-90">Giải pháp công nghệ hàng đầu</p>
            </div>

            {/* Navigation */}
            <div className="flex gap-2 p-4 border-b bg-gray-50 text-xs">
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded">Trang chủ</button>
              <button className="px-3 py-1">Dịch vụ</button>
              <button className="px-3 py-1">Về chúng tôi</button>
              <button className="px-3 py-1">Liên hệ</button>
            </div>

            {/* Hero Section */}
            <div className="p-6 bg-linear-to-b from-blue-50 to-white">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Dịch vụ của chúng tôi</h2>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded border border-blue-100">
                  <p className="font-semibold text-sm text-blue-700">💻 Web Development</p>
                </div>
                <div className="p-3 bg-white rounded border border-blue-100">
                  <p className="font-semibold text-sm text-blue-700">📱 App Development</p>
                </div>
                <div className="p-3 bg-white rounded border border-blue-100">
                  <p className="font-semibold text-sm text-blue-700">🎨 UI/UX Design</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="p-4 m-4 bg-blue-600 text-white rounded-lg text-center">
              <p className="text-sm font-bold">Bắt đầu ngay</p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="w-full h-full bg-white">
            {/* Header */}
            <div className="bg-linear-to-r from-emerald-600 to-emerald-400 text-white p-4 flex justify-between items-center">
              <h1 className="font-bold">ShopHub</h1>
              <span className="bg-red-500 px-2 py-1 rounded text-xs">🛒 0</span>
            </div>

            {/* Search */}
            <div className="p-3 border-b">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full px-3 py-2 border rounded-lg text-xs"
              />
            </div>

            {/* Products */}
            <div className="p-3 space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex gap-3 pb-3 border-b">
                  <div className="w-16 h-16 bg-linear-to-br from-emerald-100 to-emerald-50 rounded" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Sản phẩm {item}</p>
                    <p className="text-xs text-gray-600 mt-1">Mô tả sản phẩm ngắn</p>
                    <p className="text-sm font-bold text-emerald-600 mt-2">999.000đ</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom */}
            <div className="p-3 border-t flex gap-2">
              <button className="flex-1 bg-emerald-600 text-white py-2 rounded text-sm font-bold">
                Mua ngay
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="w-full h-full bg-gray-900 text-white">
            {/* Header */}
            <div className="bg-purple-700 p-4 flex justify-between items-center">
              <h1 className="font-bold text-sm">AdminHub</h1>
              <span className="w-6 h-6 rounded-full bg-purple-500" />
            </div>

            {/* Navigation */}
            <div className="flex gap-2 p-3 border-b border-gray-700 text-xs">
              <span className="px-2 py-1 bg-purple-700 rounded">📊 Tổng quan</span>
              <span className="px-2 py-1 text-gray-400">👥 Người dùng</span>
              <span className="px-2 py-1 text-gray-400">⚙️ Cài đặt</span>
            </div>

            {/* Stats */}
            <div className="p-4 space-y-3">
              {[
                { label: 'Doanh thu', value: '2.5M', color: 'from-green-600 to-green-400' },
                { label: 'Đơn hàng', value: '1,234', color: 'from-blue-600 to-blue-400' },
                { label: 'Người dùng', value: '5.2K', color: 'from-purple-600 to-purple-400' },
              ].map((stat, idx) => (
                <div key={idx} className={`p-3 rounded-lg bg-linear-to-r ${stat.color}`}>
                  <p className="text-xs opacity-90">{stat.label}</p>
                  <p className="font-bold text-lg">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Chart Placeholder */}
            <div className="p-4">
              <div className="h-20 bg-gray-800 rounded flex items-end justify-center gap-1 p-2">
                {[60, 40, 70, 50, 80].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-linear-to-t from-purple-600 to-purple-400 rounded"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const templateInfo = {
    1: {
      title: 'Website Giới Thiệu & Dịch Vụ',
      description: 'Thiết kế chuyên nghiệp để giới thiệu công ty và dịch vụ',
      url: '#',
    },
    2: {
      title: 'Website Thương Mại Điện Tử',
      description: 'Nền tảng bán hàng trực tuyến với tính năng đầy đủ',
      url: '#',
    },
    3: {
      title: 'Hệ Thống Quản Lý',
      description: 'Dashboard quản lý hiệu quả và trực quan',
      url: '#',
    },
  } as const;

  const info = templateInfo[templateId as 1 | 2 | 3];

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
    >
      {/* Mobile Preview */}
      <MobilePreview 
        title={info.title}
        description={info.description}
        url={info.url}
      >
        {renderTemplate()}
      </MobilePreview>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h3 className="text-2xl font-bold mb-6 text-foreground">Tính năng nổi bật</h3>
        <div className="space-y-4">
          {templateId === 1 && (
            <>
              <FeatureItem
                icon="🎨"
                title="Thiết kế hiện đại"
                description="Giao diện đẹp, dễ sử dụng và responsive"
              />
              <FeatureItem
                icon="📱"
                title="Tối ưu mobile"
                description="Hoạt động mượt mà trên tất cả thiết bị"
              />
              <FeatureItem
                icon="⚡"
                title="Tốc độ cao"
                description="Tải nhanh và hiệu suất tối ưu"
              />
              <FeatureItem
                icon="🔍"
                title="SEO thân thiện"
                description="Tối ưu cho công cụ tìm kiếm"
              />
            </>
          )}
          {templateId === 2 && (
            <>
              <FeatureItem
                icon="🛍️"
                title="Quản lý sản phẩm"
                description="Dễ dàng thêm, sửa, xóa sản phẩm"
              />
              <FeatureItem
                icon="💳"
                title="Thanh toán an toàn"
                description="Hỗ trợ nhiều phương thức thanh toán"
              />
              <FeatureItem
                icon="📦"
                title="Quản lý đơn hàng"
                description="Theo dõi đơn hàng real-time"
              />
              <FeatureItem
                icon="📊"
                title="Báo cáo thống kê"
                description="Phân tích doanh số chi tiết"
              />
            </>
          )}
          {templateId === 3 && (
            <>
              <FeatureItem
                icon="📈"
                title="Thống kê trực tuyến"
                description="Dữ liệu cập nhật real-time"
              />
              <FeatureItem
                icon="👥"
                title="Quản lý người dùng"
                description="Kiểm soát quyền hạn linh hoạt"
              />
              <FeatureItem
                icon="🔐"
                title="Bảo mật cao"
                description="Mã hóa dữ liệu và kiểm soát truy cập"
              />
              <FeatureItem
                icon="⚙️"
                title="Tùy chỉnh toàn phần"
                description="Thích ứng với nhu cầu của bạn"
              />
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const FeatureItem: React.FC<{
  icon: string;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, x: 10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className="flex gap-4 p-4 rounded-lg bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-primary/50 transition-colors"
  >
    <div className="text-2xl shrink-0">{icon}</div>
    <div>
      <h4 className="font-semibold text-foreground">{title}</h4>
      <p className="text-sm text-muted mt-1">{description}</p>
    </div>
  </motion.div>
);

export default TemplateShowcase;
