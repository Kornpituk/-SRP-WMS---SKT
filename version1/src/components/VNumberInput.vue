<template>
    <div>
        <v-text-field v-model.number="inputValue" @keydown="onInput" density="compact" variant="outlined"
            class="justify-center" />
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';

export default defineComponent({
    name: 'VNumberInput',
    props: {
        modelValue: {
            type: [String, Number] as PropType<string | number>,
            default: '',
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const inputValue = ref<string | number>(props.modelValue);

        // Watch for changes in modelValue and update inputValue
        watch(() => props.modelValue, (newValue) => {
            inputValue.value = newValue;
        });

        const onInput = (event: Event) => {
            const target = event.target as HTMLInputElement;
            // Remove non-numeric characters
            const sanitizedValue = target.value.replace(/[^0-9]/g, '');
            inputValue.value = sanitizedValue;
            // Emit the sanitized value to the parent component
            emit('update:modelValue', sanitizedValue);
        };

        return {
            inputValue,
            onInput,
        };
    },
});
</script>

<style scoped>
/* You can customize the styling, but Vuetify will handle the theme and general styling for you */
</style>
