<template>
  <VDialog
    :model-value="modelValue"
    max-width="450"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <VCard
      rounded="s"
      class="pa-6 text-center"
    >
      <!-- ── Warning Icon ──────────────────────────── -->
      <div class="d-flex justify-center mb-4">
        <div class="void-icon-wrap">
          <VIcon
            size="32"
            color="error"
          >
            mdi-exclamation-thick
          </VIcon>
        </div>
      </div>

      <!-- ── Title ─────────────────────────────────── -->
      <VCardTitle class="text-h6 font-weight-bold pa-0 mb-3">
        Are you sure?
      </VCardTitle>

      <!-- ── Body ──────────────────────────────────── -->
      <VCardText class="pa-0 mb-4">
        <p class="text-body-1 mb-3">
          You are about to void
          <VChip
            label
            size="small"
            variant="outlined"
            class="font-weight-bold mx-1"
          >
            "{{ docLabel }}"
          </VChip>
        </p>

        <!-- Warning alert -->
        <div class="void-warning">
          <VIcon
            size="16"
            color="error"
            class="me-2"
          >
            mdi-alert-outline
          </VIcon>
          <span class="text-body-2 text-error font-weight-medium">
            This action cannot be undone.
          </span>
        </div>
      </VCardText>

      <!-- ── Actions ───────────────────────────────── -->
      <VCardActions class="pa-0 justify-center gap-3">
        <VBtn
          variant="outlined"
          color="default"
          min-width="100"
          :disabled="loading"
          @click="$emit('cancel')"
        >
          CANCEL
        </VBtn>

        <VBtn
          variant="flat"
          color="error"
          min-width="100"
          :loading="loading"
          @click="$emit('confirm')"
        >
          VOID
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
defineProps({
  // v-model — ควบคุม open/close จาก parent
  modelValue: {
    type: Boolean,
    default: false,
  },

  // ชื่อ document ที่จะ void — แสดงใน chip
  docLabel: {
    type: String,
    default: '',
  },

  // loading state ขณะเรียก API
  loading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['update:modelValue', 'confirm', 'cancel'])
</script>

<style scoped src="./voidConfirmDialog.css" />

