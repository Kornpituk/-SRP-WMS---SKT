<!-- ============================================================
  TabActionBar.vue
  Bottom action bar matching screenshots:
  Left:  "Click To Add Note" link  
  Right: PRINT (teal, dropdown) | SAVE DRAFT (coral) | CONFIRM (grey/green)
============================================================ -->
<template>
  <div class="action-bar">
    <!-- Left side: Note -->
    <div class="action-bar__left">
      <v-btn variant="text" size="small" prepend-icon="mdi-cog-outline" class="text-none text-grey-darken-1">
        <span class="text-decoration-underline">Click To Add Note</span>
      </v-btn>
    </div>

    <!-- Right side: Buttons -->
    <div class="action-bar__right">
      <!-- PRINT with dropdown -->
      <v-menu v-if="showPrintOptions" location="top">
        <template #activator="{ props: menuProps }">
          <v-btn
            v-bind="menuProps"
            :disabled="!permissions.canPrint"
            :loading="isPrinting"
            variant="elevated"
            color="teal"
            rounded="lg"
            class="text-none"
            min-width="120"
          >
            <v-icon start>mdi-printer</v-icon>
            PRINT
            <v-icon end size="small">mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list density="compact" min-width="200">
          <v-list-item @click="$emit('print', { target: 'buyer' })">
            <template #prepend><v-checkbox-input model-value color="green" /></template>
            <v-list-item-title>To Buyer</v-list-item-title>
          </v-list-item>
          <v-list-item @click="$emit('print', { target: 'customs' })">
            <template #prepend><v-checkbox-input /></template>
            <v-list-item-title>To Customs</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn
        v-else
        :disabled="!permissions.canPrint"
        :loading="isPrinting"
        variant="elevated"
        color="teal"
        rounded="lg"
        class="text-none"
        min-width="120"
        @click="$emit('print')"
      >
        <v-icon start>mdi-printer</v-icon>
        PRINT
      </v-btn>

      <!-- SAVE DRAFT -->
      <v-btn
        :disabled="!permissions.canSave"
        :loading="isLoading && currentAction === 'save'"
        variant="elevated"
        :color="permissions.canSave ? 'red-lighten-1' : 'grey-lighten-2'"
        rounded="lg"
        class="text-none"
        min-width="140"
        @click="currentAction = 'save'; $emit('save-draft')"
      >
        SAVE DRAFT
      </v-btn>

      <!-- CONFIRM -->
      <v-btn
        :disabled="!permissions.canConfirm"
        :loading="isLoading && currentAction === 'confirm'"
        variant="elevated"
        :color="permissions.canConfirm ? 'green' : 'grey-lighten-2'"
        rounded="lg"
        class="text-none"
        min-width="120"
        @click="confirmDialog = true"
      >
        CONFIRM
      </v-btn>
    </div>

    <!-- Confirm dialog -->
    <v-dialog v-model="confirmDialog" max-width="420" persistent>
      <v-card>
        <v-card-title class="text-h6">Confirm Tab</v-card-title>
        <v-card-text>Once confirmed, this tab becomes read-only and cannot be edited. Continue?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="confirmDialog = false">Cancel</v-btn>
          <v-btn color="green" variant="elevated" @click="confirmDialog = false; currentAction = 'confirm'; $emit('confirm')">
            Yes, Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTabPermissions } from '../../composables/usePermissions'

const props = defineProps({
  tabKey: { type: String, required: true },
  isLoading: { type: Boolean, default: false },
  isDirty: { type: Boolean, default: false },
  isPrinting: { type: Boolean, default: false },
  showPrintOptions: { type: Boolean, default: true },
})

defineEmits(['print', 'save-draft', 'confirm'])

const { permissions } = useTabPermissions(props.tabKey)
const confirmDialog = ref(false)
const currentAction = ref(null)
</script>

<style scoped>
.action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  border-top: 1px solid #e0e0e0;
  background: #fff;
  position: sticky;
  bottom: 0;
  z-index: 10;
}
.action-bar__left {
  display: flex;
  align-items: center;
}
.action-bar__right {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
