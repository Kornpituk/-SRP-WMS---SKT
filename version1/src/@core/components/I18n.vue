<script setup>
const props = defineProps({
  languages: {
    type: Array,
    required: true,
  },
  location: {
    type: null,
    required: false,
    default: 'bottom end',
  },
})

const emit = defineEmits(['change'])

const { locale } = useI18n({ useScope: 'global' })


watch(locale, val => {
  document.documentElement.setAttribute('lang', val)
})

const currentLang = ref(['en'])

const icon = ref('')
const imgIcon = ref('')

import urlImageEng from '@images/icons/kingdom.png'
import urlImageTh from '@images/icons/thailand.png'

const getIconFromLang = iconName => {
  icon.value = iconName
  console.log('icon.value', icon.value)
  localStorage.setItem('18Val', iconName)

  if (icon.value == 'en') {
    imgIcon.value = urlImageEng

    // console.log('imgIcon.value', imgIcon.value)
  } else if (icon.value == 'th') {
    imgIcon.value = urlImageTh

    // console.log('imgIcon.value', imgIcon.value)
  } else {
    // console.log('imgIcon.value False')
  }
}

watchEffect(() => {
  getIconFromLang(currentLang.value) // เรียกใช้ฟังก์ชันเมื่อมีการเปลี่ยนแปลงใน currentLang
})
</script>

<template>
  <IconBtn>
    <img
      :src="imgIcon"
      alt="Icon Translate"
      style="width: 30px;"
    >

    <!-- Menu -->
    <VMenu
      activator="parent"
      :location="props.location"
    >
      <!-- List -->
      <VList
        v-model:selected="currentLang"
        active-color="primary"
        min-width="175px"
      >
        <!-- List item -->
        <VListItem
          v-for="lang in props.languages"
          :key="lang.i18nLang"
          :value="lang.i18nLang"
          @click="locale = lang.i18nLang; $emit('change', lang.i18nLang)"
        >
          <!-- Language label -->
          <VListItemTitle>{{ lang.label }}</VListItemTitle>
          <VListItemTitle @click="getIconFromLang(lang.icon)" />
        </VListItem>
      </VList>
    </VMenu>
  </IconBtn>
</template>
