<script setup>
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
  <VCard class="pa-6">
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
      <VCol cols="12" lg="6">
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
      <VCol cols="12" lg="6">
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
      <VCol cols="12" class="d-flex justify-center justify-lg-start">
        <VBtn>
          {{ $t('Change Password') }}
        </VBtn>
      </VCol>
    </VRow> 
  </VCard>
</template>
