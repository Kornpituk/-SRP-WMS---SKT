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

const dateStart = ref(localStorage.getItem('startDateFromPerformance'))
const dateEnd = ref(localStorage.getItem('endDateFromPerformance'))


/*----*/
export const getDonutChartConfigPOSuccess = themeColors => {
  const donutColors = {
    series2: '#7CB342',
    series3: '#FF7043',
    series4: '#80CBC4',
  }

  const { themeSecondaryTextColor, themePrimaryTextColor } = colorVariables(themeColors)
  
  return {
    chart: {
      animations: {
        enabled: true, // ปิด animation ชั่วคราวเพื่อทดสอบ
      },
      stacked: true,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
        offsetX: 0,
        offsetY: -50,
        theme: 'dark',
        tools: {
          download: true,
          selection: true,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false | '<img src="/static/icons/reset.png" width="20">',
          customIcons: [],
        },
        export: {
          csv: {
            filename: `Total Receive ${dateStart.value} - ${dateEnd.value}`,
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            },
          },
          svg: {
            filename: `Total Receive ${dateStart.value} - ${dateEnd.value}`,
          },
          png: {
            filename: `Total Receive ${dateStart.value} - ${dateEnd.value}`,
          },
        },
        autoSelected: 'zoom', 
      },
    },
    title: {
      
      align: 'left',
      style: {
        fontSize: '22px',
        fontWeight: 300,
        fontFamily: 'Roboto',
        color: '#616161',
      },
    },
    stroke: { width: 0 },
    labels: ['PO', 'TRANSFER IN', 'OTHER'],
    colors: [donutColors.series2, donutColors.series3, donutColors.series4],
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
                }, 0)
 
                
                return `${totalValue}`
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
        breakpoint: 480,
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
