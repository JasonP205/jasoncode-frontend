import { MetadataRoute } from 'next';
import { projects } from '@/data/projects';

export default function sitemap(): MetadataRoute.Sitemap {
  // Thay đổi URL base của bạn tại đây hoặc cấu hình environment variable NEXT_PUBLIC_APP_URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hwagfu.dev';

  // Lấy danh sách các trang tĩnh
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/utils`,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // Lấy các route động từ CSDL local projects.ts
  const dynamicProjectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.id}`,
    // Khuyến nghị: Thay thế bằng ngày cập nhật thực tế từ data của bạn nếu có
    lastModified: (project as any).updatedAt ? new Date((project as any).updatedAt) : undefined,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...dynamicProjectRoutes];
}
