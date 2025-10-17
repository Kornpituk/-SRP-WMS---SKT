<!-- eslint-disable semi -->
<script setup>
import avatar3 from "@images/avatars/avatar-3.png";
import avatar4 from "@images/avatars/avatar-4.png";
import avatar5 from "@images/avatars/avatar-5.png";
import paypal from "@images/svg/paypal.svg";
import { useNotificationService } from "@/services/skt/notification/notification.services";
import { watch, watchEffect } from "vue";

const router = useRouter();

const {
  responseNotiSetRead,
  errorMessageNotiSetRead,
  responseNotiGet,
  errorMessageNotiGet,
  NotificationSetReadFunc,
  NotificationGetFunc,
} = useNotificationService();

const colorStatusWithId2 = id => {
  switch (id) {
  case 0:
    return { color: "grey-darken-1", message: "grey-darken-1" };
  case 1:
    return { color: "red", message: "red" };
  case 2:
    return { color: "pink", message: "pink-darken-4" };
  case 3:
    return { color: "purple", message: "purple" };
  case 4:
    return { color: "deep-purple", message: "deep-purple" };
  case 5:
    return { color: "indigo", message: "indigo" };
  case 6:
    return { color: "blue", message: "blue" };
  case 7:
    return { color: "light-blue", message: "light-blue" };
  case 8:
    return { color: "cyan", message: "cyan-darken-4" };
  case 9:
    return { color: "teal", message: "teal" };
  case 10:
    return { color: "light-green", message: "cycan" };
  case 11:
    return { color: "lime-darken-4", message: "cycan" };
  case 12:
    return { color: "yellow-darken-4", message: "brown" };
  case 13:
    return { color: "orange", message: "orange" };
  case 14:
    return { color: "deep-orange", message: "deep-orange-derken-4" };
  case 15:
    return { color: "brown", message: "brown" };
  case 16:
    return { color: "red-darken-2", message: "red-darken-2" };
  case 17:
    return { color: "green-darken-2", message: "green-darken-2" };
  case 18:
    return { color: "orange-darken-4", message: "green-darken-2" };
  default:
    return { color: "grey", message: "grey" };
  }
};

const notifications = ref([]); // ว่างตอนแรก

const fetchNotification = async () => {
  try {
    await NotificationGetFunc(sessionStorage.getItem("accessTokenAtStore"));

    // ตรวจสอบว่า responseNotiGet มีค่าและมี datas

    const apiData = ref(responseNotiGet.value.data.datas || []);

    // map ข้อมูลจาก API เป็นรูปแบบ notifications ที่ต้องการ
    notifications.value = apiData.value.map(item => ({
      id: item.notiId,
      title: item.statusText || "No title",
      subtitle: item.messageResult || "", // หรือใช้ฟิลด์อื่นจาก API
      dateTime: new Date(item.createdDate).toLocaleString("en-US", {
        dateStyle: "full",
        timeStyle: "short",
      }),
      time: new Date(item.createdDate).toLocaleString("en-US", {
        timeStyle: "short",
      }),
      status: item.statusText,
      statusId: item.statusID,
      isSeen: item.isRead,
      link: "/skt/receiving", // หรือ dynamic link ถ้ามี
      color: colorStatusWithId2(item.statusID).color, // หรือ map จาก statusID เป็นสี
      po: item.purchaseOrderNo,
      lot: item.lot,
      img: "", // ถ้าไม่มีรูปใน API
    }));

  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
};

const setReadNotification = async (id, token) => {
  try {
    await NotificationSetReadFunc(id, token);

    // ตรวจสอบว่า responseNotiGet มีค่าและมี datas

    // setTimeout(() => {
    //   location.reload();
    // }, 1000); // 10000 มิลลิวินาที = 10 วินาที
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
};

onMounted(() => {
  fetchNotification();

  const interval = setInterval(() => {
    fetchNotification();
  }, 3000);

  onUnmounted(() => clearInterval(interval));
});

const removeNotification = notificationIds => {
  if (!Array.isArray(notificationIds)) notificationIds = [notificationIds];

  notifications.value = notifications.value.filter(
    item => !notificationIds.includes(item.id),
  );
};

const markRead = async notificationIds => {
  const token = sessionStorage.getItem("accessTokenAtStore")

  for (const id of notificationIds) {
    const target = notifications.value.find(item => item.id === id)
    if (target) {
      target.isSeen = true
      await setReadNotification(target.id, token)  // ✅ รอให้ API เสร็จ
    }
  }

  return true // ส่งค่ากลับให้ child รู้ว่าเสร็จแล้ว
}

const markUnRead = notificationId => {
  notifications.value.forEach(item => {
    notificationId.forEach(id => {
      if (id === item.id) item.isSeen = false;
    });
  });
};

const handleNotificationClick = notifications => {
  // แปลงเป็น array เสมอ
  const notis = Array.isArray(notifications) ? notifications : [notifications];

  // mark read
  markRead(notis.map(n => n.id));

  sessionStorage.setItem("deliveryDateFrom", "");
  sessionStorage.setItem("deliveryDateTo", "");
  sessionStorage.setItem("productId", "");
  sessionStorage.setItem("productName", "");
  sessionStorage.setItem("supplierId", "");
  sessionStorage.setItem("supplierName", "");
  sessionStorage.setItem("purchaseOrderNo", "");
  sessionStorage.setItem("fileterStatusInPAI", "");

  // เก็บ status ลง sessionStorage
  // sessionStorage.setItem("fileterStatusInPAI", notis[0]?.status);
  sessionStorage.setItem("purchaseOrderNo", notis[0]?.po);
  sessionStorage.setItem("supplierName", notis[0]?.lot);

  const firstLink = notis[0]?.link;
  if (!firstLink) return;

  // ถ้าอยู่หน้าเดิม ใช้ replace + query เพื่อ force reload
  if (router.currentRoute.value.fullPath === firstLink) {
    window.location.reload();
  } else {
    router.push(firstLink);
  }
};

const swipedId = ref(null);
const swipeDirection = ref("left" | "right" | null);

const handleSwipe = (notificationId, direction) => {
  swipedId.value = notificationId;
  swipeDirection.value = direction;
};

let touchStartX = 0;
let touchEndX = 0;

const onTouchStart = e => {
  touchStartX = e.changedTouches[0].screenX;
};

const onTouchEnd = (notificationId, e) => {
  touchEndX = e.changedTouches[0].screenX;

  const deltaX = touchEndX - touchStartX;

  if (Math.abs(deltaX) > 50) {
    const direction = deltaX > 0 ? "right" : "left";

    handleSwipe(notificationId, direction);
  } else {
    swipedId.value = null;
    swipeDirection.value = null;
  }
};
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
