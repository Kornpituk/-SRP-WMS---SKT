<script setup>
import { format } from 'date-fns'

const props = defineProps({
  groupedItems: {
    type: Array,
    default: () => [],
  },
})

//----------------

import axiosIns from "@axios"

//// --------------------------------------------------------------------------------------
import { ref, watch } from "vue"

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from "@/api"
import index from "vue-prism-component"

const whereHouse = localStorage.getItem("whereHouseName")

const filteredProducts = computed(() => {
  if (!props.groupedItems || props.groupedItems.length === 0) return []
  
  const selectedCategory = props.groupedItems.find(
    group => group.categoryName === currentTab.value,
  ) || props.groupedItems[0]
  
  return selectedCategory?.items?.map(item => ({ ...item })) || []
})

// สร้าง itemsCategories จากข้อมูล groupedItems ที่ส่งเข้ามา
const itemsCategories = computed(() => {
  return props.groupedItems.map(group => ({
    title: group.categoryName,
    value: group.categoryName,

    // สามารถเพิ่ม field อื่นๆ ตามต้องการ
  }))
})

const currentTab = ref(
  itemsCategories.value[0]?.value || 
  (props.groupedItems[0]?.categoryName || ''),
)


const formattedDate = date => {
  return format(new Date(date), 'dd/MM/yyyy')
}

const lengthData = (5)

const handleSelectCategories = item => {
  currentTab.value = item.id
}



//------------------ Dialog details ---------------------------------
const dialogDetails = ref(false)

const show = ref(false)

const nameProduct = ref("")
const imgProduct = ref("")
const statusProduct = ref("")
const piceProduct = ref("")
const summaryProduct = ref("")

const showDetailsProduct = (name, img, status, pice, summary) => {
  nameProduct.value = name
  imgProduct.value = img
  statusProduct.value = status
  piceProduct.value = pice
  summaryProduct.value = summary
  dialogDetails.value = true
}

//------------------ Btn Add Cat Po ---------------------------
const isDialogAddCatPoVisible = ref(false)

const ModelCatAdd = ref([])
const ModelCatIconAdd = ref([])


const addPoCat = (title, icon) => {
  categories.push({
    title: title,
    img: {
      icon: icon,
    },
  })
  console.log("Add Cat Stat")
  console.log("title", title, "icon", icon)
  console.log("icon", icon)
  console.log("categories", categories)
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <div>
        <VCard>
          <VCardText class="py-1 bg-red-lighten-2">
            <VRow>
              <VCol
                cols="12"
                lg="2"
                class="px-0"
              >
                <div class="d-flex justify-center align-center">
                  <span
                    style="font-size: 16px;"
                    class="text-white mt-1"
                  >
                    {{ $t('Categories') }}
                  </span>
                </div>
              </VCol>
              <VCol
                cols="12"
                lg="10"
                class="px-0"
              >
                <div>
                  <VMenu location="bottom">
                    <template #activator="{ props }">
                      <VBtn
                        density="compact"
                        v-bind="props"
                        color="red"
                      >
                        {{ currentTab }}
                      </VBtn>
                    </template>

                    <VList
                      :items="itemsCategories"
                      @click:select="handleSelectCategories"
                    />
                  </VMenu>
                </div>
              </VCol>
            </VRow>
          </VCardText>

          <!-- Table -->
          <VCardText class="py-0">
            <VTable
              density="compact"
              class="text-no-wrap mb-5 text-sm"
            >
              <thead class="">
                <tr>
                  <th
                    scope="col"
                    style="padding-inline: 1px;"
                  >
                    {{ $t('No.') }}
                  </th>
                  <th
                    scope="col"
                    style="padding-inline: 1px;"
                    class=" text-center"
                  >
                    {{ $t('IMAGE') }}
                  </th>
                  <th scope="col">
                    {{ $t('PRODUCT CODE') }}
                  </th>
                  <th scope="col">
                    {{ $t('PRODUCT NAME') }}
                  </th>
                  <th
                    scope="col"
                    class="text-end"
                  >
                    {{ $t('QTY.') }}
                  </th>
                  <th
                    scope="col"
                    class="text-end"
                  >
                    {{ $t('UoM') }}
                  </th>
                  <th
                    scope="col"
                    class="text-end"
                  >
                    {{ $t('LAST UPDATE') }}
                  </th>
                </tr>
              </thead>

              <tbody class="text-high-emphasis ">
                <tr
                  v-for="(currentProduct, index) in filteredProducts"
                  :key="index"
                >
                  <td style="padding-inline: 1px;">
                    {{ index + 1 }}
                  </td>
                  <td
                    class="cursor-pointer"
                    style="padding-inline: 1px;"
                    @click="
                      showDetailsProduct(
                        currentProduct.product,
                        currentProduct.image,
                        currentProduct.status,
                        currentProduct.price,
                        currentProduct.moveSummary,
                      )
                    "
                  >
                    <VBtn
                      color="green"
                      variant="tonal"
                    >
                      <VAvatar
                        rounded
                        :image="currentProduct.image"
                        size="34"
                      />
                    </VBtn>
                  </td>

                  <td
                    class="font-weight-medium"
                    style="inline-size: 20vw;"
                  >
                    {{ currentProduct.productId }}
                  </td>
                  <td
                    class="font-weight-medium"
                    style="inline-size: 20vw;"
                  >
                    {{ currentProduct.productName }}
                  </td>

                  <td class="text-end font-weight-medium">
                    {{ currentProduct.qty }}
                  </td>

                  <td class="text-end font-weight-medium">
                    {{ currentProduct.unitName }}
                  </td>

                  <td class="font-weight-medium text-end">
                    <span>
                      {{
                        formattedDate(currentProduct.lastUpdate)
                      }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </VTable>
          </VCardText>
        </VCard>

        <!-- Btn Add Cat Product -->
        <section>
          <VDialog
            v-model="isDialogAddCatPoVisible"
            width="500"
          >
            <!-- Dialog Content -->
            <VCard>
              <DialogCloseBtn
                variant="text"
                size="small"
                @click="isDialogAddCatPoVisible = false"
              />
              <VCardTitle>{{ $t("Add Category Product") }}</VCardTitle>

              <VCardText>
                <VRow>
                  <VCol cols="12">
                    <VSelect
                      v-model="ModelCatAdd"
                      label="Category"
                      :items="itemsCat"
                    />
                  </VCol>
                  <VCol cols="12">
                    <VSelect
                      v-model="ModelCatIconAdd"
                      chips
                      closable-chips
                      :items="itemsCatIcon"
                      item-title="title"
                      item-value="value"
                      placeholder="Select Icon"
                      label="Icon"
                    >
                      <template #chip="{ props, item }">
                        <VChip
                          v-bind="props"
                          :prepend-icon="item.raw.value"
                          :text="item.raw.title"
                        />
                      </template>

                      <template #item="{ props, item }">
                        <VListItem
                          v-bind="props"
                          :prepend-icon="item?.raw?.value"
                          :title="item?.raw?.title"
                        />
                      </template>
                    </VSelect>
                  </VCol>
                </VRow>
              </VCardText>

              <VCardActions>
                <VSpacer />
                <VBtn @click="addPoCat(ModelCatAdd, ModelCatIconAdd)">
                  add
                </VBtn>
              </VCardActions>
            </VCard>
          </VDialog>
        </section>

        <!-- Details Image Product -->
        <section>
          <VDialog
            v-model="dialogDetails"
            width="500"
          >
            <!-- Dialog Content -->
            <VCard>
              <VCardTitle class="d-flex justify-end bg-red-lighten-1">
                <div>
                  <IconBtn
                    variant="flat"
                    @click="dialogDetails = false"
                  >
                    <VIcon
                      color="#000000"
                      icon="ri-close-fill"
                    />
                  </IconBtn>
                </div>
              </VCardTitle>
              

              <VImg
                height="100%"
                :src="imgProduct"
                cover
              />

              <VCardActions class="d-flex justify-center bg-red-lighten-1">
                <VBtn @click="show = !show">
                  <VIcon
                    size="40px"
                    color="white"
                    :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                  />
                </VBtn>
              </VCardActions>

              <VExpandTransition>
                <div v-show="show">
                  <VDivider />

                  <VCardText class="bg-red-lighten-4">
                    <div>
                      <span style="font-size: large; font-weight: 900;">{{
                        $t("Name :")
                      }}</span>{{ nameProduct }}<br>
                      <span style="font-size: large; font-weight: 900;">{{
                        $t("Price :")
                      }}</span>{{ piceProduct }}฿<br>
                      <span style="font-size: large; font-weight: 900;">{{
                        $t("QTY. :")
                      }}</span>{{ summaryProduct }}<br>
                      <span style="font-size: large; font-weight: 900;">{{
                        $t("Details :")
                      }}</span>
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                      Quo dolore reprehenderit, doloribus nesciunt, ullam
                      quisquam, nam ipsum itaque delectus inventore et natus
                      odit alias ipsam magnam consequatur sed! Sequi, provident?
                    </div>
                  </VCardText>
                </div>
              </VExpandTransition>
            </VCard>
          </VDialog>
        </section>
      </div>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.card-list {
  color: aliceblue;
}

.selected-category {
  border: 2px solid rgb(var(--v-theme-primary));
}

.not-selected-category {
  border: 2px dashed rgba(var(--v-border-color), var(--v-border-opacity));
}

.v-table .v-table__wrapper > table > tbody > tr:not(:last-child) > td {
  border-block-end: none;
}
</style>
