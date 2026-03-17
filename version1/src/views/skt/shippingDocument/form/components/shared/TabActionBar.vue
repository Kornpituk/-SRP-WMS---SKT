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
      <div class="text-center">
        <VMenu
          v-if="showPrintOptions"
          v-model="menu"
          :close-on-content-click="false"
          location="end"
        >
          <template #activator="{ props: menuProps }">
            <VBtn
              v-bind="menuProps"
              :disabled="!permissions.canPrint"
              :loading="isPrinting"
              variant="elevated"
              color="teal-lighten-2"
              rounded="lg"
              class="text-none"
              min-width="140"
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

          <!-- MENU -->
          <VCard min-width="320">
            <VCardTitle class="d-flex align-center">
              <VIcon
                icon="mdi-printer"
                class="mx-2"
                color="primary"
              />
              Print Form {{ tabKey }}
              <VSpacer />
              <VBtn
                icon="mdi-close"
                variant="text"
                @click="menu = false"
              />
            </VCardTitle>

            <VDivider />

            <VList>
              <VListItem>
                <VRadioGroup v-model="selectedTarget">
                  <VRadio
                    label="To Buyer"
                    value="buyer"
                  />
                  <VRadio
                    label="To Customs"
                    value="customs"
                  />
                </VRadioGroup>
              </VListItem>
            </VList>

            <VDivider />

            <VCardActions>
              <VSpacer />
              <VBtn
                color="green"
                variant="elevated"
                rounded="lg"
                class="text-none my-2"
                min-width="130"
                @click="handleConfirm"
              >
                CONFIRM
              </VBtn>
            </VCardActions>
          </VCard>
        </VMenu>

        <VBtn
          v-else
          :disabled="!permissions.canPrint"
          :loading="isPrinting"
          variant="elevated"
          color="teal-lighten-2"
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

        <!-- DISPLAY DIALOG -->
        <VDialog
          v-model="displayDialog"
          width="500"
        >
          <VCard>
            <VCardTitle class="d-flex align-center">
              Would you like to display these on the form?
              <VSpacer />
              <VBtn
                icon="mdi-close"
                variant="text"
                @click="displayDialog = false"
              />
            </VCardTitle>

            <VCardText>
              <VCheckbox
                v-for="item in currentDisplayFields"
                :key="item"
                v-model="displaySelections"
                style="margin: 0 100px;"
                :label="formatLabel(item)"
                :value="item"
                hide-details
              />
            </VCardText>

            <VCardActions>
              <VSpacer />
              <VBtn
                variant="elevated"
                rounded="lg"
                class="text-none"
                min-width="120"
                color="cyan"
                @click="handlePrint"
              >
                <VIcon
                  icon="mdi-printer"
                  class="mx-2"
                  color="white"
                /> <span class="text-white">PRINT</span>
              </VBtn>
            </VCardActions>
          </VCard>
        </VDialog>
      </div>
      <!-- SAVE DRAFT -->
      <VBtn
        :disabled="!permissions.canSave"
        :loading="isLoading && currentAction === 'save'"
        variant="elevated"
        :color="permissions.canSave ? 'orange-darken-1' : 'grey-lighten-2'"
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
  printConfig: {
    type: Object,
    default: () => ({}),
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

// function handleConfirm() {
//   confirmDialog.value = false
//   currentAction.value = 'confirm'
//   emit('confirm')
// }

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

const fav = ref(true)
const menu = ref(false)
const selectedTarget = ref(null) // 'buyer' | 'customs'

const displayDialog = ref(false)
const displaySelections = ref([])

const message = ref(false)
const hints = ref(true)

const currentDisplayFields = computed(() => {
  if (!selectedTarget.value) return []

  return props.printConfig[selectedTarget.value]?.displayFields || []
})

// ------------------ config ------------------
const PRINT_CONFIG = {
  buyer: {
    hasDisplay: true,
    displayFields: ['lotNo', 'productDescription', 'note'],
  },
  customs: {
    hasDisplay: false,
    displayFields: [],
  },
}

// ------------------ methods ------------------
function handleConfirm() {
  if (!selectedTarget.value) return

  const config = props.printConfig[selectedTarget.value]

  if (config?.hasDisplay) {
    displaySelections.value = []
    displayDialog.value = true
  } else {
    emit('confirm', {
      target: selectedTarget.value,
    })
  }

  menu.value = false
}

function handlePrint() {
  emit('print', {
    target: selectedTarget.value,
    display: displaySelections.value,
  })

  displayDialog.value = false
}

function formatLabel(key) {
  const map = {
    lotNo: 'Lot No.',
    productDescription: 'Product Description',
    note: 'Note',
  }
  
  return map[key] || key
}

const internalSelected = computed({
  get: () => props.selectedTarget,
  set: val => emit('update:selectedTarget', val),
})
</script>

<style src="./css/TabActionBar.css" />

