// mock/chartService.ts
import { Request, Response } from 'express';

/**
 * 定义各国家的模拟折线图数据：
 * - year: 年份
 * - value: 数值（小数，带有一定变化）
 * - type: 'Installation Cost' 或 'Solar Potential'
 */
const mockData = {
  'Kenya': [
    { year: '2021', value: 187.07, type: 'Installation Cost' },
    { year: '2022', value: 178.16, type: 'Installation Cost' },
    { year: '2023', value: 169.67, type: 'Installation Cost' },
    { year: '2024', value: 161.59, type: 'Installation Cost' },
    { year: '2025', value: 153.90, type: 'Installation Cost' },
    { year: '2021', value: 25.90, type: 'Solar Potential' },
    { year: '2022', value: 26.43, type: 'Solar Potential' },
    { year: '2023', value: 26.97, type: 'Solar Potential' },
    { year: '2024', value: 27.52, type: 'Solar Potential' },
    { year: '2025', value: 28.08, type: 'Solar Potential' },
  ],
  'Turkey': [
    { year: '2021', value: 97.24, type: 'Installation Cost' },
    { year: '2022', value: 92.61, type: 'Installation Cost' },
    { year: '2023', value: 88.2, type: 'Installation Cost' },
    { year: '2024', value: 84, type: 'Installation Cost' },
    { year: '2025', value: 80, type: 'Installation Cost' },
    { year: '2021', value: 9.22, type: 'Solar Potential' },
    { year: '2022', value: 9.41, type: 'Solar Potential' },
    { year: '2023', value: 9.60, type: 'Solar Potential' },
    { year: '2024', value: 9.80, type: 'Solar Potential' },
    { year: '2025', value: 10, type: 'Solar Potential' },
  ],
  'Southern India': [
    { year: '2021', value: 121.25, type: 'Installation Cost' },
    { year: '2022', value: 115.47, type: 'Installation Cost' },
    { year: '2023', value: 109.97, type: 'Installation Cost' },
    { year: '2024', value: 104.74, type: 'Installation Cost' },
    { year: '2025', value: 99.75, type: 'Installation Cost' },
    { year: '2021', value: 13.14, type: 'Solar Potential' },
    { year: '2022', value: 13.41, type: 'Solar Potential' },
    { year: '2023', value: 13.69, type: 'Solar Potential' },
    { year: '2024', value: 13.96, type: 'Solar Potential' },
    { year: '2025', value: 14.25, type: 'Solar Potential' },
  ],
  'South Africa': [
    { year: '2021', value: 156.80, type: 'Installation Cost' },
    { year: '2022', value: 149.33, type: 'Installation Cost' },
    { year: '2023', value: 142.22, type: 'Installation Cost' },
    { year: '2024', value: 135.45, type: 'Installation Cost' },
    { year: '2025', value: 129, type: 'Installation Cost' },
    { year: '2021', value: 27.76, type: 'Solar Potential' },
    { year: '2022', value: 28.33, type: 'Solar Potential' },
    { year: '2023', value: 28.91, type: 'Solar Potential' },
    { year: '2024', value: 29.50, type: 'Solar Potential' },
    { year: '2025', value: 30.10, type: 'Solar Potential' },
  ],
  'Singapore': [
    { year: '2021', value: 423.00, type: 'Installation Cost' },
    { year: '2022', value: 402.85, type: 'Installation Cost' },
    { year: '2023', value: 283.67, type: 'Installation Cost' },
    { year: '2024', value: 365.40, type: 'Installation Cost' },
    { year: '2025', value: 348.00, type: 'Installation Cost' },
    { year: '2021', value: 48.15, type: 'Solar Potential' },
    { year: '2022', value: 49.13, type: 'Solar Potential' },
    { year: '2023', value: 50.13, type: 'Solar Potential' },
    { year: '2024', value: 51.16, type: 'Solar Potential' },
    { year: '2025', value: 52.20, type: 'Solar Potential' },
  ],
  'Latvia': [
    { year: '2021', value: 418.13, type: 'Installation Cost' },
    { year: '2022', value: 398.22, type: 'Installation Cost' },
    { year: '2023', value: 379.26, type: 'Installation Cost' },
    { year: '2024', value: 361.20, type: 'Installation Cost' },
    { year: '2025', value: 344, type: 'Installation Cost' },
    { year: '2021', value: 55.53, type: 'Solar Potential' },
    { year: '2022', value: 56.66, type: 'Solar Potential' },
    { year: '2023', value: 57.82, type: 'Solar Potential' },
    { year: '2024', value: 59, type: 'Solar Potential' },
    { year: '2025', value: 60.20, type: 'Solar Potential' },
  ],
  'Malaysia': [
    { year: '2021', value: 247.96, type: 'Installation Cost' },
    { year: '2022', value: 236.16, type: 'Installation Cost' },
    { year: '2023', value: 224.91, type: 'Installation Cost' },
    { year: '2024', value: 214.20, type: 'Installation Cost' },
    { year: '2025', value: 204, type: 'Installation Cost' },
    { year: '2021', value: 47.04, type: 'Solar Potential' },
    { year: '2022', value: 48, type: 'Solar Potential' },
    { year: '2023', value: 48.98, type: 'Solar Potential' },
    { year: '2024', value: 49.98, type: 'Solar Potential' },
    { year: '2025', value: 51, type: 'Solar Potential' },
  ],
};

export default {
  // Mock 接口：返回指定国家的太阳能折线图数据
  'GET /api/solar-data': (req: Request, res: Response) => {
    const { country } = req.query;
    const data = mockData[country as keyof typeof mockData] || [];

    return res.json({
      success: true,
      data,
    });
  },
};
