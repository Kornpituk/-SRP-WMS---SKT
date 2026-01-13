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
    getSwitchThemeColor1.value = '#2196F3'
    getSwitchThemeColor2.value = '#FFC400'
    getSwitchThemeColor3.value = '#E91E63'
    getSwitchThemeColor4.value = '#2196F3'
    getSwitchThemeColor5.value = '#FFC400'
  }else if(localStorage.getItem('srp-theme-config') === 'warehouse-harmony'){
    getSwitchThemeColor1.value = '#F06292'//pink-lighten-4
    getSwitchThemeColor2.value = '#FFB74D'//orange-lighten-4
    getSwitchThemeColor3.value = '#9575CD'//deep-purple-lighten-4
    getSwitchThemeColor4.value = '#F06292'//pink-lighten-4
    getSwitchThemeColor5.value = '#FFB74D'//orange-lighten-4
  } else if(localStorage.getItem('srp-theme-config') === 'inventory-insight'){
    getSwitchThemeColor1.value = '#F06292'//pink-lighten-2
    getSwitchThemeColor2.value = '#FFB74D'//orange-lighten-2
    getSwitchThemeColor3.value = '#9575CD'//deep-purple-lighten-2
    getSwitchThemeColor4.value = '#F06292'//pink-lighten-2
    getSwitchThemeColor5.value = '#FFB74D'//orange-lighten-2
    getSwitchThemeColor5.value = '#FFB74D'//orange-lighten-2
  } else if(localStorage.getItem('srp-theme-config') === 'logistics-luxe'){
    getSwitchThemeColor1.value = '#EC407A'//pink-lighten-1
    getSwitchThemeColor2.value = '#FFA726'//orange-lighten-1
    getSwitchThemeColor3.value = '#7E57C2'//deep-purple-lighten-1
    getSwitchThemeColor4.value = '#EC407A'//pink-lighten-1
    getSwitchThemeColor5.value = '#FFA726'//orange-lighten-1
  } else if(localStorage.getItem('srp-theme-config') === 'operation-optimizer'){
    getSwitchThemeColor1.value = '#F48FB1'//pink-lighten-3
    getSwitchThemeColor2.value = '#FFCC80'//orange-lighten-3
    getSwitchThemeColor3.value = '#B39DDB'//deep-purple-lighten-3
    getSwitchThemeColor4.value = '#F48FB1'//pink-lighten-3
    getSwitchThemeColor5.value = '#FFCC80'//orange-lighten-3
  } else {
    getSwitchThemeColor1.value = '#D81B60'//pink-darken-1
    getSwitchThemeColor2.value = '#FB8C00'//orange-darken-1
    getSwitchThemeColor3.value = '#3949AB'//indigo-darken-1
    getSwitchThemeColor4.value = '#D81B60'//pink-darken-1
    getSwitchThemeColor5.value = '#FB8C00'//orange-darken-1
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
        show: false, 
        offsetX: 0,
        offsetY: 5, 
        export: {
          csv: {
            filename: function() {
              const now = new Date()
              const dateStr = now.toISOString().slice(0, 10)
              const timeStr = now.toTimeString().slice(0, 5).replace(':', '')
              
              return `Picking_Request_${dateStr}_${timeStr}`
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

              return `Picking_Request_${date}_${time}`
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

              return `Picking_Request_${date}_${time}`
            })(),
          },
        },
      },
    },
    title: {
      text: 'Picking Request',
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
    labels: ['PICKING TRANSFER OUT', 'PICKING DELIVERY', 'WRITE OFF'],
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
        show: false, 
        offsetX: 0,
        offsetY: 5, 
        export: {
          csv: {
            filename: function() {
              const now = new Date()
              const dateStr = now.toISOString().slice(0, 10)
              const timeStr = now.toTimeString().slice(0, 5).replace(':', '')
              
              return `Await_Picking_${dateStr}_${timeStr}`
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

              return `Await_Picking_${date}_${time}`
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

              return `Await_Picking_${date}_${time}`
            })(),
          },
        },
      },
    },
    title: {
      text: 'Await Picking',
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
    labels: ['TRANSFER OUT', 'PICKING DELIVERY'],
    colors: [donutColors.series2, donutColors.series3],
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


export const getDonutChartConfigPOSuccessNoData = themeColors => {
  const donutColors = {
    series2: '#E0E0E0',
    series3: '#FFC400',
    series4: '#E91E63',
  }

  const { themeSecondaryTextColor, themePrimaryTextColor } = colorVariables(themeColors)
  
  return {
    chart: {
      stacked: true,
      parentHeightOffset: 0,
      toolbar: { 
        show: false, 
        offsetX: 0,
        offsetY: 5,
        export: {
          csv: {
            filename: function() {
              const now = new Date()
              const dateStr = now.toISOString().slice(0, 10)
              const timeStr = now.toTimeString().slice(0, 5).replace(':', '')
              
              return `Picking_Request_${dateStr}_${timeStr}`
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

              return `Picking_Request_${date}_${time}`
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

              return `Picking_Request_${date}_${time}`
            })(),
          },
        },
      },
    },
    title: {
      text: 'Picking Request',
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

export const getDonutChartConfigPOWaitingNoData = themeColors => {
  const donutColors = {
    series2: '#E0E0E0',
    series3: '#FFC400',
  }

  const { themeSecondaryTextColor, themePrimaryTextColor } = colorVariables(themeColors)
  
  return {
    chart: {
      stacked: true,
      parentHeightOffset: 0,
      toolbar: { 
        show: false, 
        offsetX: 0,
        offsetY: 5, 
        export: {
          csv: {
            filename: function() {
              const now = new Date()
              const dateStr = now.toISOString().slice(0, 10)
              const timeStr = now.toTimeString().slice(0, 5).replace(':', '')
              
              return `Await_Picking_${dateStr}_${timeStr}`
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

              return `Await_Picking_${date}_${time}`
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

              return `Await_Picking_${date}_${time}`
            })(),
          },
        },
      },
    },
    title: {
      text: 'Await Picking',
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




