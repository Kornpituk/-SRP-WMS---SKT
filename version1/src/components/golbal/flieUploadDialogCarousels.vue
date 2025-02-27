<script setup>
import { ref, watch, watchEffect } from 'vue'
import { urlApi } from '@/api'  //---------------------- Import Api for Url *****

const props = defineProps({
  fileName: { type: String, required: true },
  filesFromAPI: { type: Array, default: () => [] },  // ใช้สำหรับรับไฟล์จาก API
  typeFileInput: { type: String, default: '' },
  typeBtn: { type: String, default: '' },
  titleDialog: { type: String, default: 'Dialog Title' },
  disabledProp: { type: Boolean, default: true },
})

const emit = defineEmits(['updateFiles']) // กำหนด event ชื่อ updateFiles

const files = ref([]) // เก็บข้อมูลไฟล์
const filesModel = ref([]) // เก็บข้อมูลไฟล์
const dialogVisible = ref(false) // สถานะเปิด/ปิด Dialog
const dialogInputVisible = ref(false) // สถานะเปิด/ปิด Dialog
const selectedIndex = ref(0) // ใช้กำหนด Index สำหรับ Carousel

const emitUpdateFiles = () => {
  emit('updateFiles', {
    name: props.fileName,
    files: files.value, // หรือข้อมูลไฟล์ที่ต้องการส่งออก
  })
}

watchEffect(() => {
  if(!filesModel.value || filesModel.value.length < 1){
    files.value = []
  }
  if(props.filesFromAPI){
    files.value = props.filesFromAPI
  }
})


// ฟังก์ชันจัดการการอัปโหลดไฟล์
const handleFileUpload = event => {
  console.log('Starting file upload')

  const uploadedFiles = Array.from(event.target.files)

  uploadedFiles.forEach(file => {
    const fileType = file.type.startsWith('image/') ? 'image' : 'pdf'
    const objectUrl = URL.createObjectURL(file) // สร้าง URL สำหรับ preview

    files.value.push({ file, objectUrl, type: fileType, name: file.name })
  })

  emitUpdateFiles() // ส่งข้อมูลไปยัง parent
  console.log('Finished file upload')
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

const openInputDialog = () => {
  dialogInputVisible.value = true
}

// ฟังก์ชันปิด Dialog
const closeInputDialog = () => {
  dialogInputVisible.value = false
}

// ฟังก์ชันลบไฟล์
const removeFile = index => {
  const file = files.value[index]

  URL.revokeObjectURL(file.objectUrl) // ล้าง Object URL เพื่อป้องกัน Memory Leak
  files.value.splice(index, 1)

  emitUpdateFiles() // อัปเดตข้อมูลไปยัง parent
}

const removeFileAll = index => {
  files.value = []

  emitUpdateFiles() // อัปเดตข้อมูลไปยัง parent
}

const testShowFIle = () => {
  console.log("File", files.value)
}


const checkColorBtnShowImage = (files, filesModel) => {
  if(files || filesModel){
    if(props.disabledProp){
      return 1
    }else{
      return 2
    }
  }else{
    if(props.disabledProp){
      return 0
    }else{
      return 3
    }
  }
}

const getIconType = (filesLength, filesModelLength) => {
  const status = checkColorBtnShowImage(filesLength, filesModelLength)
  if (status === 1) return 'ri-checkbox-circle-fill'
  if (status === 2) return 'mdi-camera'
  if (status === 3) return 'mdi-file-image'
  
  return 'ri-close-circle-fill' // Default icon
}

const getIconColor = (filesLength, filesModelLength) => {
  const status = checkColorBtnShowImage(filesLength, filesModelLength)
  if (status === 1) return 'teal-lighten-4'
  if (status === 2) return 'info'
  if (status === 3) return 'blue'
  
  return 'grey' // Default color
}

const getIconColorBtnInput = (filesLength, filesModelLength) => {
  const status = checkColorBtnShowImage(filesLength, filesModelLength)
  if (status === 1) return 'grey'
  if (status === 2) return 'info'
  if (status === 3) return 'blue'
  
  return 'grey' // Default color
}

const getVariantType = (filesLength, filesModelLength) => {
  const status = checkColorBtnShowImage(filesLength, filesModelLength)
  if (status === 1) return 'filled'
  if (status === 2) return 'outlined'
  if (status === 3) return 'outlined'
  
  return 'filled' // Default color
}
</script>

<template>
  <div>
    <VRow
      v-if="false"
      class="d-flex align-center"
    >
      <VCol
        class="px-2"
        cols="8"
      >
        <!-- อัปโหลดไฟล์ -->
        <VFileInput
          v-model="filesModel"
          multiple
          :variant="getVariantType(files.length, filesModel.length)"
          :disabled="disabledProp"
          accept="image/*,.pdf"
          density="compact"
          :color="disabledProp ? 'grey' : 'green'"
          :prepend-icon="getIconType(files.length, filesModel.length)"
          :prepend-icon-color="disabledProp ? 'red' : 'green'"
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
                v-if="false"
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
          :disabled="files.length < 1"
          class="d-flex justify-center"
          :color="getIconColor(files.length, filesModel.length)"
          style="max-width: 70px;"
          @click="openDialog"
        >
          <div><VIcon :icon="getIconType(files.length, filesModel.length)" /></div>
          <div v-if="files.length > 0 || filesModel.length">
            {{ files.length }}+
          </div>
        </VBtn>
      </VCol>
    </VRow>

    <VBtn v-if="false" @click="testShowFIle">
      asd
    </VBtn>

    <VRow
      v-if="true"
      class="d-flex align-center"
    >
      <VCol
        class="px-2"
        cols="12"
      >
        <VBtn
          :disabled="disabledProp"
          class="d-flex justify-center"
          :color="getIconColorBtnInput(files.length, filesModel.length)"
          style="width: 100%;"
          @click="openInputDialog"
        >
          <div><VIcon icon="ri-upload-2-fill" /></div>
        </VBtn>
      </VCol>
      <VCol
        class="d-flex align-center px-2"
        cols="6"
        v-if="false"
      >
        <!-- ปุ่มเปิด Carousel Dialog -->
        <VBtn
          :disabled="files.length < 1"
          class="d-flex justify-center"
          :color="getIconColor(files.length, filesModel.length)"
          style="width: 100%;"
          @click="openDialog"
        >
          <div><VIcon :icon="getIconType(files.length, filesModel.length)" /></div>
          <div v-if="files.length > 0 || filesModel.length">
            {{ files.length }}+
          </div>
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
              <VImg src="https://sktdevwebapi.easetrackwms.com/api/v1/ShippingForm/SO/256801/c4fcb5cd-f0cb-4c39-a693-99240209fc6f.jpg" />
              
              <div v-if="file.contentType === 'image/jpeg' || file.contentType === 'image/png'">
                <VImg :src="urlApi+file.fileUri" />
              </div>
              <VImg
                v-if="file.type === 'image'"
                :src="file.objectUrl"
              />
              

              <div v-else-if="file.contentType === 'image/png'">
                <VImg :src="file.fileUri" />
              </div>
              

              <div
                v-else-if="file.contentType === 'application/pdf'"
                class="d-flex justify-center align-center"
              >
                <iframe 
                  :src="'https://docs.google.com/viewer?url=' +file.fileUri + '&embedded=true'" 
                  type="application/pdf" 
                  style="width: 80%; height: 500px; border: none;"
                />
              </div>

              <div
                v-else-if="file.type === 'application/pdf'"
                class="d-flex justify-center align-center"
              >
                {{ file.objectUrl }}
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

    <!-- Dialog สำหรับ Input -->
    <VDialog
      v-model="dialogInputVisible"
      width="90%"
    >
      <!-- Dialog Content -->
      <VCard title="Privacy Policy">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="dialogInputVisible = false"
        />

        <VCardText>
          <VFileInput
            v-model="filesModel"
            multiple
            :variant="getVariantType(files.length, filesModel.length)"
            :disabled="disabledProp"
            accept="image/*,.pdf"
            density="compact"
            :color="disabledProp ? 'grey' : 'green'"
            :prepend-icon="getIconType(files.length, filesModel.length)"
            :prepend-icon-color="disabledProp ? 'red' : 'green'"
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
                  v-if="false"
                  class="text-overline text-grey-darken-3 mx-2"
                >
                  +{{ files.length - 1 }} File(s)
                </span>
              </template>
            </template>
          </VFileInput>
        </VCardText>

        <VCardText>
          <!-- Muti File Show Imge -->
          <VRow
            v-if="filesModel"
            class="my-4"
          >
            <VCol
              v-for="(file, fileIndex) in files"
              :key="fileIndex"
              cols="3"
              md="3"
              lg="3"
            >
              <VCard class="pa-2">
                <div v-if="file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'image/jpg'">
                  <VImg
                    height="125"
                    :src="urlApi+file.fileUri"
                  />
                  0
                </div>
                <div
                  v-if="file.type === 'image'"
                  class="text-end"
                >
                  <VImg
                    max-height="125"
                    :src="file.objectUrl"
                  />
                  <span class="text-green">New</span>
                </div>

                <div v-else-if="file.contentType === 'application/octet-stream'">
                  <VImg :src="file.fileUri" />
                  33
                </div>
                
                <div v-else-if="file.contentType === 'image/png'">
                  <VImg :src="file.fileUri" />
                </div>
                
  
                <div
                  v-else-if="file.contentType === 'application/pdf'"
                  class="d-flex justify-center align-center"
                >
                  <iframe 
                    :src="'https://docs.google.com/viewer?url=' +file.fileUri + '&embedded=true'" 
                    type="application/pdf" 
                    style="width: 80%; height: 500px; border: none;"
                  />
                  2
                </div>
  
                <div
                  v-else-if="file.type === 'application/pdf'"
                  class="d-flex justify-center align-center"
                >
                  {{ file.objectUrl }}
                  <iframe 
                    :src="file.objectUrl"
                    type="application/pdf"
                    style="width: 80%;"
                  />
                  3
                </div>

                <div
                  v-else-if="file.type === 'pdf'"
                  class="d-flex justify-center align-center"
                >
                  <iframe 
                    :src="file.objectUrl"
                    type="application/pdf"
                    style="width: 80%;"
                  />
                  4
                </div>

                <VCardText class="pa-2">
                  <div class="d-flex flex-column align-center text-center">
                    <span v-if="false">{{ file.fileName }}</span>
                    <VBtn
                      v-if="true"
                      class="mt-2"
                      icon="mdi-close"
                      color="error"
                      size="small"
                      variant="tonal"
                      @click="removeFile(fileIndex)"
                    />
                  </div>
                </VCardText>
              </VCard>
            </VCol>
            <VCol
              style="width: 100%;"
              cols="12"
            >
              <VBtn
                class="mx-2 mb-2"
                color="red"
                width="98%"
                @click="removeFileAll(fileIndex)"
              >
                Delete Image
              </VBtn>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
/* ปรับแต่ง Carousel หรือไฟล์แสดง */
</style>
