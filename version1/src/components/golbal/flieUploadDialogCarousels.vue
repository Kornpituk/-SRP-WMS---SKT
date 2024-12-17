<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  typeDialog: { type: String, default: '' },
  typeBtn: { type: String, default: '' },
  titleDialog: { type: String, default: 'Dialog Title' },
})

const files = ref([]) // เก็บข้อมูลไฟล์
const dialogVisible = ref(false) // สถานะเปิด/ปิด Dialog
const selectedIndex = ref(0) // ใช้กำหนด Index สำหรับ Carousel

// ฟังก์ชันจัดการการอัปโหลดไฟล์
const handleFileUpload = event => {
  const uploadedFiles = Array.from(event.target.files)

  uploadedFiles.forEach(file => {
    const fileType = file.type.startsWith('image/') ? 'image' : 'pdf'
    const objectUrl = URL.createObjectURL(file) // สร้าง URL สำหรับ preview

    files.value.push({ file, objectUrl, type: fileType, name: file.name })
  })
}

// ฟังก์ชันเปิด Dialog
const openDialog = () => {
  dialogVisible.value = true
}

// ฟังก์ชันปิด Dialog
const closeDialog = () => {
  dialogVisible.value = false
}

// ฟังก์ชันลบไฟล์
const removeFile = index => {
  const file = files.value[index]

  URL.revokeObjectURL(file.objectUrl) // ล้าง Object URL เพื่อป้องกัน Memory Leak
  files.value.splice(index, 1)
}
</script>

<template>
  <div>
    <!-- อัปโหลดไฟล์ -->
    <VFileInput
      multiple
      label="Upload Files"
      accept="image/*,.pdf"
      @change="handleFileUpload"
    />

    <!-- แสดงไฟล์ -->
    <div>
      <VRow
        v-if="files.length"
        class="mt-4"
      >
        <VCol
          v-for="(file, index) in files"
          :key="index"
          cols="12"
          md="4"
          lg="3"
          class="d-flex flex-column align-center"
        >
          <VCard
            max-width="250"
            outlined
            class="mb-2"
          >
            <VImg
              v-if="file.type === 'image'"
              :src="file.objectUrl"
              aspect-ratio="1"
              class="rounded"
            />
            <VIcon
              v-else
              icon="mdi-file-pdf-box"
              size="48"
              class="mt-2 text-danger"
            />
            <div class="d-flex justify-center align-center mt-2">
              {{ file.name }}
            </div>
          </VCard>
          <VBtn
            icon
            color="red"
            @click="removeFile(index)"
          >
            <VIcon icon="mdi-delete" />
          </VBtn>
        </VCol>
      </VRow>
    </div>

    <!-- ปุ่มเปิด Carousel Dialog -->
    <VBtn
      v-if="files.length"
      class="mt-4"
      color="primary"
      @click="openDialog"
    >
      View Files in Carousel
    </VBtn>

    <!-- Dialog สำหรับ Carousel -->
    <VDialog
      v-model="dialogVisible"
      max-width="80%"
    >
      <VCard>
        <VCardTitle class="d-flex text center align-center justify-space-between">
          Preview Files<VIcon
            icon="ri-close-circle-fill"
            color="red"
            @click="closeDialog"
          />
        </VCardTitle>
        
        <VCardText>
          <VCarousel
            v-model="selectedIndex"
            show-arrows="hover"
            hide-delimiter-background
          >
            <VCarouselItem
              v-for="(file, index) in files"
              :key="index"
            >
              <VImg
                v-if="file.type === 'image'"
                :src="file.objectUrl"
              />
              <div
                v-else
                class="d-flex justify-center align-center"
              >
                <embed
                  :src="file.objectUrl"
                  type="application/pdf"
                  style="width: 100%; height: 80%;"
                >
              </div>
            </VCarouselItem>
          </VCarousel>
        </VCardText>
        <VCardActions v-if="false">
          <VSpacer />
          <VBtn
            color="primary"
            text
            @click="closeDialog"
          >
            Close
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
/* ปรับแต่ง Carousel หรือไฟล์แสดง */
</style>
