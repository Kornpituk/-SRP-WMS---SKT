<!--
  MasterDeleteDialog.vue
  ─────────────────────────────────────────────────────────────────
  Dialog ยืนยันการลบ
  • ไอคอน error ตรงกลาง
  • ข้อความ  "Are you sure you want to delete "[itemName]"?
  This action cannot be undone."
  • ปุ่ม CANCEL (grey outline) + DELETE (red)
  ─────────────────────────────────────────────────────────────────
  Props:
  modelValue : boolean  – v-model เปิด/ปิด
  title      : string   – ชื่อ entity  เช่น "Forwarder"
  itemName   : string   – ชื่อของ record ที่จะลบ เช่น "ABC Logistics"
  ถ้าไม่ส่งมา จะแสดงแค่ entity name
  deleting   : boolean  – loading state ขณะลบ
  ─────────────────────────────────────────────────────────────────
-->
<template>
  <VDialog
    :model-value="modelValue"
    width="460"
    persistent
    @update:model-value="emit('update:modelValue', $event)"
  >
    <VCard class="delete-card">
      <!-- ─── Body ─────────────────────────────── -->
      <VCardText class="delete-body">
        <!-- ไอคอน warning -->
        <div class="icon-wrap">
          <div class="icon-circle">
            <VIcon
              size="32"
              color="white"
            >
              ri-error-warning-fill
            </VIcon>
          </div>
        </div>

        <!-- หัวข้อ -->
        <p class="delete-heading">
          Are you sure?
        </p>

        <!-- ข้อความหลัก -->
        <p class="delete-msg">
          You are about to delete
          <!-- ชื่อ item ใส่กรอบเน้น -->
          <span
            v-if="itemName"
            class="item-name"
          >"{{ itemName }}"</span>
          <span v-else>this {{ title }}</span>.
        </p>

        <!-- คำเตือน -->
        <div class="warning-box">
          <VIcon
            size="15"
            color="error"
            class="me-1"
          >
            mdi-alert-outline
          </VIcon>
          <span>This action cannot be undone.</span>
        </div>
      </VCardText>

      <!-- ─── Actions ──────────────────────────── -->
      <VCardActions class="delete-actions">
        <VBtn
          color="grey"
          variant="outlined"
          class="confirm-btn"
          :disabled="deleting"
          @click="emit('cancel')"
        >
          CANCEL
        </VBtn>
        <VBtn
          color="error"
          variant="flat"
          class="confirm-btn"
          :loading="deleting"
          @click="emit('confirm')"
        >
          <VIcon
            start
            size="16"
          >
            mdi-trash-can-outline
          </VIcon>
          DELETE
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
defineProps({
  /** v-model: เปิด/ปิด dialog */
  modelValue: {
    type: Boolean,
    required: true,
  },

  /** ชื่อ entity เช่น "Forwarder", "Port", "Carrier" */
  title: {
    type: String,
    required: true,
  },

  /**
   * ชื่อของ record ที่จะลบ — ดึงจาก item ตาม deleteNameKey
   * เช่น "ABC Logistics", "Net 30 days"
   * ถ้าไม่ส่ง จะแสดง "this [title]" แทน
   */
  itemName: {
    type: String,
    default: '',
  },

  deleting: {
    type: Boolean,
    default: false,
  },
})

// ─── Emits ────────────────────────────────────
const emit = defineEmits([
  'update:modelValue', // v-model
  'confirm',           // กดปุ่ม DELETE → ลบ
  'cancel',            // กดปุ่ม CANCEL → ปิด
])
</script>

<style scoped>
.delete-card {
  border-radius: 16px !important;
  text-align: center;
  /* stylelint-disable-next-line order/properties-order */
  overflow: hidden;
}

.delete-body {
  /* stylelint-disable-next-line liberty/use-logical-spec */
  padding: 40px 32px 20px !important;
}

/* ── ไอคอนวงกลมพื้นแดง ── */
.icon-wrap {
  margin-block-end: 20px;
  /* stylelint-disable-next-line order/properties-order */
  display: flex;
  justify-content: center;
}

.icon-circle {
  inline-size: 64px;
  /* stylelint-disable-next-line order/properties-order */
  block-size: 64px;
  /* stylelint-disable-next-line order/properties-order */
  border-radius: 50%;
  background: #ffebee;
  /* stylelint-disable-next-line order/properties-order */
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #ef9a9a;
}

.icon-circle .v-icon {
  color: #e53935 !important;
}

/* ── ข้อความ ── */
.delete-heading {
  font-size: 18px;
  font-weight: 700;
  /* stylelint-disable-next-line order/properties-order */
  color: #212121;
  margin-block: 0;
  margin-inline: 0;
  /* stylelint-disable-next-line order/properties-order */
  margin-block-end: 10px;
}

.delete-msg {
  font-size: 14px;
  /* stylelint-disable-next-line order/properties-order */
  color: #616161;
  margin-block: 0;
  margin-inline: 0;
  /* stylelint-disable-next-line order/properties-order */
  margin-block-end: 16px;
  /* stylelint-disable-next-line order/properties-order */
  line-height: 1.6;
}

/* ชื่อ item เน้นด้วยกล่อง */
.item-name {
  display: inline-block;
  font-weight: 600;
  /* stylelint-disable-next-line order/properties-order */
  color: #212121;
  /* stylelint-disable-next-line order/properties-order */
  background: #f5f5f5;
  /* stylelint-disable-next-line order/properties-order */
  border: 1px solid #e0e0e0;
  /* stylelint-disable-next-line order/properties-order */
  border-radius: 4px;
  /* stylelint-disable-next-line order/properties-order */
  padding-block: 1px;
  /* stylelint-disable-next-line order/properties-order */
  padding-inline: 7px;
  /* stylelint-disable-next-line order/properties-order */
  font-size: 13.5px;
  /* stylelint-disable-next-line order/properties-order */
  margin-block: 0;
  /* stylelint-disable-next-line order/properties-order */
  margin-inline: 1px;
}

/* คำเตือน cannot be undone */
.warning-box {
  display: inline-flex;
  align-items: center;
  background: #fff3f3;
  /* stylelint-disable-next-line order/properties-order */
  border: 1px solid #ffcdd2;
  /* stylelint-disable-next-line order/properties-order */
  border-radius: 6px;
  /* stylelint-disable-next-line order/properties-order */
  padding-block: 6px;
  /* stylelint-disable-next-line order/properties-order */
  padding-inline: 14px;
  /* stylelint-disable-next-line order/properties-order */
  font-size: 12.5px;
  /* stylelint-disable-next-line order/properties-order */
  color: #c62828;
  /* stylelint-disable-next-line order/properties-order */
  font-weight: 500;
}

/* ── Buttons ── */
.delete-actions {
  justify-content: center !important;
  gap: 12px;
  /* stylelint-disable-next-line order/properties-order */
  padding-block: 8px;
  /* stylelint-disable-next-line order/properties-order */
  padding-inline: 24px 28px !important;
}

.confirm-btn {
  min-inline-size: 130px !important;
  /* stylelint-disable-next-line order/properties-order */
  block-size: 40px !important;
  /* stylelint-disable-next-line order/properties-order */
  font-weight: 700 !important;
  /* stylelint-disable-next-line order/properties-order */
  border-radius: 8px !important;
  /* stylelint-disable-next-line order/properties-order */
  letter-spacing: 0.5px;
  /* stylelint-disable-next-line order/properties-order */
  font-size: 13px !important;
}
</style>
