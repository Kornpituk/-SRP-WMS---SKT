<script setup>
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import { avatarText } from "@core/utils/formatters";
import { useRouter } from "vue-router";
import { watchEffect } from "vue";

const props = defineProps({
  notifications: {
    type: Array,
    default: () => [],
    required: true,
  },
  badgeProps: {
    type: null,
    required: false,
    default: undefined,
  },
  location: {
    type: null,
    required: false,
    default: "bottom end",
  },
});

const emit = defineEmits(["read", "unread", "remove", "click:notification"]);

const isAllMarkRead = computed(() =>
  props.notifications.some((item) => item.isSeen === false)
);

// ✅ ใช้ ref สำหรับ test
const testNotifications = ref([...props.notifications]);

// state สำหรับควบคุมการสั่น
const isShaking = ref(false);
let timeoutId = null;
const loadingIconAlert = ref(false);
const loadingIconAlertId = ref("");

// const groupedNotifications = computed(() => {
//   const groups = {}

//   props.notifications.forEach(noti => {
//     if (!groups[noti.statusId]) {
//       groups[noti.statusId] = {
//         ...noti,            // เก็บข้อมูล item แรกไว้ใช้แสดง
//         count: 1,           // เริ่มนับ 1
//         items: [noti],       // เก็บรายการทั้งหมดใน group
//       }
//     } else {
//       groups[noti.statusId].count++
//       groups[noti.statusId].items.push(noti)
//     }
//   })

//   return Object.values(groups)
// })

// เพิ่มแจ้งเตือนใหม่เพื่อทดสอบ
const addTestNotification = () => {
  const newId = Date.now();

  // eslint-disable-next-line vue/no-mutating-props
  props.notifications.push({
    id: newId,
    title: `New Alert ${newId}`,
    subtitle: "This is a test notification",
    time: "Just now",
    isSeen: false,
    color: "primary",
    icon: "mdi-bell-alert",
  });
  emit("update:notifications", props.notifications);
  isShaking.value = true;

  console.log("sShaking.value", isShaking.value, props.notifications);
};

// Watch ดูว่า notifications เพิ่มขึ้นไหม
watchEffect(
  () => props.notifications,
  (newVal, oldVal) => {
    console.log("sShaking.value", isShaking.value);
    if (oldVal && newVal.length > oldVal.length) {
      console.log("sShaking.value", isShaking.value);

      // มีแจ้งเตือนใหม่เข้ามา
      isShaking.value = true;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        console.log("sShaking.value", isShaking.value);
        isShaking.value = false;
      }, 1200); // ให้สั่น 1.2 วินาทีแล้วหยุด
    }
  },
  { deep: true }
);

const markAllReadOrUnread = () => {
  isShaking.value = false;

  const allNotificationsIds = props.notifications.map((item) => item.id);
  if (!isAllMarkRead.value) emit("unread", allNotificationsIds);
  else emit("read", allNotificationsIds);
};

const handleClickNotification = (noti) => {
  if (loadingIconAlert.value) return; // ป้องกัน spam click

  // ถ้าอ่านแล้วไม่ต้อง emit อีก
  if (noti.isSeen) return;

  emit("read", [noti.id]);

  // emit("click:notification", noti);

  loadingIconAlert.value = true;
  loadingIconAlertId.value = noti.id;

  // mock simulate loading done
  setTimeout(() => {
    loadingIconAlert.value = false;
  }, 1000);
};
</script>

<template>
  <!-- ปุ่มทดสอบ -->
  <VBtn v-if="false" color="primary" class="ma-4" @click="addTestNotification">
    Add Test Notification
  </VBtn>

  <IconBtn id="notification-btn">
    <VBadge
      v-bind="props.badgeProps"
      :model-value="props.notifications.some((n) => !n.isSeen)"
      color="error"
      :content="props.notifications.filter((n) => !n.isSeen).length"
      bordered
      offset-x="1"
      offset-y="1"
    >
      <VIcon icon="mdi-bell-outline" :class="{ 'bell-shake': isShaking }" />
    </VBadge>

    <VMenu
      activator="parent"
      width="380px"
      :location="props.location"
      offset="14px"
      :close-on-content-click="false"
    >
      <VCard class="d-flex flex-column">
        <!-- 👉 Header -->
        <VCardItem class="notification-section">
          <VCardTitle>
            <span class="text-sm font-weight-regular">Notifications</span>
          </VCardTitle>

          <template #append>
            <!--
              <IconBtn v-show="props.notifications.length" @click="markAllReadOrUnread">
              <VIcon
              :icon="!isAllMarkRead ? 'mdi-email-open-outline' : 'mdi-email-outline'"
              />

              <VTooltip activator="parent" location="start">
              {{ !isAllMarkRead ? "Mark all as unread" : "Mark all as read" }}
              </VTooltip>
              </IconBtn> 
            -->
          </template>
        </VCardItem>

        <VDivider />

        <!-- 👉 Notifications list -->
        <PerfectScrollbar
          :options="{ wheelPropagation: false }"
          style="max-block-size: 23.75rem"
        >
          <VList class="py-0">
            <template v-for="(noti, index) in props.notifications" :key="noti.id">
              <VDivider v-if="index > 0" />

              <VListItem
                link
                lines="one"
                min-height="66px"
                class="list-item-hover-class px-2"
                px
                :style="{
                  borderLeft: `${!noti.isSeen ? '8px solid #02E60A' : ''}`,
                  transition: 'border-color 0.3s ease',
                }"
                @click.stop="handleClickNotification(noti)"
              >
                <VListItemTitle>
                  <VBtn
                    :color="!noti.isSeen ? noti.color : 'grey'"
                    :variant="!noti.isSeen ? 'tonal' : 'outlined'"
                    class="px-2"
                    @click="
                      $emit(noti.isSeen ? 'unread' : 'read', [noti.id]),
                        $emit('click:notification', noti),
                        (loadingIconAlert = true),
                        (loadingIconAlertId = noti.id)
                    "
                  >
                    <VIcon icon="ri-error-warning-fill" />
                    <span class="text-sm">
                      {{ noti.status }}
                    </span>
                  </VBtn>
                </VListItemTitle>

                <div class="text-xs text-disabled mt-2">
                  P/O No:<span class="font-weight-bold">{{ noti.po }}</span
                  >, Lot:<span class="font-weight-bold">{{ noti.lot }}</span>
                </div>
                <div class="text-xs text-disabled">
                  {{ noti.dateTime }}
                </div>

                <template #append>
                  <div
                    class="d-flex flex-column align-center gap-4"
                    :class="[!noti.isSeen ? `bg-${noti.color}` : 'text-grey', ,]"
                  >
                    {{ noti.time }}
                  </div>
                </template>

                <VProgressLinear
                  v-if="loadingIconAlert && loadingIconAlertId === noti.id"
                  color="primary"
                  indeterminate
                />
              </VListItem>
            </template>

            <VListItem
              v-show="!props.notifications.length"
              class="text-center text-medium-emphasis"
              style="block-size: 56px"
            >
              <VListItemTitle>No Notification Found!</VListItemTitle>
            </VListItem>
          </VList>
        </PerfectScrollbar>

        <VDivider />

        <!-- 👉 Footer -->
        <VCardText
          v-if="false"
          v-show="props.notifications.length"
          class="notification-footer"
        >
          <VBtn block> VIEW ALL NOTIFICATIONS </VBtn>
        </VCardText>
      </VCard>
    </VMenu>
  </IconBtn>
</template>

<style lang="scss">
.notification-section {
  padding: 14px !important;
}

.notification-footer {
  padding-block: 0.9375rem !important;
}

.list-item-hover-class {
  .visible-in-hover {
    display: none;
  }

  &:hover {
    .visible-in-hover {
      display: block;
    }
  }
}

@keyframes bell-shake {
  0% {
    transform: rotate(0deg);
  }
  10% {
    transform: rotate(-15deg);
  }
  20% {
    transform: rotate(15deg);
  }
  30% {
    transform: rotate(-10deg);
  }
  40% {
    transform: rotate(10deg);
  }
  50% {
    transform: rotate(-5deg);
  }
  60% {
    transform: rotate(5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.bell-shake {
  animation: bell-shake 1.2s ease;
}

.v-badge__badge {
  block-size: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  min-inline-size: 20px;
  padding-block: 0 1px;
  padding-inline: 0 1px;
}
</style>
