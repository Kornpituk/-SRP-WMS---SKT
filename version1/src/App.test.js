
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { handleVisibilityChange } from './utilities/auth' // แก้ path ให้ตรงกับไฟล์ที่ประกาศ

// Mock router.push() เพื่อไม่ให้เกิดการเปลี่ยนหน้าใน Unit Test
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

describe('logout()', () => {
  it('ควรลบ accessToken ออกจาก localStorage และ redirect ไปที่ /login', () => {
    localStorage.setItem('accessToken', 'dummy_token')

    const mockLogout = vi.spyOn(global, 'logout')

    mockLogout()

    expect(localStorage.getItem('accessToken')).toBeNull()
    expect(useRouter().push).toHaveBeenCalledWith('/login')
  })
})

describe('resetTimeout()', () => {
  beforeEach(() => {
    vi.useFakeTimers() // ใช้ fake timers เพื่อควบคุม setTimeout
  })

  afterEach(() => {
    vi.useRealTimers() // คืนค่า timers เป็นปกติ
  })

  it('ควร reset timeout ใหม่ทุกครั้งที่ถูกเรียก', () => {
    const mockLogout = vi.fn()

    resetTimeout(mockLogout)

    vi.advanceTimersByTime(1000) // จำลองเวลาผ่านไป 1 วินาที
    resetTimeout(mockLogout) // reset timeout ใหม่

    vi.advanceTimersByTime(14 * 60 * 1000) // ผ่านไป 14 นาที
    expect(mockLogout).not.toHaveBeenCalled()

    vi.advanceTimersByTime(60 * 1000) // ผ่านไปอีก 1 นาที (รวม 15 นาที)
    expect(mockLogout).toHaveBeenCalled()
  })
})

describe('handleVisibilityChange()', () => {
  beforeAll(() => {
    global.document = {
      visibilityState: 'visible',  // Default value
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }
    global.localStorage = {
      setItem: vi.fn(),
      getItem: vi.fn(),
      removeItem: vi.fn(),
    }
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('ควรเรียก logout() ถ้า tab ไม่ active นานเกิน 5 นาที', () => {
    const mockLogout = vi.fn()

    // Mock document.visibilityState
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden')

    handleVisibilityChange(mockLogout)

    vi.advanceTimersByTime(1* 30 * 1000) // เดินเวลาไป 5 นาที
    expect(mockLogout).toHaveBeenCalled()
  })
})
