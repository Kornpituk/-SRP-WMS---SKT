<script setup>
import urlImageTh from '@images/avatars/avatar-1.png'
import urlImageAddRole from '@images/pages/addRole.png'

import axiosIns from '@axios'

import SecuritySetUser from '@/views/setPermission/defineUser/setUser/AuthorizationSetUser/Authorization.vue'
import AccountSetUser from '@/views/setPermission/defineUser/setUser/SecuritySetUser/Security.vue'

//// --------------------------------------------------------------------------------------
import { ref } from 'vue'

const route = useRoute()

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from '@/api'

import ImageApi from '@images/avatars/avatar-1.png'

const whereHouse = localStorage.getItem('whereHouseName')
const whereHouseSelectedItem = ref(whereHouse)
const section = ref([])

const employeeCode = ref(route.query.EmpCode)
const roleEmp = ref(route.query.EmpRole)
const uerNameEmp = ref(route.query.EmpUerName)
const EmpTitleName = ref(route.query.EmpTitleName)
const phoneNumberEmp = ref(route.query.productId)
const departmentEmp = ref(route.query.EmpDepart)
const sectionEmp = ref(route.query.EmpSection)
const divisionEmp = ref(route.query.EmpDivision)
const positionEmp = ref(route.query.EmpPosition)
const emailEmp = ref(route.query.EmpEmail)

//---------------------------- Tabs ------------------------------------
const activeTab = ref('tab-1')
const tabItemText = 'Biscuit cheesecake gingerbread oat cake tiramisu. Marzipan tiramisu jelly-o muffin biscuit jelly cake pie. Chocolate cookie candy croissant brownie cupcake powder cheesecake. Biscuit sesame snaps biscuit topping tiramisu croissant.'

const activeComponent = () => {
  return this.components[this.activeTab]
}

const components = ref({
  'tab-1': SecuritySetUser, // กำหนดค่าเริ่มต้นของแต่ละแท็บ
  'tab-2': AccountSetUser,
})


//------------------------- Dialog----------------------
const isDetailsEmpDialogVisible = ref(false)
</script>

<template>
  <!-- ----------------        Label Page | Back           ------------------------------------ -->
  <section>
    <!-- Tag page back -->
    <VRow>
      <VCol
        col="12"
        sm="4"
        md="4"
        lg="4"
      >
        <RouterLink :to="{ name: 'setPermission-defineUser-user' }">
          <IconBtn>
            <VIcon
              icon="
                mdi-chevron-left"
            />
          </IconBtn>
        </RouterLink>
        {{ $t("Set Permissions / Set User") }}
      </VCol>
    </VRow>
  </section>

  <!-- Dialog -->
  <section>
    <VDialog
      v-model="isDetailsEmpDialogVisible"
      max-width="600"
    >
      <!-- Dialog Content -->
      <VCard class="pa-4">
        <DialogCloseBtn
          variant="text"
          size="small"
          @click="isDetailsEmpDialogVisible = false"
        />

        <VCardTitle class="d-flex justify-center">
          {{ $t('Edit User Data') }}
        </VCardTitle>

        <VCardText>
          <VRow>
            <!-- employeeCode -->
            <VCol
              cols="12"
              lg="12"
              sm="6"
              md="4"
            >
              <VTextField
                v-model="employeeCode"
                :label="$t('Employee Code')"
                placeholder="0000"
              >
                <template #append-inner>
                  <VIcon
                    color="primary"
                    size="30"
                    icon="mdi-magnify"
                  />
                </template>
              </VTextField>
            </VCol>
            <!-- EmpTitleName -->
            <VCol
              cols="12"
              lg="6"
              sm="6"
              md="4"
            >
              <VTextField
                v-model="EmpTitleName"
                :label="$t('Title Name')"
                placeholder="peter"
              />
            </VCol>
            <!-- uerNameEmp -->
            <VCol
              cols="12"
              lg="6"
              sm="6"
              md="4"
            >
              <VTextField
                v-model="uerNameEmp"
                :label="$t('Name')"
                persistent-hint
                placeholder="Doe"
              />
            </VCol>
            <!-- phoneNumberEmp -->
            <VCol
              lg="6"
              cols="12"
            >
              <VTextField
                v-model="phoneNumberEmp"
                :label="$t('Phone Number')"
              />
            </VCol>
            <!-- emailEmp -->
            <VCol
              lg="6"
              cols="12"
            >
              <VTextField
                v-model="emailEmp"
                :label="$t('Email')"
              />
            </VCol>
            <!-- departmentEmp -->
            <VCol
              cols="12"
              sm="6"
              lg="6"
            >
              <VTextField
                v-model="departmentEmp"
                :label="$t('Department')"
              />
            </VCol>
            <!-- sectionEmp -->
            <VCol
              cols="12"
              sm="6"
              lg="6"
            >
              <VTextField
                v-model="sectionEmp"
                :label="$t('Section')"
              />
            </VCol>
            <!-- divisionEmp -->
            <VCol
              cols="12"
              sm="6"
              lg="6"
            >
              <VTextField
                v-model="divisionEmp"
                :label="$t('Division')"
              />
            </VCol>
            <!-- positionEmp -->
            <VCol
              cols="12"
              sm="6"
              lg="6"
            >
              <VTextField
                v-model="positionEmp"
                :label="$t('Position')"
              />
            </VCol>
            <!-- uerNameEmp -->
            <VCol
              cols="12"
              sm="6"
              lg="6"
            >
              <VTextField
                v-model="uerNameEmp"
                :label="$t('User Name')"
              />
            </VCol>
            <!-- roleEmp -->
            <VCol
              cols="12"
              sm="6"
              lg="6"
            >
              <VSelect v-model="roleEmp" :label="$t('Role')" :items="roleEmps">
              </VSelect>
            </VCol>
          </VRow>
        </VCardText>

        <VCardActions>
          <VRow>
            <VCol
              cols="6"
              class="d-flex justify-end"
            >
              <VBtn
                variant="flat"
                color="success"
                @click="isDetailsEmpDialogVisible = false"
              >
                Save
              </VBtn>
            </VCol>
            <VCol cols="6">
              <VBtn
                variant="outlined"
                color="error"
                @click="isDetailsEmpDialogVisible = false"
              >
                Close
              </VBtn>
            </VCol>
          </VRow>
        </VCardActions>
      </VCard>
    </VDialog>
  </section>
  
  <!-- Card Search -->
  <section>
    <VRow>
      <!-- USer Details -->
      <VCol cols="12" lg="3">
        <VCard>
          <div>
            <div class="d-flex justify-center mt-4">
              <VAvatar size="150px">
                <Img :src="ImageApi" />
              </VAvatar>
            </div>
            <br>
            <div class="d-flex justify-center">
              <span>{{ uerNameEmp }}</span>
            </div>
            <br>
            <div class="d-flex justify-center">
              <VChip color="error">
                {{ roleEmp }}
              </VChip>
            </div>
          </div>
          
          <VCardTitle>{{ $t('Detail') }}</VCardTitle>
          <div class="d-flex justify-center">
            <VDivider length="95%" />
          </div>
          <VCardText>
            <VRow>
              <VCol cols="12">
                <span style="font-weight: bold;">{{ $t('Employee Code') }}:</span><span>{{ employeeCode }}</span>
              </VCol>
              <VCol cols="12">
                <span style="font-weight: bold;">{{ $t('Role') }}:</span><span>{{ roleEmp }}</span>
              </VCol>
              <VCol cols="12">
                <span style="font-weight: bold;">{{ $t('Uername') }}:</span><span>{{ uerNameEmp }}</span>
              </VCol>
              <VCol cols="12">
                <span style="font-weight: bold;">{{ $t('Email') }}:</span><span>{{ emailEmp }}</span>
              </VCol>
              <VCol cols="12">
                <span style="font-weight: bold;">{{ $t('Phone Number') }}:</span><span>{{ phoneNumberEmp }}</span>
              </VCol>
              <VCol cols="12">
                <span style="font-weight: bold;">{{ $t('Department') }}:</span><span>{{ departmentEmp }}</span>
              </VCol>
              <VCol cols="12">
                <span style="font-weight: bold;">{{ $t('Section') }}:</span><span>{{ sectionEmp }}</span>
              </VCol>
              <VCol cols="12">
                <span style="font-weight: bold;">{{ $t('Division') }}:</span><span>{{ divisionEmp }}</span>
              </VCol>
              <VCol cols="12">
                <span style="font-weight: bold;">{{ $t('Position') }}:</span><span>{{ positionEmp }}</span>
              </VCol>
            </VRow>
          </VCardText>
          <VCardActions>
            <VRow>
              <VCol
                cols="6"
                class="d-flex justify-end"
              >
                <VBtn
                  variant="flat"
                  @click="isDetailsEmpDialogVisible = true"
                >
                  {{ $t('Edit') }}
                </VBtn>
              </VCol>
              <VCol cols="6">
                <VBtn
                  color="red"
                  variant="outlined"
                >
                  {{ $t('Cancel') }}
                </VBtn>
              </VCol>
            </VRow>
          </VCardActions>
        </VCard>
      </VCol>
      <!-- USer Security / Auth -->
      <VCol cols="12" lg="9">
        <VTabs
          v-model="activeTab"
          grow
        >
          <VTab value="tab-2">
            <VIcon
              icon="mdi-lock-outline"
              class="mb-2"
              start
            />
            <span>{{ $t('Security') }}</span>
          </VTab>

          <VTab value="tab-1">
            <VIcon
              icon="mdi-bell-ring-outline"
              class="mb-2"
              start
            />
            <span>{{ $t('Authorization To Use') }}</span>
          </VTab>
        </VTabs>
        <VWindow
          v-model="activeTab"
          class="mt-5"
          :touch="false"
        >
          <!-- Security -->
          <VWindowItem value="tab-1">
            <SecuritySetUser />
          </VWindowItem>
          

          <!-- Authorization -->
          <VWindowItem value="tab-2">
            <AccountSetUser />
          </VWindowItem>
        </VWindow>
      </VCol>
    </VRow>
  </section>
</template>
