// src/services/chartService.ts

import { request } from 'umi';

/* ------------------------------------------------------------------
  1. 柱状图/饼状图相关接口与类型
 ------------------------------------------------------------------ */

/**
 * 柱状图或饼状图的单个数据项
 * 例如：{ type: '光伏电站', value: 120 }
 */
export interface ChartItem {
  type: string;
  value: number;
}

/**
 * 后端返回的整体响应体（柱状图 + 饼状图）
 * 可根据后端返回字段进行调整
 */
export interface ChartDataResponse {
  paused?: boolean; // 数据是否处于暂停状态（示例字段）
  barData: ChartItem[];       // 柱状图数据
  pieData: ChartItem[];       // 饼状图数据
  equivalentTrees?: number;   // 等效植树数量（示例字段）
  pollutionDiff?: number;     // 污浊排量差值（示例字段）
}

/**
 * 获取柱状图/饼状图数据
 * @param country 要查询的国家
 * @param timeRange 时间跨度
 * @returns Promise<ChartDataResponse>
 */
export async function fetchChartData(
  country: string,
): Promise<ChartDataResponse> {
  return request<ChartDataResponse>('/api/chart-data', {
    method: 'GET',
    params: { country },
  });
}

/* ------------------------------------------------------------------
  2. 太阳能折线图相关接口与类型
 ------------------------------------------------------------------ */

/**
 * 太阳能折线图单个数据项
 * 例如：{ year: '2020', value: 2.0, type: 'Installation Cost' }
 */
export interface SolarLineDataItem {
  year: string;
  value: number;
  type: string; // 或者 'Installation Cost' | 'Solar Potential'
}

/**
 * 后端返回的折线图响应体（示例：success + data）
 */
export interface SolarLineDataResponse {
  success: boolean;
  data: SolarLineDataItem[];
  message?: string;
}

/**
 * 获取指定国家的太阳能数据 (折线图)
 * @param country 国家名称 (如 'USA', 'China')
 * @returns Promise<{ lineData: SolarLineDataItem[] }>
 */
export async function fetchSolarData(country: string): Promise<{ lineData: SolarLineDataItem[] }> {
  try {
    // 假设真实接口地址是 /api/solar-data
    const res = await request<SolarLineDataResponse>('/api/solar-data', {
      method: 'GET',
      params: { country },
    });

    // 根据后端返回结构处理数据
    if (res && res.success) {
      return { lineData: res.data };
    }
    // 如果后端返回 success=false 或无 success 字段
    throw new Error(res?.message || '获取太阳能数据失败');
  } catch (error) {
    console.error('fetchSolarData error:', error);
    throw new Error('获取太阳能数据失败，请检查网络或联系管理员');
  }
}
