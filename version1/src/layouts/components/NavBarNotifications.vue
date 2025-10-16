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

const notifications = ref([]); // ว่างตอนแรก

const fetchNotification = async () => {
  try {
    await NotificationGetFunc();

    // ตรวจสอบว่า responseNotiGet มีค่าและมี datas

    console.log("responseNotiGet.value ", responseNotiGet.value.data.datas);

    const apiData = responseNotiGet.value.data.datas || [];

    // map ข้อมูลจาก API เป็นรูปแบบ notifications ที่ต้องการ
    notifications.value = apiData.map((item) => ({
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
      color: "deep-purple", // หรือ map จาก statusID เป็นสี
      po: item.purchaseOrderNo,
      lot: item.lot,
      img: "", // ถ้าไม่มีรูปใน API
    }));

    console.log("notifications updated:", notifications.value);
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
};

const setReadNotification = async (id) => {
  try {
    await NotificationSetReadFunc(id);

    // ตรวจสอบว่า responseNotiGet มีค่าและมี datas

    // setTimeout(() => {
    //   location.reload();
    // }, 1000); // 10000 มิลลิวินาที = 10 วินาที

    console.log("responseNotiGet.value ", responseNotiGet.value.data.datas);
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
};

watchEffect(() => {
  fetchNotification();
});

const removeNotification = (notificationIds) => {
  if (!Array.isArray(notificationIds)) notificationIds = [notificationIds];

  notifications.value = notifications.value.filter(
    (item) => !notificationIds.includes(item.id)
  );
};

const markRead = (notificationId) => {
  notifications.value.forEach((item) => {
    notificationId.forEach((id) => {
      if (id === item.id) {
        item.isSeen = true;

        // setReadNotification(item.id);
      }
    });
  });
};

const markUnRead = (notificationId) => {
  notifications.value.forEach((item) => {
    notificationId.forEach((id) => {
      if (id === item.id) item.isSeen = false;
    });
  });
};

const handleNotificationClick = (notifications) => {
  // แปลงเป็น array เสมอ
  const notis = Array.isArray(notifications) ? notifications : [notifications];

  // mark read
  markRead(notis.map((n) => n.id));

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

const onTouchStart = (e) => {
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

  console.log("Swip", swipeDirection);
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
