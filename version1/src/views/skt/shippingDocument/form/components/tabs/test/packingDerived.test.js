import { describe, expect, it } from 'vitest'
import {
  buildSampleDescription,
  buildTotalGross,
  buildTotalNet,
  createDefaultSampleDescription,
  getItemTotalGross,
  getItemTotalNet,
} from '../../../utils/packingDerived'

describe('packingDerived sample helpers', () => {
  it('builds sample text with sub description and disclaimer lines', () => {
    const item = {
      subDescription: 'SODIUM POLYACRYLATE',
      sampleDescription: '(SODIUM POLYACRYLATE)\n(FREE SAMPLE)\n(NO COMMERCIAL VALUE)\n(VALUE SHOWN FOR CUSTOMS PURPOSE ONLY)',
    }

    expect(buildSampleDescription(item)).toBe(
      '(SODIUM POLYACRYLATE)\n(FREE SAMPLE)\n(NO COMMERCIAL VALUE)\n(VALUE SHOWN FOR CUSTOMS PURPOSE ONLY)',
    )
  })

  it('creates default editable sample text once without duplicating sub description', () => {
    expect(createDefaultSampleDescription('SODIUM POLYACRYLATE')).toBe(
      '(SODIUM POLYACRYLATE)\n(FREE SAMPLE)\n(NO COMMERCIAL VALUE)\n(VALUE SHOWN FOR CUSTOMS PURPOSE ONLY)',
    )
  })

  it('uses the full sub description text as the first sample line on first seed', () => {
    expect(createDefaultSampleDescription('SODIUM POLYACRYLATE ,ANIONIC SURFACTANT')).toBe(
      '(SODIUM POLYACRYLATE ,ANIONIC SURFACTANT)\n(FREE SAMPLE)\n(NO COMMERCIAL VALUE)\n(VALUE SHOWN FOR CUSTOMS PURPOSE ONLY)',
    )
  })

  it('matches the requested sample textarea seed for SN DISPERSANT 5040 item', () => {
    const item = {
      descriptionOfGoods: 'SN DISPERSANT 5040',
      subDescription: 'SODIUM POLYACRY LATE',
      sampleDescription: '',
    }

    expect(item.descriptionOfGoods).toBe('SN DISPERSANT 5040')
    expect(buildSampleDescription(item)).toBe(
      '(SODIUM POLYACRY LATE)\n(FREE SAMPLE)\n(NO COMMERCIAL VALUE)\n(VALUE SHOWN FOR CUSTOMS PURPOSE ONLY)',
    )
  })

  it('adds sample weights into row totals only when sample is enabled', () => {
    const sampleItem = {
      isSample: true,
      netWeight: 100,
      grossWeight: 120,
      sampleNetWeight: 5,
      sampleGrossWeight: 7,
    }

    const normalItem = {
      isSample: false,
      netWeight: 200,
      grossWeight: 240,
      sampleNetWeight: 10,
      sampleGrossWeight: 12,
    }

    expect(getItemTotalNet(sampleItem)).toBe(105)
    expect(getItemTotalGross(sampleItem)).toBe(127)
    expect(getItemTotalNet(normalItem)).toBe(200)
    expect(getItemTotalGross(normalItem)).toBe(240)
  })

  it('includes sample weights in document totals', () => {
    const items = [
      {
        isSample: true,
        netWeight: 100,
        grossWeight: 120,
        sampleNetWeight: 5,
        sampleGrossWeight: 7,
      },
      {
        isSample: false,
        netWeight: 200,
        grossWeight: 240,
        sampleNetWeight: 10,
        sampleGrossWeight: 12,
      },
    ]

    expect(buildTotalNet(items)).toBe(305)
    expect(buildTotalGross(items)).toBe(367)
  })
})
