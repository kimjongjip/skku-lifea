import { render } from "@testing-library/react";
import Chart from "@/components/main/Chart";
import "@testing-library/jest-dom";
import { vi } from 'vitest';

// ReactApexChart 모킹
vi.mock('react-apexcharts', () => ({
  default: function MockChart({ options, series, type, height }) {
    return (
      <div data-testid="mock-chart">
        <span data-testid="chart-options">{JSON.stringify(options)}</span>
        <span data-testid="chart-series">{JSON.stringify(series)}</span>
        <span data-testid="chart-type">{type}</span>
        <span data-testid="chart-height">{height}</span>
      </div>
    );
  }
}));

describe("Chart", () => {
  const mockData = [
    { date: "2024-11-27", notVerified: 2, success: 6, fail: 2, total: 10 },
    { date: "2024-11-26", notVerified: 1, success: 7, fail: 2, total: 10 },
    { date: "2024-11-25", notVerified: 3, success: 5, fail: 2, total: 10 },
    { date: "2024-11-24", notVerified: 0, success: 8, fail: 2, total: 10 },
    { date: "2024-11-23", notVerified: 1, success: 7, fail: 2, total: 10 },
    { date: "2024-11-22", notVerified: 2, success: 6, fail: 2, total: 10 }, // 6번째 데이터는 잘려야 함
  ];

  test("limits data to 5 items", () => {
    const { getByTestId } = render(<Chart data={mockData} />);
    const seriesData = JSON.parse(getByTestId("chart-series").textContent);
    
    expect(seriesData[0].data).toHaveLength(5);
    expect(seriesData[1].data).toHaveLength(5);
    expect(seriesData[2].data).toHaveLength(5);
  });

  test("calculates percentages correctly", () => {
    const { getByTestId } = render(<Chart data={mockData.slice(0, 1)} />);
    const seriesData = JSON.parse(getByTestId("chart-series").textContent);
    
    // 첫 번째 데이터의 비율 검증
    expect(seriesData[0].data[0]).toBe("20.00"); // notVerified: 2/10 * 100
    expect(seriesData[1].data[0]).toBe("60.00"); // success: 6/10 * 100
    expect(seriesData[2].data[0]).toBe("20.00"); // fail: 2/10 * 100
  });

  test("sets correct colors for each series", () => {
    const { getByTestId } = render(<Chart data={mockData} />);
    const seriesData = JSON.parse(getByTestId("chart-series").textContent);
    
    expect(seriesData[0].color).toBe("#BBD6FF"); // 미인증
    expect(seriesData[1].color).toBe("#C8FFC3"); // 성공
    expect(seriesData[2].color).toBe("#FFAFB0"); // 실패
  });

  test("sets correct chart options", () => {
    const { getByTestId } = render(<Chart data={mockData} />);
    const options = JSON.parse(getByTestId("chart-options").textContent);
    
    expect(options.chart.type).toBe("bar");
    expect(options.chart.stacked).toBe(true);
    expect(options.chart.stackType).toBe("100%");
    expect(options.dataLabels.enabled).toBe(true);
  });

  test("handles empty data", () => {
    const { getByTestId } = render(<Chart data={[]} />);
    const seriesData = JSON.parse(getByTestId("chart-series").textContent);
    
    expect(seriesData[0].data).toHaveLength(0);
    expect(seriesData[1].data).toHaveLength(0);
    expect(seriesData[2].data).toHaveLength(0);
  });
});