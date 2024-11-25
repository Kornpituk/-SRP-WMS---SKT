<template>
    <div>
        <v-text-field v-model.number="inputValue" @keydown="onInput" density="compact" variant="outlined" oninput="if(Number(this.value) > Number(this.max)) this.value = this.max;" max="2"
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
        maxLength: {
            type: [Number] as PropType<number>
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
            const targetKey = event as KeyboardEvent;
            const target = event.target as HTMLTextAreaElement;
            if (targetKey.key.length === 1 && isNaN(Number(targetKey.key))) {
                event.preventDefault();
            }

            if(target.value.length > props.maxLength){
                if(targetKey.key != "Backspace" && targetKey.key != "Delete" && targetKey.key != "ArrowLeft"
                 && targetKey.key != "ArrowRight" && targetKey.key != "ArrowDown" && targetKey.key != "ArrowUp" ){ 
                    console.log(targetKey.key)
                    event.preventDefault();
                }
            }

            // Emit the sanitized value to the parent component
            emit('update:modelValue', inputValue.value);
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
