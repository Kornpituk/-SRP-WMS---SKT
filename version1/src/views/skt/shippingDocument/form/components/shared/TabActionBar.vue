<!--
  TabActionBar.vue — Vue 3 + Vuetify 3 + Composition API
  Stylelint: stylelint-config-standard + stylelint-order

  Figma match:
  - Left side:
  - No notes: "Click To Add Note" link with gear icon
  - Has notes: green check icon + note text (clickable → shows note popup)
  - Right side: PRINT ▼ | SAVE DRAFT | CONFIRM

  Add Note popup (Image 2):
  - Title "Add Note" + X
  - Textarea
  - "Press Enter to save, click outside to close"
  - Green SAVE button

  View Note popup (Image 3):
  - Title "Note" + X
  - Note text
  - Divider
  - Date + DELETE button
-->
<template>
  <div class="action-bar">
    <!-- ============================================== -->
    <!-- LEFT: Notes area                                -->
    <!-- ============================================== -->
    <div class="action-bar__left">
      <!-- Saved notes display -->
      <template v-if="notes?.length">
        <div
          v-for="note in notes"
          :key="note.id"
          class="note-chip"
          @click="openViewNote(note)"
        >
          <VIcon
            size="18"
            color="green"
            class="note-chip__icon"
          >
            mdi-check-circle
          </VIcon>
          <span class="note-chip__text">{{ note.text }}</span>
        </div>
      </template>

      <!-- Add note button -->
      <button
        type="button"
        class="add-note-btn"
        @click="openAddNote"
      >
        <VIcon
          size="18"
          class="add-note-btn__icon"
        >
          mdi-cog-outline
        </VIcon>
        <span class="add-note-btn__text">Click To Add Note</span>
      </button>

      <!-- Add Note Popup -->
      <div
        v-if="showAddDialog"
        v-click-outside="closeAddNote"
        class="note-popup"
      >
        <div class="note-popup__header">
          <span class="note-popup__title">Add Note</span>
          <button
            type="button"
            class="note-popup__close"
            @click="closeAddNote"
          >
            <VIcon size="18">
              mdi-close
            </VIcon>
          </button>
        </div>

        <div class="note-popup__body">
          <VTextarea
            v-model="newNoteText"
            variant="outlined"
            density="compact"
            hide-details
            rows="3"
            placeholder="Enter Notes"
            auto-grow
            @keydown.enter.prevent="saveNote"
          />
          <p class="note-popup__hint">
            Press Enter to save, click outside to close
          </p>
        </div>

        <div class="note-popup__footer">
          <VBtn
            color="green"
            variant="elevated"
            size="small"
            rounded="lg"
            class="text-none"
            min-width="80"
            :disabled="!newNoteText.trim()"
            @click="saveNote"
          >
            SAVE
          </VBtn>
        </div>
      </div>

      <!-- View Note Popup -->
      <div
        v-if="viewingNote"
        v-click-outside="closeViewNote"
        class="note-popup"
      >
        <div class="note-popup__header">
          <span class="note-popup__title">Note</span>
          <button
            type="button"
            class="note-popup__close"
            @click="closeViewNote"
          >
            <VIcon size="18">
              mdi-close
            </VIcon>
          </button>
        </div>

        <div class="note-popup__body">
          <p class="note-popup__content">
            {{ viewingNote.text }}
          </p>
          <VDivider class="my-2" />
          <div class="note-popup__meta">
            <span class="note-popup__date">{{ viewingNote.date }}</span>

            <div class="note-popup__actions">
              <button
                type="button"
                class="note-popup__edit"
                @click="startEditNote"
              >
                EDIT
              </button>

              <button
                type="button"
                class="note-popup__delete"
                @click="deleteNote(viewingNote.id)"
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- RIGHT: Action buttons                           -->
    <!-- ============================================== -->
    <div class="action-bar__right">
      <!-- PRINT -->
      <VMenu
        v-if="showPrintOptions"
        location="top"
      >
        <template #activator="{ props: menuProps }">
          <VBtn
            v-bind="menuProps"
            :disabled="!permissions.canPrint"
            :loading="isPrinting"
            variant="elevated"
            color="teal"
            rounded="lg"
            class="text-none"
            min-width="120"
          >
            <VIcon start>
              mdi-printer
            </VIcon>
            PRINT
            <VIcon
              end
              size="small"
            >
              mdi-menu-down
            </VIcon>
          </VBtn>
        </template>
        <VList
          density="compact"
          min-width="200"
        >
          <VListItem @click="$emit('print', { target: 'buyer' })">
            <VListItemTitle>To Buyer</VListItemTitle>
          </VListItem>
          <VListItem @click="$emit('print', { target: 'customs' })">
            <VListItemTitle>To Customs</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>

      <VBtn
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
        <VIcon start>
          mdi-printer
        </VIcon>
        PRINT
      </VBtn>

      <div class="print-section d-flex align-center ga-1">
        <VSelect
          v-if="printTargets && printTargets.length"
          v-model="internalSelected"
          :items="printTargets"
          item-title="title"
          item-value="value"
          density="compact"
          hide-details
          style="min-width: 120px;"
        />
        <VBtn
          :loading="isPrinting"
          :disabled="!canPrint"
          @click="$emit('print', internalSelected)"
        >
          พิมพ์
        </VBtn>
      </div>

      <!-- SAVE DRAFT -->
      <VBtn
        :disabled="!permissions.canSave"
        :loading="isLoading && currentAction === 'save'"
        variant="elevated"
        :color="permissions.canSave ? 'red-lighten-1' : 'grey-lighten-2'"
        rounded="lg"
        class="text-none"
        min-width="140"
        @click="handleSaveDraft"
      >
        SAVE DRAFT
      </VBtn>

      <!-- CONFIRM -->
      <VBtn
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
      </VBtn>
    </div>

    <!-- Confirm dialog -->
    <VDialog
      v-model="confirmDialog"
      max-width="420"
      persistent
    >
      <VCard>
        <VCardTitle class="text-h6">
          Confirm Tab
        </VCardTitle>
        <VCardText>
          Once confirmed, this tab becomes read-only and cannot be edited. Continue?
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn
            variant="text"
            @click="confirmDialog = false"
          >
            Cancel
          </VBtn>
          <VBtn
            color="green"
            variant="elevated"
            @click="handleConfirm"
          >
            Yes, Confirm
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
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
  notes: { type: Array, default: () => [] },
  isPrinting: Boolean,
  canPrint: Boolean,
  printTargets: {
    type: Array,
    default: () => [],
  },
  selectedTarget: String,
})

const emit = defineEmits([
  'print',
  'save-draft',
  'confirm',
  'add-note',
  'delete-note',
  'edit-note',
  'print',
  'update:selectedTarget',
])

const { permissions } = useTabPermissions(props.tabKey)

// ---------------------------------------------------------------------------
// Action state
// ---------------------------------------------------------------------------

const confirmDialog = ref(false)
const currentAction = ref(null)

function handleSaveDraft() {
  currentAction.value = 'save'
  // eslint-disable-next-line vue/custom-event-name-casing
  emit('save-draft')
}

function handleConfirm() {
  confirmDialog.value = false
  currentAction.value = 'confirm'
  emit('confirm')
}

// ---------------------------------------------------------------------------
// Note: Add
// ---------------------------------------------------------------------------

const showAddDialog = ref(false)
const newNoteText = ref('')

function openAddNote() {
  showAddDialog.value = true
  newNoteText.value = ''
}

function closeAddNote() {
  showAddDialog.value = false
  newNoteText.value = ''
}

function saveNote() {
  const text = newNoteText.value.trim()

  if (!text) {
    return
  }

  if (editingNote.value) {
    // eslint-disable-next-line vue/custom-event-name-casing
    emit('edit-note', {
      id: editingNote.value.id,
      text,
    })
  } else {
    // eslint-disable-next-line vue/custom-event-name-casing
    emit('add-note', text)
  }

  editingNote.value = null
  closeAddNote()
}

// ---------------------------------------------------------------------------
// Note: Edit
// ---------------------------------------------------------------------------

const editingNote = ref(null)
const editingNoteText = ref('')

function cancelEditNote() {
  editingNote.value = null
  editingNoteText.value = ''
}

function startEditNote() {
  editingNote.value = viewingNote.value
  newNoteText.value = viewingNote.value.text

  closeViewNote()
  showAddDialog.value = true
}

// ---------------------------------------------------------------------------
// Note: View / Delete
// ---------------------------------------------------------------------------

const viewingNote = ref(null)

function openViewNote(note) {
  viewingNote.value = note
}

function closeViewNote() {
  viewingNote.value = null
}

function deleteNote(noteId) {
  // eslint-disable-next-line vue/custom-event-name-casing
  emit('delete-note', noteId)
  closeViewNote()
}

// ---------------------------------------------------------------------------
// Print
// ---------------------------------------------------------------------------
import { computed } from 'vue'


const internalSelected = computed({
  get: () => props.selectedTarget,
  set: val => emit('update:selectedTarget', val),
})
</script>

<style src="./css/TabActionBar.css" />

