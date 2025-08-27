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
    status: 'Waiting for Inspection',
    statusId: 4,
    isSeen: true,
    link: '/skt/receiving', // 👈 เพิ่มลิงก์ที่ใช้ไปยังหน้ารายละเอียด
    color: 'deep-purple',
  },
  {
    id: 2,
    text: 'Tom Holland',
    title: 'New user registered.',
    subtitle: '5 hours ago',
    time: 'Yesterday',
    isSeen: false,
    status: 'Waiting for Inspection',
    statusId: 4,
    link: '/skt/receiving', // 👈 เพิ่มลิงก์ที่ใช้ไปยังหน้ารายละเอียด
    color: 'deep-purple',
  },
  {
    id: 3,
    img: avatar5,
    title: 'New message received 👋🏻',
    subtitle: 'You have 10 unread messages',
    time: '11 Aug',
    isSeen: true,
    status: 'Waiting for Inspection',
    statusId: 4,
    link: '/skt/receiving', // 👈 เพิ่มลิงก์ที่ใช้ไปยังหน้ารายละเอียด
    color: 'deep-purple',
  },
  {
    id: 4,
    img: paypal,
    title: 'Paypal',
    subtitle: 'Received Payment',
    time: '25 May',
    isSeen: false,
    color: 'light-blue',
    status: 'Waiting for INSP APVL',
    statusId: 6,
    link: '/skt/receiving', // 👈 เพิ่มลิงก์ที่ใช้ไปยังหน้ารายละเอียด
  },
  {
    id: 5,
    img: avatar3,
    title: 'Received Order 📦',
    subtitle: 'New order received from john',
    time: '19 Mar',
    color: 'light-blue',
    isSeen: true,
    status: 'Waiting for INSP APVL',
    statusId: 6,
    link: '/skt/receiving', // 👈 เพิ่มลิงก์ที่ใช้ไปยังหน้ารายละเอียด
  },
])

const removeNotification = notificationIds => {
  if (!Array.isArray(notificationIds)) notificationIds = [notificationIds]

  notifications.value = notifications.value.filter(
    item => !notificationIds.includes(item.id),
  )
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

const handleNotificationClick = notifications => {
  // แปลงเป็น array เสมอ
  const notis = Array.isArray(notifications) ? notifications : [notifications]

  // mark read
  markRead(notis.map(n => n.id))

  // เก็บ status ลง sessionStorage
  sessionStorage.setItem("fileterStatusInPAI", notis[0]?.status)

  const firstLink = notis[0]?.link
  if (!firstLink) return

  // ถ้าอยู่หน้าเดิม ใช้ replace + query เพื่อ force reload
  if (router.currentRoute.value.fullPath === firstLink) {
    window.location.reload()
  } else {
    router.push(firstLink)
  }
}


const swipedId = ref(null)
const swipeDirection = ref('left' | 'right' | null)

const handleSwipe = (notificationId, direction) => {
  swipedId.value = notificationId
  swipeDirection.value = direction
}

let touchStartX = 0
let touchEndX = 0

const onTouchStart = e => {
  touchStartX = e.changedTouches[0].screenX
}

const onTouchEnd = (notificationId, e) => {
  touchEndX = e.changedTouches[0].screenX

  const deltaX = touchEndX - touchStartX

  if (Math.abs(deltaX) > 50) {
    const direction = deltaX > 0 ? 'right' : 'left'

    handleSwipe(notificationId, direction)
  } else {
    swipedId.value = null
    swipeDirection.value = null
  }

  console.log("Swip", swipeDirection)
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
