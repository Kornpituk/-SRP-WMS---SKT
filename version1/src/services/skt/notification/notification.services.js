import { notificationSetReadRepository,
} from '@/repository/skt/notification/notific.repo'

export const useNotificationService = () => {
  const responseNotiSetRead = ref(null)
  const errorMessageNotiSetRead = ref(null)
  const responseNotiGet = ref(null)
  const errorMessageNotiGet = ref(null)
  
  const NotificationSetReadFunc = async (NotiId, accessTokenAtStore) => {
    try {
      errorMessageNotiSetRead.value = null

      //console.log('New Produtcion Plan Func...')
  
      const result = await notificationSetReadRepository.setReadNotification(NotiId, accessTokenAtStore)
        
      if (result) {
        //console.log('New Produtcion Plan Func result:', result)
        responseNotiSetRead.value = result
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.error('Error in newProdutcionPlanFunc:', error)
      errorMessageNotiSetRead.value = error.message
    }
  }

  const NotificationGetFunc = async accessTokenAtStore => {
    try {
      errorMessageNotiGet.value = null

      //console.log('New Produtcion Plan Func...')
  
      const result = (await notificationSetReadRepository.getNotification(accessTokenAtStore))
        
      if (result) {
        //console.log('New Produtcion Plan Func result:', result)
        responseNotiGet.value = result
    
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.error('Error in newProdutcionPlanFunc:', error)
      errorMessageNotiGet.value = error.message
    }
  }
  
  return {
    responseNotiSetRead,
    errorMessageNotiSetRead,
    responseNotiGet,
    errorMessageNotiGet,
    NotificationSetReadFunc,
    NotificationGetFunc,
  }
}
