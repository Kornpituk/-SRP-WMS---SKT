<!-- ============================================================
  PartyInfoFields.vue
  Matches: Party info displayed as a compact text block
  Edit mode:  individual outlined fields  
  Read mode:  plain text block (like in confirmed screenshots)
============================================================ -->
<template>
  <!-- Readonly: show as text block (matches confirmed view) -->
  <div v-if="readonly" class="party-block text-body-2">
    <div class="font-weight-medium">{{ party.name }}</div>
    <div v-if="party.address">{{ party.address }}</div>
    <div v-if="party.address2">{{ party.address2 }}</div>
    <div v-if="party.address3">{{ party.address3 }}</div>
    <div v-if="party.city || party.country">
      {{ [party.city, party.country].filter(Boolean).join(' - ') }}
    </div>
    <div v-if="party.tel">TEL.: {{ party.tel }}</div>
    <div v-if="party.taxId">TAX ID : {{ party.taxId }}</div>
    <div v-if="party.attn">ATTN : {{ party.attn }}</div>
    <div v-if="party.email">Email : {{ party.email }}</div>
  </div>

  <!-- Editable: individual fields -->
  <div v-else class="party-fields">
    <v-text-field :model-value="party.name" label="Company Name" variant="outlined" density="compact"
      @update:model-value="(v) => update('name', v)" />
    <v-text-field :model-value="party.address" label="Address Line 1" variant="outlined" density="compact"
      @update:model-value="(v) => update('address', v)" />
    <v-text-field :model-value="party.address2" label="Address Line 2" variant="outlined" density="compact"
      @update:model-value="(v) => update('address2', v)" />
    <v-row dense>
      <v-col cols="6">
        <v-text-field :model-value="party.city" label="City" variant="outlined" density="compact"
          @update:model-value="(v) => update('city', v)" />
      </v-col>
      <v-col cols="6">
        <v-text-field :model-value="party.country" label="Country" variant="outlined" density="compact"
          @update:model-value="(v) => update('country', v)" />
      </v-col>
    </v-row>
    <v-text-field :model-value="party.tel" label="Tel." variant="outlined" density="compact"
      @update:model-value="(v) => update('tel', v)" />
    <v-text-field :model-value="party.taxId" label="Tax ID" variant="outlined" density="compact"
      @update:model-value="(v) => update('taxId', v)" />
    <v-text-field :model-value="party.attn" label="ATTN" variant="outlined" density="compact"
      @update:model-value="(v) => update('attn', v)" />
    <v-text-field :model-value="party.email" label="Email" variant="outlined" density="compact"
      @update:model-value="(v) => update('email', v)" />
  </div>
</template>

<script setup>
const props = defineProps({
  party: { type: Object, required: true },
  readonly: { type: Boolean, default: false },
})
const emit = defineEmits(['update'])

function update(field, value) {
  emit('update', { ...props.party, [field]: value })
}
</script>

<style scoped>
.party-block {
  line-height: 1.6;
  min-height: 80px;
}
.party-fields {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
</style>
