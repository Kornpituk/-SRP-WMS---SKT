import { hexToRgb } from "@layouts/utils"

// 👉 Colors variables
const colorVariables = themeColors => {
  const themeSecondaryTextColor = `rgba(${hexToRgb(
    themeColors.colors["on-surface"],
  )},${themeColors.variables["medium-emphasis-opacity"]})`

  const themeDisabledTextColor = `rgba(${hexToRgb(
    themeColors.colors["on-surface"],
  )},${themeColors.variables["disabled-opacity"]})`

  const themeBorderColor = `rgba(${hexToRgb(
    String(themeColors.variables["border-color"]),
  )},${themeColors.variables["border-opacity"]})`

  const themePrimaryTextColor = `rgba(${hexToRgb(
    themeColors.colors["on-surface"],
  )},${themeColors.variables["high-emphasis-opacity"]})`

  return {
    themeSecondaryTextColor,
    themeDisabledTextColor,
    themeBorderColor,
    themePrimaryTextColor,
  }
}

export const getDonutChartConfigPO = themeColors => {
  const donutColors = {
    series2: '#7CB342',
    series3: '#826bf8',
    series4: '#32baff',
  }

  const { themeSecondaryTextColor, themePrimaryTextColor } = colorVariables(themeColors)
  
  return {
    chart: {
      stacked: true,
      parentHeightOffset: 0,
      toolbar: { show: true },
    },
    stroke: { width: 0 },
    labels: ['WAITING FOT RECEIVE', 'RECEIVED'],
    colors: [donutColors.series2, donutColors.series4],
    dataLabels: {
      enabled: true,
      formatter: val => `${parseInt(val, 10)}%`,
    },
    legend: {
      position: 'bottom',
      markers: { offsetX: -3 },
      labels: { colors: themeSecondaryTextColor },
      itemMargin: {
        vertical: 3,
        horizontal: 10,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              fontSize: '0.8rem',
            },
            value: {
              fontSize: '0.8rem',
              color: themeSecondaryTextColor,
              formatter: val => `${parseInt(val, 10)}`,
            },
            total: {
              show: true,
              fontSize: '0.8rem',
              label: 'Total',
              formatter(w) {
                const totalValue = w.globals.seriesTotals.reduce((a, b) => {
                  return a + b
                }, 0) / w.globals.series.length
  
                if (totalValue % 1 === 0)
                  return `${totalValue}%`
                else
                  return `${totalValue.toFixed(2)}%`
              },
              color: themePrimaryTextColor,
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 320,
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: '0.8rem',
                  },
                  value: {
                    fontSize: '0.8rem',
                  },
                  total: {
                    fontSize: '0.8rem',
                  },
                },
              },
            },
          },
        },
      },
    ],
  }
}
