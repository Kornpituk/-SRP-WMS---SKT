
<script>
const time = ref('')
const date = ref('')

const week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

function zeroPadding(num, digit) {
  return num.toString().padStart(digit, '0')
}

function updateTime() {
  const cd = new Date()

  time.value = `${zeroPadding(cd.getHours(), 2)}:${zeroPadding(cd.getMinutes(), 2)}:${zeroPadding(cd.getSeconds(), 2)}`
  date.value = `${zeroPadding(cd.getFullYear(), 4)}-${zeroPadding(cd.getMonth() + 1, 2)}-${zeroPadding(cd.getDate(), 2)} ${week[cd.getDay()]}`
}

onMounted(() => {
  updateTime()

  const timerID = setInterval(updateTime, 1000)

  onUnmounted(() => {
    clearInterval(timerID)
  })
})
</script>

<template lang="">
  <div>
    <VRow>
      <VCol cols="12">
        <div id="clock">
          <p class="date">
            {{ date }}
          </p>
          <p class="time">
            {{ time }}
          </p>
          <p class="text">
            DIGITAL CLOCK with Vue.js
          </p>
        </div>
      </VCol>
    </VRow>
  </div>
</template>

<style lang="">
html {
  block-size: 100%;
}

body {
  background: #0f3854;
  background: radial-gradient(ellipse at center, #0a2e38 0%, #000 70%);
  background-size: 100%;
  block-size: 100%;
}

p {
  padding: 0;
  margin: 0;
}

#clock {
  position: absolute;
  color: #fff;
  font-family: "Share Tech Mono", monospace;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  text-align: center;
  text-shadow: 0 0 20px rgba(10, 175, 230, 100%), 0 0 20px rgba(10, 175, 230, 0%);
  transform: translate(-50%, -50%);
}

.time {
  font-size: 80px;
  letter-spacing: 0.05em;
  padding-block: 5px 0;
  padding-inline: 5px 0;
}

.date {
  font-size: 24px;
  letter-spacing: 0.1em;
}

.text {
  font-size: 12px;
  letter-spacing: 0.1em;
  padding-block: 20px 0 0;
  padding-inline: 20px 0 0;
}
</style>
