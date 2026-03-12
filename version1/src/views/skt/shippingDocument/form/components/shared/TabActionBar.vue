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
})

const emit = defineEmits([
  'print',
  'save-draft',
  'confirm',
  'add-note',
  'delete-note',
  'edit-note',
])

const { permissions } = useTabPermissions(props.tabKey)

// ---------------------------------------------------------------------------
// Action state
// ---------------------------------------------------------------------------

const confirmDialog = ref(false)
const currentAction = ref(null)

function handleSaveDraft() {
  currentAction.value = 'save'
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
    emit('edit-note', {
      id: editingNote.value.id,
      text,
    })
  } else {
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
  emit('delete-note', noteId)
  closeViewNote()
}
</script>

<style scoped>
/**
 * Stylelint: stylelint-config-standard + stylelint-order (grouped)
 * Order: Position → Box Model → Typography → Visual
 */

/* =================================================================
   Action bar (sticky bottom)
   ================================================================= */

.action-bar {
  position: sticky;
  bottom: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  border-top: 1px solid #e0e0e0;
  background: #fff;
}

/* =================================================================
   Left side — Notes
   ================================================================= */

.action-bar__left {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

/* "Click To Add Note" button */

.add-note-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  border: none;
  font-size: 13px;
  color: #666;
  background: none;
  cursor: pointer;
}

.add-note-btn:hover {
  color: #333;
}

.add-note-btn__text {
  text-decoration: underline;
}

/* Saved note chip (green check + text) */

.note-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #2e7d32;
  cursor: pointer;
}

.note-chip:hover {
  text-decoration: underline;
}

/* =================================================================
   Note Popup (shared for Add + View)
   ================================================================= */

.note-popup {
  position: absolute;
  bottom: 100%;
  left: 0;
  z-index: 20;
  width: 340px;
  margin-bottom: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 4px 16px rgb(0 0 0 / 12%);
}

.note-popup__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 8px;
}

.note-popup__title {
  font-size: 14px;
  font-weight: 700;
  color: #333;
}

.note-popup__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 50%;
  color: #666;
  background: none;
  cursor: pointer;
}

.note-popup__close:hover {
  background: #f5f5f5;
}

.note-popup__body {
  padding: 0 16px 12px;
}

.note-popup__hint {
  margin-top: 6px;
  font-size: 12px;
  color: #999;
}

.note-popup__content {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

.note-popup__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 4px;
}

.note-popup__date {
  font-size: 13px;
  color: #777;
}

.note-popup__delete {
  padding: 0;
  border: none;
  font-size: 13px;
  font-weight: 700;
  color: #e53935;
  background: none;
  cursor: pointer;
}

.note-popup__edit {
  padding: 0;
  border: none;
  font-size: 13px;
  font-weight: 700;
  margin-inline-end: 20px;
  color: #5a5244;
  background: none;
  cursor: pointer;
}

.note-popup__edit:hover {
  text-decoration: underline;
}

.note-popup__delete:hover {
  text-decoration: underline;
}

.note-popup__footer {
  display: flex;
  justify-content: flex-end;
  padding: 0 16px 12px;
}

/* =================================================================
   Right side — Buttons
   ================================================================= */

.action-bar__right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* =================================================================
   Responsive
   ================================================================= */

@media (max-width: 960px) {
  .action-bar {
    flex-wrap: wrap;
    gap: 12px;
    padding: 12px 16px;
  }

  .action-bar__left {
    flex: 1 1 100%;
  }

  .action-bar__right {
    flex: 1 1 100%;
    justify-content: flex-end;
  }

  .note-popup {
    width: 300px;
  }
}

@media (max-width: 600px) {
  .action-bar__right {
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>
