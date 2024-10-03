<script setup>
import shoes01 from "@images/topProductMove/shoes/shoes01.jpg"
import shoes02 from "@images/topProductMove/shoes/shoes02.jpg"
import shoes03 from "@images/topProductMove/shoes/shoes03.jpg"
import shoes04 from "@images/topProductMove/shoes/shoes04.jpg"
import shoes05 from "@images/topProductMove/shoes/shoes05.jpg"
import shoes06 from "@images/topProductMove/shoes/shoes06.jpg"
import shoes07 from "@images/topProductMove/shoes/shoes07.jpg"
import shoes08 from "@images/topProductMove/shoes/shoes08.jpg"
import shoes09 from "@images/topProductMove/shoes/shoes09.jpg"
import shoes010 from "@images/topProductMove/shoes/shoes010.jpg"

const imageShoes = [shoes01, shoes02, shoes03, shoes04, shoes05, shoes06, shoes07, shoes08, shoes09, shoes010]

//-------------------- Import Top Product Ladies ----------------------------
//*** Move */
import L01 from "@images/topProductMove/ladies/L01.webp"
import L02 from "@images/topProductMove/ladies/L02.jpg"
import L03 from "@images/topProductMove/ladies/L03.jpg"
import L04 from "@images/topProductMove/ladies/L04.jpg"
import L05 from "@images/topProductMove/ladies/L05.webp"
import L06 from "@images/topProductMove/ladies/L06.jpg"
import L07 from "@images/topProductMove/ladies/L07.jpg"
import L08 from "@images/topProductMove/ladies/L08.jpg"
import L09 from "@images/topProductMove/ladies/L09.webp"

const imageLs = [L01, L02, L03, L04, L05, L06, L07, L08, L09]

//-------------------- Import Top Product Gentlemen ----------------------------
//*** Move */
import genter01 from "@images/topProductMove/genter/genter01.webp"
import genter02 from "@images/topProductMove/genter/genter02.webp"
import genter03 from "@images/topProductMove/genter/genter03.webp"
import genter04 from "@images/topProductMove/genter/genter04.jpg"
import genter05 from "@images/topProductMove/genter/genter05.jpg"
import genter06 from "@images/topProductMove/genter/genter06.jpg"
import genter07 from "@images/topProductMove/genter/genter07.jpg"
import genter08 from "@images/topProductMove/genter/genter08.jpg"
import genter09 from "@images/topProductMove/genter/genter09.jpg"
import genter10 from "@images/topProductMove/genter/genter10.jpg"

const imageGentlemen = [genter01, genter02, genter03, genter04, genter05, genter06, genter07, genter08, genter09, genter10]

//-------------------- Import Top Product shirt ----------------------------
//*** Move */
import Shirt01 from "@images/topProductMove/shirt/Shirt01.jpg"
import Shirt02 from "@images/topProductMove/shirt/Shirt02.jpg"
import Shirt03 from "@images/topProductMove/shirt/Shirt03.jpg"
import Shirt04 from "@images/topProductMove/shirt/Shirt04.jpg"
import Shirt05 from "@images/topProductMove/shirt/Shirt05.jpg"
import Shirt06 from "@images/topProductMove/shirt/Shirt06.jpg"
import Shirt07 from "@images/topProductMove/shirt/Shirt07.jpg"
import Shirt08 from "@images/topProductMove/shirt/Shirt08.jpg"
import Shirt09 from "@images/topProductMove/shirt/Shirt09.jpg"
import Shirt10 from "@images/topProductMove/shirt/Shirt04.jpg"

const imageShirt = [Shirt01, Shirt02, Shirt03, Shirt04, Shirt05, Shirt06, Shirt07, Shirt08, Shirt09, Shirt10]

//-------------------- Import Top Product Drink ----------------------------
//*** Move */
import Drink01 from "@images/topProductMove/drink/d1.jpg"
import Drink02 from "@images/topProductMove/drink/d2.jpg"
import Drink03 from "@images/topProductMove/drink/d3.jpg"
import Drink04 from "@images/topProductMove/drink/d4.jpg"
import Drink05 from "@images/topProductMove/drink/d5.jpg"

const imageDrink = [Drink01, Drink02, Drink03, Drink04, Drink05]

import axiosIns from "@axios"

//// --------------------------------------------------------------------------------------
import { ref, watch } from "vue"

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from "@/api"
import index from "vue-prism-component"

const whereHouse = localStorage.getItem("whereHouseName")
const accessTokenAtStore = localStorage.getItem("accessTokenAtStore")

const whereHouseSelectedItem = ref(whereHouse)
const products = ref([])
const searchByCategoryId = ref("")

const GetStockUpdate = () => {
  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns
    .get(
      `${urlApi.value}/api/v1/Product/ProductList?page=1` + `&perPage=10`,
      {
        params: {
          categoryId: searchByCategoryId.value,

          // ... and so on with other parameters
        },
        headers: {
          accept: "*/*",
          "x-location": `${whereHouse}`,
          Authorization: `Bearer ${accessTokenAtStore}`,
        },
      },
      {},
    )
    .then(response => {
      products.value = response.data.items

      console.log("[products.value]!!: ", products)
    })
    .catch(error => {
      // Handle errors
      console.error("Error:", error)
    })
}

watch(GetStockUpdate)



const resolveChipColor = status => {
  if (status === "In Stock") return "success"
  if (status === "Out of Stock") return "primary"
  if (status === "Backordegreen") return "warning"
  if (status === "Reserved") return "warning"
  if (status === "Damaged") return "warning"
  if (status === "Discontinued") return "warning"
}

const itemsCategories = [
  {
    title: 'Shoes',
    value: 'Shoes',
  },
  {
    title: 'Female',
    value: 'Female',
  },
  {
    title: 'Male',
    value: 'Male',
  },
  {
    title: 'Shirt',
    value: 'Shirt',
  },
  {
    title: 'Beverage',
    value: 'Beverage',
  },
]

const categories = [
  {
    title: "Shoes",
    img: {
      icon: "mdi-shoe-sneaker",
    },
  },
  {
    title: "Female",
    img: {
      icon: "mdi-account-tie-woman",
    },
  },
  {
    title: "Male",
    img: {
      icon: "mdi-account-tie",
    },
  },
  {
    title: "Shirt",
    img: {
      icon: "mdi-tshirt-crew",
    },
  },
  {
    title: "Beverage",
    img: {
      icon: "ri-drinks-line",
    },
  },
]

const itemsCategoriesSelect = ref('')

function getRandomDate() {
  const start = new Date(2020, 0, 1) // 1st Jan 2020
  const end = new Date() // Current date
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  
  return randomDate.toISOString().split('T')[0] // Format: YYYY-MM-DD
}

// ฟังก์ชันเพื่อแปลงวันที่เป็นรูปแบบ "วว/ดด/ปปปป"
function formatDate(dateString) {
  const [year, month, day] = dateString.split('-')
  
  return `${day}/${month}/${year}`
}

const currentTab = ref("Shoes")

const handleSelectCategories = item => {
  console.log('handleSelectCategories', item.id)
  currentTab.value = item.id
}

const lengthData = (5)

const productData = ref({
  
  Shoes: Array.from({ length: lengthData }, (_, index) => ({
    no: index + 1,
    image: imageShoes[index],
    product: `Product ${index + 1}`+" "+`Shoes`+" "+`Color`+" "+'Sized'+" "+'Details',
    code: `Cd-${index + 1}`+Math.floor(Math.random() * 10000) + 100,
    status: index % 6 === 0 ? "คู่" : index % 6 === 1 ? "อัน" : index % 6 === 2 ? "ตัว" : index % 6 === 3 ? "ชิ้น" : index % 6 === 4 ? "แก้ว" : "โหล",
    price: Math.floor(Math.random() * 10000) + 100, // สุ่มราคาให้ตั้งแต่ 100 ถึง 10,100
    moveSummary: Math.floor(Math.random() * 50) + 1, // สุ่มจำนวนการเคลื่อนย้ายสินค้า
    lastUpdate: formatDate(getRandomDate()), // สุ่มวันที่ล่าสุด
  })),
  Female: Array.from({ length: lengthData }, (_, index) => ({
    no: index + 1,
    product: `Product ${index + 1}`+" "+` Female`+" "+` Color`+" "+' Sized'+" "+' Details',
    code: `Cd-${index + 1}`+Math.floor(Math.random() * 10000) + 100,
    status: index % 6 === 0 ? "คู่" : index % 6 === 1 ? "อัน" : index % 6 === 2 ? "ตัว" : index % 6 === 3 ? "ชิ้น" : index % 6 === 4 ? "แก้ว" : "โหล",
    price: Math.floor(Math.random() * 10000) + 100, // สุ่มราคาให้ตั้งแต่ 100 ถึง 10,100
    moveSummary: Math.floor(Math.random() * 50) + 1, // สุ่มจำนวนการเคลื่อนย้ายสินค้า
    lastUpdate: formatDate(getRandomDate()), // สุ่มวันที่ล่าสุด
    image: imageLs[index],
  })),
  Male: Array.from({ length: lengthData }, (_, index) => ({
    no: index + 1,
    product: `Product ${index + 1}`+" "+`Male`+" "+`Color`+" "+'Sized'+" "+'Details',
    code: `Cd-${index + 1}`+Math.floor(Math.random() * 10000) + 100,
    status: index % 6 === 0 ? "คู่" : index % 6 === 1 ? "อัน" : index % 6 === 2 ? "ตัว" : index % 6 === 3 ? "ชิ้น" : index % 6 === 4 ? "แก้ว" : "โหล",
    price: Math.floor(Math.random() * 10000) + 100, // สุ่มราคาให้ตั้งแต่ 100 ถึง 10,100
    moveSummary: Math.floor(Math.random() * 50) + 1, // สุ่มจำนวนการเคลื่อนย้ายสินค้า
    lastUpdate: formatDate(getRandomDate()), // สุ่มวันที่ล่าสุด
    image: imageGentlemen[index],
  })),
  Shirt: Array.from({ length: lengthData }, (_, index) => ({
    no: index + 1,
    product: `Product ${index + 1}`+" "+`Shirt`+" "+`Color`+" "+'Sized'+" "+'Details',
    code: `Cd-${index + 1}`+Math.floor(Math.random() * 10000) + 100,
    status: index % 6 === 0 ? "คู่" : index % 6 === 1 ? "อัน" : index % 6 === 2 ? "ตัว" : index % 6 === 3 ? "ชิ้น" : index % 6 === 4 ? "แก้ว" : "โหล",
    price: Math.floor(Math.random() * 10000) + 100, // สุ่มราคาให้ตั้งแต่ 100 ถึง 10,100
    moveSummary: Math.floor(Math.random() * 50) + 1, // สุ่มจำนวนการเคลื่อนย้ายสินค้า
    lastUpdate: formatDate(getRandomDate()), // สุ่มวันที่ล่าสุด
    image: imageShirt[index],
  })),
  Beverage: Array.from({ length: lengthData }, (_, index) => ({
    no: index + 1,
    product: `Product ${index + 1}`+" "+`Beverage`+" "+`color`+" "+'sized'+" "+'details',
    code: `Cd-${index + 1}`+Math.floor(Math.random() * 10000) + 100,
    status: index % 6 === 0 ? "คู่" : index % 6 === 1 ? "Backordered" : index % 6 === 2 ? "Reserved" : index % 6 === 3 ? "Damaged" : index % 6 === 4 ? "Discontinued" : "In Stock",
    price: Math.floor(Math.random() * 10000) + 100, // สุ่มราคาให้ตั้งแต่ 100 ถึง 10,100
    moveSummary: Math.floor(Math.random() * 50) + 1, // สุ่มจำนวนการเคลื่อนย้ายสินค้า
    lastUpdate: formatDate(getRandomDate()), // สุ่มวันที่ล่าสุด
    image: imageDrink[index],
  })),
})

const headers = [
  {
    title: 'NO.',
    sortable: false,
    key: 'no',
  },
  {
    title: 'IMAGE',
    key: 'image',
  },
  {
    title: 'PRODUCT NAME',
    key: 'product',
  },
  {
    title: 'STATUS',
    key: 'status',
  },
  {
    title: 'PRICE',
    key: 'price',
  },
  {
    title: 'MOVE SUMMARY',
    key: 'moveSummary',
  },
  {
    title: 'LAST UPDATE',
    key: 'lastUpdate',
  },
]

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

const itemsCat = [
  {
    title: "Clothing",
    value: "Clothing",
  },
  {
    title: "Shirt",
    value: "Shirt",
  },
  {
    title: "Pants",
    value: "Pants",
  },
  {
    title: "Shoes",
    value: "Shoes",
  },
  {
    title: "Jewellery",
    value: "Jewellery",
  },
  {
    title: "Accessories",
    value: "Accessories",
  },
]

const itemsCatIcon = [
  {
    title: "Clothing",
    value: "mdi-hanger",
  },
  {
    title: "Shirt",
    value: "mdi-tshirt-v",
  },
  {
    title: "Pants",
    value: "mdi-lingerie",
  },
  {
    title: "Shoes",
    value: "mdi-shoe-sneaker",
  },
  {
    title: "Jewellery",
    value: "mdi-ring",
  },
  {
    title: "Accessories",
    value: "mdi-cards-playing-diamond-outline",
  },
]

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
          <VCardText class="py-1 bg-green-lighten-1">
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
                <div v-if="false">
                  <VSlideGroup
                    v-model="currentTab"
                    show-arrows
                    mandatory
                  >
                    <VSlideGroupItem
                      v-for="category in categories"
                      :key="category.title"
                      v-slot="{ isSelected, toggle }"
                      :value="category.title"
                    >
                      <div
                        :class="
                          isSelected ? 'selected-category' : 'not-selected-category'
                        "
                        class="d-flex flex-column justify-center align-center cursor-pointer rounded me-2"
                        style="border-color: #ffff; block-size: 2rem; inline-size: 2rem;"
                        @click="toggle"
                      >
                        <VIcon
                          v-bind="category.img"
                          alt="slide-img"
                          size="20px"
                          color="white"
                        />
                        <VTooltip
                          activator="parent"
                          location="top"
                        >
                          {{ category.title }}
                        </VTooltip>
                      </div>
                    </VSlideGroupItem>

                    <VSlideGroupItem>
                      <div
                        class="d-flex flex-column justify-center align-center cursor-pointer rounded me-4 not-selected-category"
                        style="border-color: #ffff; block-size: 2rem; inline-size: 2rem;"
                        @click="isDialogAddCatPoVisible = true"
                      >
                        <VAvatar
                          rounded
                          size="20px"
                          color="white"
                          variant="tonal"
                          class="text-disabled"
                        >
                          <VIcon icon="mdi-plus" />
                        </VAvatar>
                      </div>
                    </VSlideGroupItem>
                  </VSlideGroup>
                </div>

                <div>
                  <VMenu location="bottom">
                    <template #activator="{ props }">
                      <VBtn
                        density="compact"
                        v-bind="props"
                      >
                        {{ currentTab }}
                      </VBtn>
                    </template>

                    <VList :items="itemsCategories" @click:select="handleSelectCategories" />
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
                  v-for="(currentProduct, index) in productData[currentTab]"
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
                    {{ currentProduct.code }}
                  </td>
                  <td
                    class="font-weight-medium"
                    style="inline-size: 20vw;"
                  >
                    {{ currentProduct.product }}
                  </td>

                  <td class="text-end font-weight-medium">
                    {{ currentProduct.moveSummary }}
                  </td>

                  <td class="text-end font-weight-medium">
                    {{ currentProduct.status }}
                  </td>

                  <td class="font-weight-medium text-end">
                    <span>
                      {{
                        currentProduct.lastUpdate
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
              <VCardTitle>{{ $t("Add Categories Product") }}</VCardTitle>

              <VCardText>
                <VRow>
                  <VCol cols="12">
                    <VSelect
                      v-model="ModelCatAdd"
                      label="Categories"
                      :items="itemsCat"
                    />
                  </VCol>
                  <VCol cols="12">
                    <VSelect
                      v-model="ModelCatIconAdd"
                      chips
                      closable-chips
                      single
                      :items="itemsCatIcon"
                      placeholder="Select Icon for category"
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
              <VCardTitle class="d-flex justify-end bg-green-lighten-1">
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

              <VCardActions class="d-flex justify-center bg-green-lighten-2">
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

                  <VCardText class="bg-green-lighten-4">
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
