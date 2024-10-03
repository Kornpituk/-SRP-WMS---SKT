<script setup>
import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
import eCommerce2 from '@images/eCommerce/2.png'
import pages1 from '@images/pages/1.png'
import pages2 from '@images/pages/2.png'
import pages3 from '@images/pages/3.png'
import pages5 from '@images/pages/5.jpg'
import pages6 from '@images/pages/6.png'

const avatars = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
]

const isCardDetailsVisible = ref(false)

const avatar = ref(localStorage.getItem('accountImageAvatar'))

const accountData = {
  avatarImg: avatar,
  firstName: 'john',
  lastName: 'Doe',
  email: 'johnDoe@example.com',
  org: 'Pixinvent',
  phone: '+1 (917) 543-9876',
  address: '123 Main St, New York, NY 10001',
  state: 'New York',
  zip: '10001',
  country: 'USA',
  language: 'English',
  timezone: '(GMT-11:00) International Date Line West',
  currency: 'USD',
}

const refInputEl = ref()
const isConfirmDialogOpen = ref(false)
const accountDataLocal = ref(structuredClone(accountData))
const isAccountDeactivated = ref(false)
const validateAccountDeactivation = [v => !!v || 'Please confirm account deactivation']

const resetForm = () => {
  accountDataLocal.value = structuredClone(accountData)
}

const checkAvatarChange = ref('false')

const changeAvatar = file => {
  const fileReader = new FileReader()
  const { files } = file.target
  if (files && files.length) {
    fileReader.readAsDataURL(files[0])
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string'){
        accountDataLocal.value.avatarImg = fileReader.result
        localStorage.setItem('accountImageAvatar', accountDataLocal.value.avatarImg)
        avatar.value = localStorage.getItem('accountImageAvatar')
        checkAvatarChange.value = 'true'
      }
        
    }
  }
}

watchEffect(() => {
  // console.log('accountImageAvatar:', localStorage.getItem('accountImageAvatar'))
})

avatar.value = localStorage.getItem('accountImageAvatar')

const submitSettingsAccount = () => {
  console.log('Form is working!')
  if (checkAvatarChange) {
    
    console.log('Avatar has changed!')
  } else {
    console.log('Avatar has not changed.')
  }
  
}

// reset avatar image
const resetAvatar = () => {
  accountDataLocal.value.avatarImg = accountData.avatarImg
  avatar.value = accountData.avatarImg
  localStorage.removeItem('accountImageAvatar')

}

//--------------------------- Img Dialog ----------------------------------------
const isImgDialogVisible = ref(false)

//-------------------------- Change Password--------------------
const show1 = ref(false)
const show2 = ref(true)
const password = ref('Password')
const repeatPassword = ref('RepeatPassword')
const confirmPassword = ref('wqfasds')

const route = useRoute()

const rules = {
  required: value => !!value || 'Required.',
  min: v => v.length >= 8 || 'Min 8 characters',
}
</script>

<template>
  <!-- ----------------        Label Page | Back           ------------------------------------ -->
  <section>
    <!-- Tag page back -->
    <div>
      <VCard
        height="45px"
        class="bg-primary"
      >
        <VCardTitle class="pa-1">
          <div class="d-flex justify-start align-center">
            <IconBtn
              class="cursor-pointer"
              color="#FFFFFF"
              :to="{ name: 'dashboards-main',
              }"
            >
              <VIcon
                size="30"
                icon="ri-close-circle-fill"
              />
            </IconBtn>
            <h4 class="text-white">
              {{ $t('Profile') }}
            </h4>
          </div>
        </VCardTitle>
      </VCard>
    </div>
  </section>

  <!-- Dialog Img -->
  <section>
    <VDialog
      v-model="isImgDialogVisible"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard>
        <DialogCloseBtn
          variant="text"
          size="small"
          @click="isImgDialogVisible = false"
        />

        <VCardTitle>{{ $t('Profile Image') }}</VCardTitle>

        <VCardText class="d-flex justify-center">
          <VImg
            :src="avatar"
            height="auto"
            width="auto"
            cover
          />
        </VCardText>
      </VCard>
    </VDialog>
  </section>

  <section class="my-4">
    <VRow>
      <VCol cols="12">
        <VCard>
          <!-- Img Avatar / Banner -->
          <VCardText>
            <!-- 👉 Robert Meyer -->
            <VCol
              cols="12"
              sm="12"
              md="12"
            >
              <VCard>
                <!-- Banner -->
                <VImg
                  :src="pages2"
                  height="250"
                  cover
                />

                <VCardText class="position-relative pa-1 px-2">
                  <VRow>
                    <VCol
                      cols="12"
                      lg="2"
                    >
                      <!-- User Avatar -->
                      <VAvatar
                        class="avatar-center"
                        size="150"
                      >
                        <VBtn
                          size="150"
                          @click="isImgDialogVisible = true"
                        >
                          <VImg
                            :src="avatar"
                            height="150"
                            width="150"
                            cover
                          />
                        </VBtn>
                      </VAvatar>
                    </VCol>
                    <VCol
                      cols="12"
                      lg="7"
                      class="mt-lg-0 mt-16"
                    >
                      <!-- Title, Subtitle & Action Button -->
                      <div class="d-flex justify-space-between align-center flex-wrap mt-6 mb-6">
                        <VRow>
                          <VCol
                            cols="12"
                            lg="12"
                          >
                            <VCardTitle class="pa-0">
                              Bot001  Bot001
                            </VCardTitle>
                          </VCol>
                          <VCol
                            cols="12"
                            lg="12"
                          >
                            <div class="me-2 mb-2">
                              <VCardSubtitle class="text-h6 pa-0 d-flex align-center">
                                <VRow>
                                  <VCol
                                    cols="12"
                                    lg="2"
                                    class="d-flex align-center"
                                  >
                                    <VIcon icon="mdi-account-circle" /><span>Admin&nbsp;&nbsp;</span>
                                  </VCol>
                                  <VCol
                                    cols="12"
                                    lg="3"
                                    class="d-flex align-center"
                                  >
                                    <span>{{ $t('Department') }}: {{ $t('Sales') }}&nbsp;&nbsp;</span>
                                  </VCol>
                                  <VCol
                                    cols="12"
                                    lg="4"
                                    class="d-flex align-center"
                                  >
                                    <VIcon icon="mdi-check" /><span>{{ $t('Status') }}:</span><VChip color="success">
                                      Active
                                    </VChip>
                                  </VCol>
                                </VRow>
                              </VCardSubtitle>
                            </div>
                          </VCol>
                        </VRow>
                      </div>
                    </VCol>
                    <VCol
                      cols="12"
                      lg="3"
                      class="d-flex justify-end"
                    >
                      <!-- 👉 Upload Photo -->
                      <form
                        ref="refForm"
                        class="d-flex flex-column justify-center gap-3"
                      >
                        <div class="d-flex flex-wrap gap-4">
                          <VBtn
                            color="primary"
                            @click="refInputEl?.click()"
                          >
                            <VIcon
                              icon="mdi-cloud-upload-outline"
                              class="d-sm-none"
                            />
                            <span class="d-none d-sm-block">Upload new photo</span>
                          </VBtn>

                          <input
                            ref="refInputEl"
                            type="file"
                            name="file"
                            accept=".jpeg,.png,.jpg,GIF"
                            hidden
                            @input="changeAvatar"
                          >

                          <VBtn
                            type="reset"
                            color="error"
                            variant="tonal"
                            @click="resetAvatar"
                          >
                            <span class="d-none d-sm-block">Reset</span>
                            <VIcon
                              icon="mdi-refresh"
                              class="d-sm-none"
                            />
                          </VBtn>
                        </div>

                        <p class="mb-0">
                          Allowed JPG, GIF or PNG. Max size of 800K
                        </p>
                      </form>
                    </VCol>
                  </VRow>
                </VCardText>
              </VCard>
            </VCol>
          </VCardText>

          <!-- Details  -->
          <VCardText>
            <VRow>
              <!-- Details -->
              <VCol
                cols="12"
                lg="3"
              >
                <VCard>
                  <VCardTitle>{{ $t('Detail') }}</VCardTitle>
                  <!-- About -->
                  <VCardText>
                    <VCardSubtitle>{{ $t('About') }}</VCardSubtitle>
                    <div class="d-flex align-center">
                      <VIcon icon="mdi-account-circle" />&nbsp;<span style="font-weight: bold;">{{ $t('Employee Code') }}:&nbsp;</span><span>1213151&nbsp;&nbsp;</span>
                    </div>
                    <div class="d-flex align-center">
                      <VIcon icon="mdi-star-outline" />&nbsp;<span style="font-weight: bold;">{{ $t('Role') }}:&nbsp;</span><span>Admin&nbsp;&nbsp;</span>
                    </div>
                    <div class="d-flex align-center">
                      <VIcon icon="mdi-account" />&nbsp;<span style="font-weight: bold;">{{ $t('Username') }}:&nbsp;</span><span>Bot0001&nbsp;&nbsp;</span>
                    </div>
                    <div class="d-flex align-center">
                      <VIcon icon="mdi-check" />&nbsp;<span style="font-weight: bold;">{{ $t('Status') }}:&nbsp;</span><span><VChip color="success">{{ $t('Active') }}</VChip>&nbsp;&nbsp;</span>
                    </div>
                  </VCardText>

                  <!-- Contract -->
                  <VCardText>
                    <VCardSubtitle>{{ $t('Contact') }}</VCardSubtitle>
                    <div class="d-flex align-center">
                      <VIcon icon="mdi-account-circle" />&nbsp;<span style="font-weight: bold;">{{ $t('Employee Code') }}:&nbsp;</span><span>1213151&nbsp;&nbsp;</span>
                    </div>
                    <div class="d-flex align-center">
                      <VIcon icon="mdi-star-outline" />&nbsp;<span style="font-weight: bold;">{{ $t('Role') }}:&nbsp;</span><span>Admin&nbsp;&nbsp;</span>
                    </div>
                  </VCardText>

                  <!-- Teams -->
                  <VCardText>
                    <VCardSubtitle>{{ $t('Teams') }}</VCardSubtitle>
                    <div class="d-flex align-center">
                      &nbsp;<span style="font-weight: bold;">{{ $t('Department') }}:&nbsp;</span><span>salse&nbsp;&nbsp;</span>
                    </div>
                    <div class="d-flex align-center">
                      &nbsp;<span style="font-weight: bold;">{{ $t('Section') }}:&nbsp;</span><span>Manager&nbsp;&nbsp;</span>
                    </div>
                    <div class="d-flex align-center">
                      &nbsp;<span style="font-weight: bold;">{{ $t('Division') }}:&nbsp;</span><span>DC_01&nbsp;&nbsp;</span>
                    </div>
                    <div class="d-flex align-center">
                      &nbsp;<span style="font-weight: bold;">{{ $t('Position') }}:&nbsp;</span><span>DC_01</span>
                    </div>
                  </VCardText>
                </VCard>
              </VCol>
              <!-- User Warehouse / Requisition Warehouse / Change Password -->
              <VCol
                cols="12"
                lg="9"
              >
                <VRow>
                  <!-- User Warehouse -->
                  <VCol
                    cols="12"
                    lg="6"
                  >
                    <VCard>
                      <VCardTitle>{{ $t('User Warehouse') }}</VCardTitle>
                      <VCardText>
                        <div class="d-flex align-center">
                        &nbsp;<span style="font-weight: bold;">{{ $t('Code 002') }}:&nbsp;</span><span>salse&nbsp;&nbsp;</span>
                        </div>
                        <div class="d-flex align-center">
                          &nbsp;<span style="font-weight: bold;">{{ $t('Code 002') }}:&nbsp;</span><span>Manager&nbsp;&nbsp;</span>
                        </div>
                        <div class="d-flex align-center">
                          &nbsp;<span style="font-weight: bold;">{{ $t('Code 002') }}:&nbsp;</span><span>DC_01&nbsp;&nbsp;</span>
                        </div>
                      </VCardText>
                    </VCard>
                  </VCol>
                  <!-- Requisition Warehouse -->
                  <VCol
                    cols="12"
                    lg="6"
                  >
                    <VCard>
                      <VCardTitle>{{ $t('Requisition Warehouse') }}</VCardTitle>
                      <VCardText>
                        <div class="d-flex align-center">
                        &nbsp;<span style="font-weight: bold;">{{ $t('Code 001') }}:&nbsp;</span><span>salse&nbsp;&nbsp;</span>
                        </div>
                        <div class="d-flex align-center">
                          &nbsp;<span style="font-weight: bold;">{{ $t('Code 001') }}:&nbsp;</span><span>Manager&nbsp;&nbsp;</span>
                        </div>
                        <div class="d-flex align-center">
                          &nbsp;<span style="font-weight: bold;">{{ $t('Code 001') }}:&nbsp;</span><span>DC_01&nbsp;&nbsp;</span>
                        </div>
                      </VCardText>
                    </VCard>
                  </VCol>
                  <!-- Change Password -->
                  <VCol
                    cols="12"
                    lg="12"
                  >
                    <VCard>
                      <VCardText>
                        <VRow>
                          <VCol cols="12">
                            <span class="text-h5">{{ $t('Security') }}</span>
                          </VCol>
                          <VCol cols="12">
                            <VAlert
                              color="warning"
                              variant="tonal"
                            >
                              <div>{{ $t('Ensure That These Requirements Are Met') }}</div>
                              <div>{{ $t('Minimum 8 Character Long, Uppercase And Symbol') }}</div>
                            </VAlert>
                          </VCol>
                          <VCol
                            cols="12"
                            lg="6"
                          >
                            <VTextField
                              v-model="password"
                              :append-inner-icon="show1 ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                              :rules="[rules.required, rules.min]"
                              :type="show1 ? 'text' : 'password'"
                              name="input-10-1"
                              :label="$t('Password')"
                              hint="At least 8 characters"
                              placeholder="············"
                              counter
                              @click:append-inner="show1 = !show1"
                            />
                          </VCol>
                          <VCol
                            cols="12"
                            lg="6"
                          >
                            <VTextField
                              v-model="repeatPassword"
                              :append-inner-icon="show2 ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                              :rules="[rules.required, rules.min]"
                              :type="show2 ? 'text' : 'password'"
                              name="input-10-1"
                              :label="$t('Repeat Password')"
                              hint="At least 8 characters"
                              placeholder="············"
                              counter
                              @click:append-inner="show2 = !show2"
                            />
                          </VCol>
                          <VCol
                            class="d-flex justify-center justify-lg-start"
                            cols="12"
                          >
                            <VBtn>
                              {{ $t('Change Password') }}
                            </VBtn>
                          </VCol>
                        </VRow> 
                      </VCardText>
                    </VCard>
                  </VCol>
                </VRow>
              </VCol>
            </VRow>
          
            <!-- 👉 Form -->
            <VForm
              class="mt-6"
              @submit="submitSettingsAccount"
            >
              <VRow>
                <!-- 👉 Form Actions -->
                <VCol
                  cols="12"
                  class="d-flex flex-wrap gap-4 justify-center justify-lg-start"
                >
                  <VBtn type="submit">
                    Save changes
                  </VBtn>
                </VCol>
              </VRow>
            </VForm>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12">
      <!-- 👉 Delete Account -->
      </VCol>
    </VRow>
  </section>

  

  <!-- 👉 Confirm Dialog -->
  <ConfirmDialog
    v-model:isImgDialogVisible="isConfirmDialogOpen"
    confirmation-msg="Are you sure you want to deactivate your account?"
  />
</template>

<style lang="scss" scoped>
.avatar-center {
  position: absolute;
  border: 5px solid rgb(var(--v-theme-surface));
  inset-block-start: -2rem;
  inset-inline-start: 1rem;
}

// membership pricing
.member-pricing-bg {
  position: relative;
  background-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));
}

.membership-pricing {
  sup {
    inset-block-start: 9px;
  }
}
</style>
