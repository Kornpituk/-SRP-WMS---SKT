<script setup>
import VueApexCharts from "vue3-apexcharts"
import { useTheme } from "vuetify"
import { getDonutChartConfigProductTranfer } from "@/views/dashboard/main/tranferInOunt/tranferOut/chartOptions"

const vuetifyTheme = useTheme()

const expenseRationChartConfig = computed(() =>
  getDonutChartConfigProductTranfer(vuetifyTheme.current.value),
)

const series = [68, 32]

//----------------------------------- Dialog --------------------------------------
const isDialogDetailVisible = ref(false)
</script>

<template>
  <VRow>
    <VCol cols="12">
      <div class="cursor-pointer" @click="isDialogDetailVisible = true">
        <VueApexCharts
          type="donut"
          height="250"
          :options="expenseRationChartConfig"
          :series="series"
        />
      </div>
    </VCol>
  </VRow>

  <section>
    <VDialog
      v-model="isDialogDetailVisible"
      width="100%"
    >
      <!-- Dialog Content -->
      <VCard title="Privacy Policy">
        <DialogCloseBtn
          variant="text"
          size="small"
          @click="isDialogDetailVisible = false"
        />

        <VCardText>
          <VRow>
            <!-- Receipt by PO -->
            <VCol cols="3">
              <VCard color="indigo-lighten-1">
                <VCardText class="clamp-text text-white mb-0">
                  <div class="d-flex align-center justify-center ">
                    <span>
                      <span class="text-h6 clamp-text text-white">
                        {{ $t('Stock Max & Min') }}
                      </span>
                    </span>
                  </div>
                </VCardText>

                <!-- MAX - MIN -->
                <VCardText class="">
                  <VRow no-gutters>
                    <VCol cols="5">
                      <div class="d-flex align-center justify-center mb-3">
                        <span
                          style="font-weight: bolder;"
                          class="me-2 text-h4 text-white"
                        >{{ $t('Max') }}</span>
                      </div>

                      <VRow class="d-flex justify-center">
                        <VCol
                          class="d-flex justify-center align-center "
                          cols="4"
                        >
                          <div>
                            <span class="text-xs clamp-text text-white">
                              {{ $t('Categories') }}
                            </span>
                          </div>
                        </VCol>
                        <VCol cols="2">
                          <div class="d-flex flex-column align-center justify-center h-100">
                            <VDivider
                              class="border-opacity-100 mx-auto"
                              color="white"
                              vertical
                            />
                          </div>
                        </VCol>
                        <VCol
                          class="d-flex justify-center align-center"
                          cols="4"
                        >
                          <div>
                            <span class="text-xs clamp-text text-white">
                              {{ $t('Total') }}
                            </span>
                          </div>
                        </VCol>
                      </VRow>

                      <VRow class="d-flex justify-center ">
                        <VCol
                          class="d-flex justify-center align-center "
                          cols="4"
                        >
                          <div>
                            <span class="text-h4 text-disabled clamp-text text-white">5</span>
                            <span class="text-xs clamp-text text-white">
                              20%
                            </span>
                          </div>
                        </VCol>
                        <VCol cols="2">
                          <div class="d-flex flex-column align-center justify-center h-100">
                            <VDivider
                              class="border-opacity-100 mx-auto"
                              color="white"
                              vertical
                            />
                          </div>
                        </VCol>
                        <VCol
                          class="d-flex justify-center align-center"
                          cols="4"
                        >
                          <div>
                            <span class="text-h4 text-disabled clamp-text text-white">20</span>
                            <span class="text-xs clamp-text text-white">
                              80%
                            </span>
                          </div>
                        </VCol>
                      </VRow>
                    </VCol>

                    <VCol cols="2">
                      <div class="d-flex flex-column align-center justify-center h-100">
                        <VDivider
                          class="border-opacity-100 mx-auto"
                          color="white"
                          vertical
                        />
                      </div>
                    </VCol>

                    <VCol
                      cols="5"
                      class="text-end"
                    >
                      <div class="d-flex align-center justify-center mb-3">
                        <span
                          style="font-weight: bolder;"
                          class="text-h4 me-2 text-white"
                        >{{ $t('Min') }}</span>
                      </div>
                      <VRow class="d-flex justify-center">
                        <VCol
                          class="d-flex justify-center align-center "
                          cols="4"
                        >
                          <div>
                            <span class="text-xs clamp-text text-white">
                              {{ $t('Categories') }}
                            </span>
                          </div>
                        </VCol>
                        <VCol cols="2">
                          <div class="d-flex flex-column align-center justify-center h-100">
                            <VDivider
                              class="border-opacity-100 mx-auto"
                              color="white"
                              vertical
                            />
                          </div>
                        </VCol>
                        <VCol
                          class="d-flex justify-center align-center"
                          cols="4"
                        >
                          <div>
                            <span class="text-xs clamp-text text-white">
                              {{ $t('Total') }}
                            </span>
                          </div>
                        </VCol>
                      </VRow>

                      <VRow class="d-flex justify-center ">
                        <VCol
                          class="d-flex justify-end align-center "
                          cols="4"
                        >
                          <div>
                            <span class="text-h4 text-disabled clamp-text text-white">6</span>
                            <span class="text-xs clamp-text text-white">
                              60%
                            </span>
                          </div>
                        </VCol>
            
                        <VCol cols="2">
                          <div class="d-flex flex-column align-center justify-center h-100">
                            <VDivider
                              class="border-opacity-100 mx-auto"
                              color="white"
                              vertical
                            />
                          </div>
                        </VCol>

                        <VCol
                          class="d-flex justify-center align-start"
                          cols="4"
                        >
                          <div>
                            <span class="text-h4 text-disabled clamp-text text-white">10</span>
                            <span class="text-xs clamp-text text-white">
                              100%
                            </span>
                          </div>
                        </VCol>
                      </VRow>
                    </VCol>
                  </VRow>
                </VCardText>
              </VCard>
            </VCol>
            <!-- Receipt by Warehouse -->
            <VCol cols="3">
              <VCard color="indigo-lighten-1">
                <VCardText class="clamp-text text-white mb-0">
                  <div class="d-flex align-center justify-center ">
                    <span>
                      <span class="text-h6 clamp-text text-white">
                        {{ $t('Stock Max & Min') }}
                      </span>
                    </span>
                  </div>
                </VCardText>

                <!-- MAX - MIN -->
                <VCardText class="">
                  <VRow no-gutters>
                    <VCol cols="5">
                      <div class="d-flex align-center justify-center mb-3">
                        <span
                          style="font-weight: bolder;"
                          class="me-2 text-h4 text-white"
                        >{{ $t('Max') }}</span>
                      </div>

                      <VRow class="d-flex justify-center">
                        <VCol
                          class="d-flex justify-center align-center "
                          cols="4"
                        >
                          <div>
                            <span class="text-xs clamp-text text-white">
                              {{ $t('Categories') }}
                            </span>
                          </div>
                        </VCol>
                        <VCol cols="2">
                          <div class="d-flex flex-column align-center justify-center h-100">
                            <VDivider
                              class="border-opacity-100 mx-auto"
                              color="white"
                              vertical
                            />
                          </div>
                        </VCol>
                        <VCol
                          class="d-flex justify-center align-center"
                          cols="4"
                        >
                          <div>
                            <span class="text-xs clamp-text text-white">
                              {{ $t('Total') }}
                            </span>
                          </div>
                        </VCol>
                      </VRow>

                      <VRow class="d-flex justify-center ">
                        <VCol
                          class="d-flex justify-center align-center "
                          cols="4"
                        >
                          <div>
                            <span class="text-h4 text-disabled clamp-text text-white">5</span>
                            <span class="text-xs clamp-text text-white">
                              20%
                            </span>
                          </div>
                        </VCol>
                        <VCol cols="2">
                          <div class="d-flex flex-column align-center justify-center h-100">
                            <VDivider
                              class="border-opacity-100 mx-auto"
                              color="white"
                              vertical
                            />
                          </div>
                        </VCol>
                        <VCol
                          class="d-flex justify-center align-center"
                          cols="4"
                        >
                          <div>
                            <span class="text-h4 text-disabled clamp-text text-white">20</span>
                            <span class="text-xs clamp-text text-white">
                              80%
                            </span>
                          </div>
                        </VCol>
                      </VRow>
                    </VCol>

                    <VCol cols="2">
                      <div class="d-flex flex-column align-center justify-center h-100">
                        <VDivider
                          class="border-opacity-100 mx-auto"
                          color="white"
                          vertical
                        />
                      </div>
                    </VCol>

                    <VCol
                      cols="5"
                      class="text-end"
                    >
                      <div class="d-flex align-center justify-center mb-3">
                        <span
                          style="font-weight: bolder;"
                          class="text-h4 me-2 text-white"
                        >{{ $t('Min') }}</span>
                      </div>
                      <VRow class="d-flex justify-center">
                        <VCol
                          class="d-flex justify-center align-center "
                          cols="4"
                        >
                          <div>
                            <span class="text-xs clamp-text text-white">
                              {{ $t('Categories') }}
                            </span>
                          </div>
                        </VCol>
                        <VCol cols="2">
                          <div class="d-flex flex-column align-center justify-center h-100">
                            <VDivider
                              class="border-opacity-100 mx-auto"
                              color="white"
                              vertical
                            />
                          </div>
                        </VCol>
                        <VCol
                          class="d-flex justify-center align-center"
                          cols="4"
                        >
                          <div>
                            <span class="text-xs clamp-text text-white">
                              {{ $t('Total') }}
                            </span>
                          </div>
                        </VCol>
                      </VRow>

                      <VRow class="d-flex justify-center ">
                        <VCol
                          class="d-flex justify-end align-center "
                          cols="4"
                        >
                          <div>
                            <span class="text-h4 text-disabled clamp-text text-white">6</span>
                            <span class="text-xs clamp-text text-white">
                              60%
                            </span>
                          </div>
                        </VCol>
            
                        <VCol cols="2">
                          <div class="d-flex flex-column align-center justify-center h-100">
                            <VDivider
                              class="border-opacity-100 mx-auto"
                              color="white"
                              vertical
                            />
                          </div>
                        </VCol>

                        <VCol
                          class="d-flex justify-center align-start"
                          cols="4"
                        >
                          <div>
                            <span class="text-h4 text-disabled clamp-text text-white">10</span>
                            <span class="text-xs clamp-text text-white">
                              100%
                            </span>
                          </div>
                        </VCol>
                      </VRow>
                    </VCol>
                  </VRow>
                </VCardText>
              </VCard>
            </VCol>
            <!-- Picking Warehouse -->
            <VCol cols="3">
              <VCard color="indigo-lighten-1">
                <VCardText class="clamp-text text-white mb-0">
                  <div class="d-flex align-center justify-center ">
                    <span>
                      <span class="text-h6 clamp-text text-white">
                        {{ $t('Stock Max & Min') }}
                      </span>
                    </span>
                  </div>
                </VCardText>

                <!-- MAX - MIN -->
                <VCardText class="">
                  <VRow no-gutters>
                    <VCol cols="5">
                      <div class="d-flex align-center justify-center mb-3">
                        <span
                          style="font-weight: bolder;"
                          class="me-2 text-h4 text-white"
                        >{{ $t('Max') }}</span>
                      </div>

                      <VRow class="d-flex justify-center">
                        <VCol
                          class="d-flex justify-center align-center "
                          cols="4"
                        >
                          <div>
                            <span class="text-xs clamp-text text-white">
                              {{ $t('Categories') }}
                            </span>
                          </div>
                        </VCol>
                        <VCol cols="2">
                          <div class="d-flex flex-column align-center justify-center h-100">
                            <VDivider
                              class="border-opacity-100 mx-auto"
                              color="white"
                              vertical
                            />
                          </div>
                        </VCol>
                        <VCol
                          class="d-flex justify-center align-center"
                          cols="4"
                        >
                          <div>
                            <span class="text-xs clamp-text text-white">
                              {{ $t('Total') }}
                            </span>
                          </div>
                        </VCol>
                      </VRow>

                      <VRow class="d-flex justify-center ">
                        <VCol
                          class="d-flex justify-center align-center "
                          cols="4"
                        >
                          <div>
                            <span class="text-h4 text-disabled clamp-text text-white">5</span>
                            <span class="text-xs clamp-text text-white">
                              20%
                            </span>
                          </div>
                        </VCol>
                        <VCol cols="2">
                          <div class="d-flex flex-column align-center justify-center h-100">
                            <VDivider
                              class="border-opacity-100 mx-auto"
                              color="white"
                              vertical
                            />
                          </div>
                        </VCol>
                        <VCol
                          class="d-flex justify-center align-center"
                          cols="4"
                        >
                          <div>
                            <span class="text-h4 text-disabled clamp-text text-white">20</span>
                            <span class="text-xs clamp-text text-white">
                              80%
                            </span>
                          </div>
                        </VCol>
                      </VRow>
                    </VCol>

                    <VCol cols="2">
                      <div class="d-flex flex-column align-center justify-center h-100">
                        <VDivider
                          class="border-opacity-100 mx-auto"
                          color="white"
                          vertical
                        />
                      </div>
                    </VCol>

                    <VCol
                      cols="5"
                      class="text-end"
                    >
                      <div class="d-flex align-center justify-center mb-3">
                        <span
                          style="font-weight: bolder;"
                          class="text-h4 me-2 text-white"
                        >{{ $t('Min') }}</span>
                      </div>
                      <VRow class="d-flex justify-center">
                        <VCol
                          class="d-flex justify-center align-center "
                          cols="4"
                        >
                          <div>
                            <span class="text-xs clamp-text text-white">
                              {{ $t('Categories') }}
                            </span>
                          </div>
                        </VCol>
                        <VCol cols="2">
                          <div class="d-flex flex-column align-center justify-center h-100">
                            <VDivider
                              class="border-opacity-100 mx-auto"
                              color="white"
                              vertical
                            />
                          </div>
                        </VCol>
                        <VCol
                          class="d-flex justify-center align-center"
                          cols="4"
                        >
                          <div>
                            <span class="text-xs clamp-text text-white">
                              {{ $t('Total') }}
                            </span>
                          </div>
                        </VCol>
                      </VRow>

                      <VRow class="d-flex justify-center ">
                        <VCol
                          class="d-flex justify-end align-center "
                          cols="4"
                        >
                          <div>
                            <span class="text-h4 text-disabled clamp-text text-white">6</span>
                            <span class="text-xs clamp-text text-white">
                              60%
                            </span>
                          </div>
                        </VCol>
            
                        <VCol cols="2">
                          <div class="d-flex flex-column align-center justify-center h-100">
                            <VDivider
                              class="border-opacity-100 mx-auto"
                              color="white"
                              vertical
                            />
                          </div>
                        </VCol>

                        <VCol
                          class="d-flex justify-center align-start"
                          cols="4"
                        >
                          <div>
                            <span class="text-h4 text-disabled clamp-text text-white">10</span>
                            <span class="text-xs clamp-text text-white">
                              100%
                            </span>
                          </div>
                        </VCol>
                      </VRow>
                    </VCol>
                  </VRow>
                </VCardText>
              </VCard>
            </VCol>
            <!-- Picking Delivery -->
            <VCol cols="3">
              <VCard color="indigo-lighten-1">
                <VCardText class="clamp-text text-white mb-0">
                  <div class="d-flex align-center justify-center ">
                    <span>
                      <span class="text-h6 clamp-text text-white">
                        {{ $t('Stock Max & Min') }}
                      </span>
                    </span>
                  </div>
                </VCardText>

                <!-- MAX - MIN -->
                <VCardText class="">
                  <VRow no-gutters>
                    <VCol cols="5">
                      <div class="d-flex align-center justify-center mb-3">
                        <span
                          style="font-weight: bolder;"
                          class="me-2 text-h4 text-white"
                        >{{ $t('Max') }}</span>
                      </div>

                      <VRow class="d-flex justify-center">
                        <VCol
                          class="d-flex justify-center align-center "
                          cols="4"
                        >
                          <div>
                            <span class="text-xs clamp-text text-white">
                              {{ $t('Categories') }}
                            </span>
                          </div>
                        </VCol>
                        <VCol cols="2">
                          <div class="d-flex flex-column align-center justify-center h-100">
                            <VDivider
                              class="border-opacity-100 mx-auto"
                              color="white"
                              vertical
                            />
                          </div>
                        </VCol>
                        <VCol
                          class="d-flex justify-center align-center"
                          cols="4"
                        >
                          <div>
                            <span class="text-xs clamp-text text-white">
                              {{ $t('Total') }}
                            </span>
                          </div>
                        </VCol>
                      </VRow>

                      <VRow class="d-flex justify-center ">
                        <VCol
                          class="d-flex justify-center align-center "
                          cols="4"
                        >
                          <div>
                            <span class="text-h4 text-disabled clamp-text text-white">5</span>
                            <span class="text-xs clamp-text text-white">
                              20%
                            </span>
                          </div>
                        </VCol>
                        <VCol cols="2">
                          <div class="d-flex flex-column align-center justify-center h-100">
                            <VDivider
                              class="border-opacity-100 mx-auto"
                              color="white"
                              vertical
                            />
                          </div>
                        </VCol>
                        <VCol
                          class="d-flex justify-center align-center"
                          cols="4"
                        >
                          <div>
                            <span class="text-h4 text-disabled clamp-text text-white">20</span>
                            <span class="text-xs clamp-text text-white">
                              80%
                            </span>
                          </div>
                        </VCol>
                      </VRow>
                    </VCol>

                    <VCol cols="2">
                      <div class="d-flex flex-column align-center justify-center h-100">
                        <VDivider
                          class="border-opacity-100 mx-auto"
                          color="white"
                          vertical
                        />
                      </div>
                    </VCol>

                    <VCol
                      cols="5"
                      class="text-end"
                    >
                      <div class="d-flex align-center justify-center mb-3">
                        <span
                          style="font-weight: bolder;"
                          class="text-h4 me-2 text-white"
                        >{{ $t('Min') }}</span>
                      </div>
                      <VRow class="d-flex justify-center">
                        <VCol
                          class="d-flex justify-center align-center "
                          cols="4"
                        >
                          <div>
                            <span class="text-xs clamp-text text-white">
                              {{ $t('Categories') }}
                            </span>
                          </div>
                        </VCol>
                        <VCol cols="2">
                          <div class="d-flex flex-column align-center justify-center h-100">
                            <VDivider
                              class="border-opacity-100 mx-auto"
                              color="white"
                              vertical
                            />
                          </div>
                        </VCol>
                        <VCol
                          class="d-flex justify-center align-center"
                          cols="4"
                        >
                          <div>
                            <span class="text-xs clamp-text text-white">
                              {{ $t('Total') }}
                            </span>
                          </div>
                        </VCol>
                      </VRow>

                      <VRow class="d-flex justify-center ">
                        <VCol
                          class="d-flex justify-end align-center "
                          cols="4"
                        >
                          <div>
                            <span class="text-h4 text-disabled clamp-text text-white">6</span>
                            <span class="text-xs clamp-text text-white">
                              60%
                            </span>
                          </div>
                        </VCol>
            
                        <VCol cols="2">
                          <div class="d-flex flex-column align-center justify-center h-100">
                            <VDivider
                              class="border-opacity-100 mx-auto"
                              color="white"
                              vertical
                            />
                          </div>
                        </VCol>

                        <VCol
                          class="d-flex justify-center align-start"
                          cols="4"
                        >
                          <div>
                            <span class="text-h4 text-disabled clamp-text text-white">10</span>
                            <span class="text-xs clamp-text text-white">
                              100%
                            </span>
                          </div>
                        </VCol>
                      </VRow>
                    </VCol>
                  </VRow>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </VCardText>

        <VCardActions>
          <VSpacer />
          <VBtn @click="isDialogDetailVisible = false">
            I accept
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </section>
</template>
