import { position } from "@/views/demos/components/badge/demoCodeBadge"
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

const getSwitchThemeColor1 = ref('')
const getSwitchThemeColor2 = ref('')
const getSwitchThemeColor3 = ref('')

const getSwitchThemeColor4 = ref('')
const getSwitchThemeColor5 = ref('')

watchEffect(() => {
  localStorage.getItem('srp-theme-config')
  if(localStorage.getItem('srp-theme-config') === 'primary') {
    getSwitchThemeColor1.value = '#7CB342'
    getSwitchThemeColor2.value = '#F4511E'
    getSwitchThemeColor3.value = '#32baff'
    getSwitchThemeColor4.value = '#7CB342'
    getSwitchThemeColor5.value = '#F4511E'
  }else if(localStorage.getItem('srp-theme-config') === 'warehouse-harmony'){
    getSwitchThemeColor1.value = '#81C784'//green-lighten-2
    getSwitchThemeColor2.value = '#E57373'//red-lighten-2
    getSwitchThemeColor3.value = '#4DD0E1'//cyan-lighten-2
    getSwitchThemeColor4.value = '#81C784'//green-lighten-2
    getSwitchThemeColor5.value = '#E57373'//red-lighten-2
    getSwitchThemeColor5.value = '#E57373'//red-lighten-2
  } else if(localStorage.getItem('srp-theme-config') === 'inventory-insight'){
    getSwitchThemeColor1.value = '#81C784'//green-lighten-2
    getSwitchThemeColor2.value = '#E57373'//red-lighten-2
    getSwitchThemeColor3.value = '#4DD0E1'//cyan-lighten-2
    getSwitchThemeColor4.value = '#81C784'//green-lighten-2
    getSwitchThemeColor5.value = '#E57373'//red-lighten-2
  } else if(localStorage.getItem('srp-theme-config') === 'logistics-luxe'){
    getSwitchThemeColor1.value = '#66BB6A'//green-lighten-1
    getSwitchThemeColor2.value = '#EF5350'//red-lighten-1
    getSwitchThemeColor3.value = '#26C6DA'//cyan-lighten-1
    getSwitchThemeColor4.value = '#66BB6A'//green-lighten-1
    getSwitchThemeColor5.value = '#EF5350'//red-lighten-1
  } else if(localStorage.getItem('srp-theme-config') === 'operation-optimizer'){
    getSwitchThemeColor1.value = '#A5D6A7'//green-lighten-3
    getSwitchThemeColor2.value = '#EF9A9A'//green-lighten-3
    getSwitchThemeColor3.value = '#80DEEA'//cyan-lighten-3
    getSwitchThemeColor4.value = '#A5D6A7'//green-lighten-3
    getSwitchThemeColor5.value = '#EF9A9A'//green-lighten-3
  } else {
    getSwitchThemeColor1.value = '#43A047'//green-darken-1
    getSwitchThemeColor2.value = '#E53935'//red-darken-1
    getSwitchThemeColor3.value = '#1E88E5'//blue-darken-1
    getSwitchThemeColor4.value = '#43A047'//green-darken-1
    getSwitchThemeColor5.value = '#E53935'//red-darken-1
  }
})

export const getDonutChartConfigPOSuccess = themeColors => {
  const donutColors = {
    series2: getSwitchThemeColor1.value,
    series3: getSwitchThemeColor2.value,
    series4: getSwitchThemeColor3.value,
  }

  const { themeSecondaryTextColor, themePrimaryTextColor } = colorVariables(themeColors)
  
  return {
    chart: {
      stacked: true,
      parentHeightOffset: 0,
      toolbar: { 
        show: true, 
        offsetX: 0,
        offsetY: 5,
        export: {
          csv: {
            filename: function() {
              const now = new Date()
              const dateStr = now.toISOString().slice(0, 10)
              const timeStr = now.toTimeString().slice(0, 5).replace(':', '')
              
              return `Inventory_Arrived_${dateStr}_${timeStr}`
            }(),
  
            columnDelimiter: ',',
            headerCategory: 'Category',
            headerValue: 'Value',
          },
          svg: {
            filename: (() => {
              const date = new Date().toLocaleDateString('th-TH').replace(/\//g, '-')

              const time = new Date().toLocaleTimeString('th-TH', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit', 
              }).replace(':', '')

              return `Inventory_Arrived_${date}_${time}`
            })(),
          },
          png: {
            filename: (() => {
              const date = new Date().toLocaleDateString('th-TH').replace(/\//g, '-')

              const time = new Date().toLocaleTimeString('th-TH', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit', 
              }).replace(':', '')

              return `Inventory_Arrived_${date}_${time}`
            })(),
          },
          beforeExport: (chart, options) => {
            const currentUser = 'John Doe'
            const exportTime = new Date().toLocaleString('th-TH')

            return {
              ...options,
              title: {
                ...(options.title || {}),
                text: `Inventory Arrived | ส่งออกโดย: ${currentUser}`,
              },
              subtitle: {
                ...(options.subtitle || {}),
                text: `ข้อมูล ณ วันที่: ${exportTime}`,
              },
            }
          },
        },
      },
    },
    title: {
      text: 'Inventory Arrived',
      align: 'center',
      style: {
        fontSize: '16px',
        color: themePrimaryTextColor,
      },
    },
    subtitle: {
      text: '',
      align: 'center',
      style: {
        fontSize: '14px',
        color: themeSecondaryTextColor,
      },
    },
    stroke: { width: 0 },
    labels: ['RECEIVED PO', 'TRANSFER IN', 'RECEIVED OTHER'],
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

export const getDonutChartConfigPOWaiting = themeColors => {
  const donutColors = {
    series2: getSwitchThemeColor4.value,
    series3: getSwitchThemeColor5.value,
  }

  const { themeSecondaryTextColor, themePrimaryTextColor } = colorVariables(themeColors)
  
  return {
    chart: {
      stacked: true,
      parentHeightOffset: 0,
      toolbar: { 
        show: true, 
        offsetX: 0,
        offsetY: 5,
        export: {
          csv: {
            filename: function() {
              const now = new Date()
              const dateStr = now.toISOString().slice(0, 10)
              const timeStr = now.toTimeString().slice(0, 5).replace(':', '')
              
              return `Await_Receiving_${dateStr}_${timeStr}`
            }(),
  
            columnDelimiter: ',',
            headerCategory: 'Category',
            headerValue: 'Value',
          },
          svg: {
            filename: (() => {
              const date = new Date().toLocaleDateString('th-TH').replace(/\//g, '-')

              const time = new Date().toLocaleTimeString('th-TH', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit', 
              }).replace(':', '')

              return `Await_Receiving_${date}_${time}`
            })(),
          },
          png: {
            filename: (() => {
              const date = new Date().toLocaleDateString('th-TH').replace(/\//g, '-')

              const time = new Date().toLocaleTimeString('th-TH', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit', 
              }).replace(':', '')

              return `Await_Receiving_${date}_${time}`
            })(),
          },
        },
      },
      zoom: {
        enabled: false,
      },
    },
    title: {
      text: 'Await Receiving',
      align: 'center',
      style: {
        fontSize: '16px',
        color: themePrimaryTextColor,
      },
    },
    subtitle: {
      text: '',
      align: 'center',
      style: {
        fontSize: '14px',
        color: themeSecondaryTextColor,
      },
    },
    stroke: { width: 0 },
    labels: ['PO', 'TRANSFER IN'],
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

              // formatter(w) {
              //   const totalValue = w.globals.seriesTotals.reduce((a, b) => {
              //     return a + b
              //   }, 0) / w.globals.series.length
  
              //   if (totalValue % 1 === 0)
              //     return `${totalValue}%`
              //   else
              //     return `${totalValue.toFixed(2)}%`
              // },
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

export const getDonutChartConfigPOSuccessNoData = themeColors => {
  const donutColors = {
    series2: '#E0E0E0',
  }

  const { themeSecondaryTextColor, themePrimaryTextColor } = colorVariables(themeColors)
  
  return {
    chart: {
      stacked: true,
      parentHeightOffset: 0,
      toolbar: { 
        show: false, 
        offsetX: 0,
        offsetY: 5 },
    },
    title: {
      text: 'Inventory Arrived',
      align: 'center',
      style: {
        fontSize: '16px',
        color: themePrimaryTextColor,
      },
    },
    subtitle: {
      text: '',
      align: 'center',
      style: {
        fontSize: '14px',
        color: themeSecondaryTextColor,
      },
    },
    stroke: { width: 0 },
    colors: [donutColors.series2],
    dataLabels: {
      enabled: false,
      formatter: val => `${parseInt(val, 10)}% `,
    },
    legend: {
      enabled: false,
      show: false,
    },
    tooltip: {
      show: false,
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: false,
              fontSize: '0.8rem',
              label: 'Name',
            },
            total: {
              show: true,
              fontSize: '1rem',
              label: 'No Data',  // กำหนดข้อความที่ต้องการแสดง
              formatter: function(w) { // ใช้ formatter เพื่อควบคุมผลลัพธ์
                return "No Data" // คืนค่าเป็นสตริง "No Data" เท่านั้น
              },
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
            show: false,
            enabled: false,
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

export const getDonutChartConfigPOWaitingNoData = themeColors => {
  const donutColors = {
    series2: '#E0E0E0',
  }

  const { themeSecondaryTextColor, themePrimaryTextColor } = colorVariables(themeColors)
  
  return {
    chart: {
      stacked: true,
      parentHeightOffset: 0,
      toolbar: { 
        show: false, 
        offsetX: 0,
        offsetY: 5 },
    },
    title: {
      text: 'Await Receiving',
      align: 'center',
      style: {
        fontSize: '16px',
        color: themePrimaryTextColor,
      },
    },
    subtitle: {
      text: '',
      align: 'center',
      style: {
        fontSize: '14px',
        color: themeSecondaryTextColor,
      },
    },
    stroke: { width: 0 },
    colors: [donutColors.series2],
    dataLabels: {
      enabled: false,
      formatter: val => `${parseInt(val, 10)}%`,
    },
    legend: {
      enabled: false,
      show: false,
    },
    tooltip: {
      show: false,
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: false,
              fontSize: '0.8rem',
              label: 'Name',
            },
            total: {
              show: true,
              fontSize: '1rem',
              label: 'No Data',  // กำหนดข้อความที่ต้องการแสดง
              formatter: function(w) { // ใช้ formatter เพื่อควบคุมผลลัพธ์
                return "No Data" // คืนค่าเป็นสตริง "No Data" เท่านั้น
              },
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
            show: false,
            enabled: false,
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

