<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  fileName: { type: String, required: true },
  typeFileInput: { type: String, default: '' },
  typeBtn: { type: String, default: '' },
  titleDialog: { type: String, default: 'Dialog Title' },
})

const emit = defineEmits(['updateFiles']) // กำหนด event ชื่อ updateFiles

const files = ref([]) // เก็บข้อมูลไฟล์
const filesModel = ref([]) // เก็บข้อมูลไฟล์
const dialogVisible = ref(false) // สถานะเปิด/ปิด Dialog
const selectedIndex = ref(0) // ใช้กำหนด Index สำหรับ Carousel

const emitUpdateFiles = () => {
  emit('updateFiles', {
    name: props.fileName,
    files: files.value, // หรือข้อมูลไฟล์ที่ต้องการส่งออก
  })
}

// ฟังก์ชันจัดการการอัปโหลดไฟล์
const handleFileUpload = event => {
  const uploadedFiles = Array.from(event.target.files)

  uploadedFiles.forEach(file => {
    const fileType = file.type.startsWith('image/') ? 'image' : 'pdf'
    const objectUrl = URL.createObjectURL(file) // สร้าง URL สำหรับ preview

    files.value.push({ file, objectUrl, type: fileType, name: file.name })
  })

  emitUpdateFiles() // ส่งข้อมูลไปยัง parent
}

// ฟังก์ชันเปิด Dialog พร้อมตั้งค่า Index ของไฟล์ที่ต้องการแสดง
const openDialogWithoutIndex = () => {
  openDialog() // เปิด Dialog โดยไม่ต้องตั้งค่า Index
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

  emitUpdateFiles() // อัปเดตข้อมูลไปยัง parent
}
</script>

<template>
  <div>
    <VRow class="d-flex align-center">
      <VCol
        class="px-2"
        cols="8"
      >
        <!-- อัปโหลดไฟล์ -->
        <VFileInput
          v-model="filesModel"
          multiple
          clearable
          accept="image/*,.pdf"
          style="max-width: 200px;"
          density="compact"
          @change="handleFileUpload"
        >
          <template #selection="{ fileNames }">
            <template
              v-for="(fileName, index) in fileNames"
              :key="fileName"
            >
              <VChip
                v-if="index < 1"
                class="me-2"
                color="deep-purple-accent-4"
                size="small"
                label
              >
                {{ fileName }}
              </VChip>

              <span
                v-else-if="index === 1"
                class="text-overline text-grey-darken-3 mx-2"
              >
                +{{ files.length - 1 }} File(s)
              </span>
            </template>
          </template>
        </VFileInput>
      </VCol>
      <VCol
        class="d-flex align-center px-2"
        cols="4"
      >
        <!-- ปุ่มเปิด Carousel Dialog -->
        <VBtn
          :disabled="!files.length || !filesModel.length"
          class="d-flex justify-center"
          :color="files.length && filesModel.length? 'primary' : 'grey'"
          style="max-width: 70px;"
          @click="openDialog"
        >
          <div><VIcon icon="ri-gallery-fill" /></div>
          <div v-if="files.length && filesModel.length">{{ files.length }}+</div>
        </VBtn>
      </VCol>
    </VRow>
    
    <!-- แสดงไฟล์ -->
    <div v-if="props.typeFileInput !== 'hideInput'">
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

    <!-- Dialog สำหรับ Carousel -->
    <VDialog
      v-model="dialogVisible"
      max-width="80%"
    >
      <VCard>
        <VCardTitle class="">
          <VRow>
            <VCol
              class="d-flex justify-center align-center"
              cols="11"
            >
              <span style="margin-left: 70px;">{{ props.titleDialog }}</span>
            </VCol>
            <VCol
              class="d-flex justify-end align-center"
              cols="1"
            >
              <VIcon
                icon="ri-close-circle-fill"
                @click="closeDialog"
              />
            </VCol>
          </VRow>
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
                <iframe 
                  :src="file.objectUrl"
                  type="application/pdf"
                  style="width: 80%; height: 500px;"
                />
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
