
//---------------------- Import Api for Url *****
const whereHouse = ref(localStorage.getItem('whereHouseName'))

const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')

export const getHeaders = () => ({
  accept: '*/*',
  'x-location': whereHouse.Authorization,
  Authorization: `Bearer ${accessTokenAtStore}`,
})
  