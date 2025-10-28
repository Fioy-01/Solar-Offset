// mock/chartData.ts

interface ChartItem {
  type: string;
  value: number;
}

interface ChartDataResponse {
  barData: ChartItem[];
  pieData: ChartItem[];
  paused?: boolean;             // 是否暂停
  equivalentTrees?: number;     // 等效植树数量
  pollutionDiff?: number;       // 污浊排量差值
}

export default {
  'GET /api/chart-data': (req: any, res: any) => {
    const { country } = req.query;

    let barData: ChartItem[] = [];
    let pieData: ChartItem[] = [];
    let paused = false;
    let equivalentTrees = 0;
    let pollutionDiff = 0;

    // 根据 country 返回不同 Mock
    switch (country) {
      case 'Kenya':
        barData = [
          { type: 'CO₂ Emission', value: 22 },
          { type: 'Solar Reduction', value: 0.02 },
        ];
        pieData = [
          { type: 'Geothermal', value: 47 },
          { type: 'Hydropower', value: 30 },
          { type: 'Wind', value: 12 },
          { type: 'Solar', value: 2 },
          { type: 'Fossil Fuel', value: 9 },
        ];

        equivalentTrees = 952380;
        pollutionDiff = 21.98;
        break;

      case 'Turkey':
        barData = [
          { type: 'CO₂ Emission', value: 438 },
          { type: 'Solar Reduction', value: 12 },
        ];
        pieData = [
          { type: 'Coal', value: 35.2 },
          { type: 'Natural Gas', value: 18.9 },
          { type: 'Hydropower', value: 21.5 },
          { type: 'Wind', value: 10.5 },
          { type: 'Solar', value: 7.5 },
          { type: 'Geothermal', value: 3.2 },
          { type: 'Nuclear', value: 3.2 }, // 估值占比
        ];

        equivalentTrees = 57142857;
        pollutionDiff = 426;
        break;

      case 'Southern India':
        barData = [
          { type: 'CO₂ Emission', value: 900 },
          { type: 'Solar Reduction', value: 30 },
        ];
        pieData = [
          { type: 'Coal', value: 74.4 },
          { type: 'Renewables (Wind & Solar)', value: 12.1 },
          { type: 'Hydropower', value: 8.3 },
          { type: 'Nuclear', value: 1.2 },
          { type: 'Other', value: 4 }, // 生物质等
        ];

        equivalentTrees = 142857142;
        pollutionDiff = 870;
        break;

      case 'South Africa':
        barData = [
          { type: 'CO₂ Emission', value: 393 },
          { type: 'Solar Reduction', value: 7 },
        ];
        pieData = [
          { type: 'Coal', value: 84 },
          { type: 'Renewables', value: 17 },
          { type: 'Nuclear', value: 1 },
        ];

        equivalentTrees = 33333333;
        pollutionDiff = 386;
        break;

      case 'Singapore':
        barData = [
          { type: 'CO₂ Emission', value: 60 },
          { type: 'Solar Reduction', value: 0.9 },
        ];
        pieData = [
          { type: 'Natural Gas', value: 94.3 },
          { type: 'Solar', value: 5 },
          { type: 'Other', value: 0.7 },
        ];

        equivalentTrees = 4285714;
        pollutionDiff = 59.1;
        break;

      case 'Latvia':
        barData = [
          { type: 'CO₂ Emission', value: 13 },
          { type: 'Solar Reduction', value: 0.03 },
        ];
        pieData = [
          { type: 'Hydropower', value: 59 },
          { type: 'Wind & Solar', value: 18 },
          { type: 'Fossil Fuel', value: 23 },
        ];

        equivalentTrees = 1428571;
        pollutionDiff = 12.97;
        break;

      case 'Malaysia':
        barData = [
          { type: 'CO₂ Emission', value: 283 },
          { type: 'Solar Reduction', value: 0.05 },
        ];
        pieData = [
          { type: 'Natural Gas', value: 47 },
          { type: 'Oil', value: 25.2 },
          { type: 'Coal', value: 23.6 },
          { type: 'Hydropower', value: 2.7 },
          { type: 'Solar & Others', value: 0.5 },
        ];

        equivalentTrees = 2380952;
        pollutionDiff = 282.95;
        break;

      default:
        // 如果没有匹配到国家，则返回空数据
        barData = [];
        pieData = [];
    }

    // 这里统一不设置 paused = true
    const responseData: ChartDataResponse = {
      barData,
      pieData,
      paused,
      equivalentTrees,
      pollutionDiff,
    };

    return res.json(responseData);
  },
};
