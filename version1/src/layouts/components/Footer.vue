<script setup>
"https://www.facebook.com/easetrack.bkk/?locale=th_TH"
"https://www.easetrack.com/"
"All Rights Reserved"

const openInNewTab = () => {
  window.open("https://github.com/Kornpituk/Update-WMS-WebApp/tree/main", "_blank")
}

const versionWMSConfig = ref('')

watchEffect(() => {
  versionWMSConfig.value = localStorage.getItem('versionWMS')
})
</script>


<template>
  <div
    style="margin-top: 20px;"
    clas="h-100 d-flex align-center justify-space-between"
  >
    <VRow
      justify="center"
      no-gutters
    >
      <VCol
        class="py-lg-4 text-start custom-footer"
        cols="8"
        lg="8"
        md="8"
        sm="8"
      >
        <VRow>
          <VCol
            cols="12"
            lg="2"
            sm="12"
          >
            <span style="font-size: 12px;">Copyright &copy;{{ new Date().getFullYear() }} Smart Reform Plus.All Rights Reserved</span>
          </VCol>
          <VCol
            cols="12"
            lg="6"
            sm="12"
          >
            <span v-if="false" style="font-size: 12px;">All Rights Reserved</span>
          </VCol>
        </VRow>
      </VCol>
      <VCol
        class="py-lg-4 text-end custom-footer"
        cols="4"
        lg="4"
        md="4"
        sm="4"
      >
        <span style="font-size: 12px;">Easetrack</span>
        <span style="font-size: 12px;">&nbsp;<a
          href="https://github.com/Kornpituk/Update-WMS-WebApp/tree/main"
          @click="openInNewTab"
        >Version {{ versionWMSConfig }}</a></span>
      </VCol>
    </VRow>
  </div>
</template> 


<style lang="scss">
@media screen and (min-width: 200px) and (max-width: 400px) {
  .custom-footer {
    font-size: 5px;
  }

  .custom-text-left {
    padding-block: 5px !important;
    padding-inline: 5px !important;
  }
}

@media screen and (min-width: 401px) and (max-width: 500px) {
  .custom-footer {
    font-size: 10px;
  }
}

@media screen and (min-width: 501px) and (max-width: 600px) {
  .custom-footer .span {
    font-size: 30px;
  }
}
</style>

