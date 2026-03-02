<script setup>
import { computed, onMounted, ref } from 'vue'
import { useActions } from './composables/useNoActions'
import { useData } from './composables/useNoData'
import  BaseMasterCrud  from '../components/BaseMasterCrud.vue'
import { useMasterCrud } from '../components/useMasterCrud'
import { fetchListService } from './services/Forwarder.service'
import { ServiceAdapter } from './services/Forwarder.Adapter'
import  { fields } from './field/Field'

const pageTitle = 'Forwarder'
const keyName = 'abb'
const { items, loading, error, loadItems } = useData()

const snackbar = ref({
  show: false,
  color: 'success',
  text: '',
})


const showSnack = (text, color = 'success') => {
  snackbar.value = { show: true, text, color }
}


const reload = async () => {
  try {
    await loadItems()
  } catch (err) {
    showSnack(err?.response?.data?.message || err?.message || 'Unable to load data', 'error')
  }
}

onMounted(reload)
</script>

<template>
  <BaseMasterCrud
    :title="pageTitle"
    :fields="fields"
    :service="ServiceAdapter"
    :delete-name-key="keyName"
  />
</template>
