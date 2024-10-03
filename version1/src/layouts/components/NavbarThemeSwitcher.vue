<script setup>
const asdasd =ref('asd')

// const themes = [
//   {
//     name: 'system',
//     icon: 'mdi-laptop',
//   },
//   {
//     name: 'light',
//     icon: 'mdi-weather-sunny',
//   },
//   {
//     name: 'dark',
//     icon: 'mdi-weather-night',
//   },
// ]

const themes = [
  {
    name: 'light',
    icon: 'mdi-weather-sunny',
  },
]
</script>

<template>
  <ThemeSwitcher :themes="themes" />
</template>
