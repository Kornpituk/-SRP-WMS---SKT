<script setup>
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
import avatar5 from '@images/avatars/avatar-5.png'
import paypal from '@images/svg/paypal.svg'

import { useRouter } from 'vue-router'

const router = useRouter()

const notifications = ref([
  {
    id: 1,
    img: avatar4,
    title: 'Congratulation Flora! 🎉',
    subtitle: 'Won the monthly best seller badge',
    time: 'Today',
    isSeen: true,
    link: '/purchase-orders/A00045', // 👈 เพิ่มลิงก์ที่ใช้ไปยังหน้ารายละเอียด
  },
  {
    id: 2,
    text: 'Tom Holland',
    title: 'New user registered.',
    subtitle: '5 hours ago',
    time: 'Yesterday',
    isSeen: false,
    link: '/purchase-orders/A00045', // 👈 เพิ่มลิงก์ที่ใช้ไปยังหน้ารายละเอียด
  },
  {
    id: 3,
    img: avatar5,
    title: 'New message received 👋🏻',
    subtitle: 'You have 10 unread messages',
    time: '11 Aug',
    isSeen: true,
    link: '/purchase-orders/A00045', // 👈 เพิ่มลิงก์ที่ใช้ไปยังหน้ารายละเอียด
  },
  {
    id: 4,
    img: paypal,
    title: 'Paypal',
    subtitle: 'Received Payment',
    time: '25 May',
    isSeen: false,
    color: 'error',
    link: '/purchase-orders/A00045', // 👈 เพิ่มลิงก์ที่ใช้ไปยังหน้ารายละเอียด
  },
  {
    id: 5,
    img: avatar3,
    title: 'Received Order 📦',
    subtitle: 'New order received from john',
    time: '19 Mar',
    isSeen: true,
    link: '/purchase-orders/A00045', // 👈 เพิ่มลิงก์ที่ใช้ไปยังหน้ารายละเอียด
  },
])

const removeNotification = notificationId => {
  notifications.value.forEach((item, index) => {
    if (notificationId === item.id)
      notifications.value.splice(index, 1)
  })
}

const markRead = notificationId => {
  notifications.value.forEach(item => {
    notificationId.forEach(id => {
      if (id === item.id)
        item.isSeen = true
    })
  })
}

const markUnRead = notificationId => {
  notifications.value.forEach(item => {
    notificationId.forEach(id => {
      if (id === item.id)
        item.isSeen = false
    })
  })
}

const handleNotificationClick = notification => {
  console.log("notification not", notification.link)
  if (!notification.isSeen)
    markRead([notification.id])

  if (notification.link){
    console.log("notification", notification.link)
    router.push(notification.link)
  }else{
    console.log("notification not", notification.link)
  }
}
</script>

<template>
  <Notifications
    :notifications="notifications"
    @remove="removeNotification"
    @read="markRead"
    @unread="markUnRead"
    @click:notification="handleNotificationClick"
  />
</template>
