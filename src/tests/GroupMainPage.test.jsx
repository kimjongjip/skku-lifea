import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import GroupMainPage from '@/pages/GroupMainPage'

// Mock the assets
vi.mock('../assets/profile_default.png', () => ({
  default: 'default-profile-path'
}))

// Mock axios
vi.mock('axios')

// Mock navigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}))

// Mock components
vi.mock('../components/common/Header', () => ({
  default: () => <div>Header</div>
}))

vi.mock('../components/common/Nav', () => ({
  default: () => <nav>Navigation</nav>
}))

vi.mock('../components/main/Chart', () => ({
  default: ({ data }) => <div data-testid="chart">Chart Component</div>
}))

// Mock Material-UI components
vi.mock('@mui/material', () => ({
  Avatar: ({ src, style, children }) => (
    <div data-testid="avatar" style={style}>
      <img src={src} alt="avatar" />
      {children}
    </div>
  )
}))

describe('GroupMainPage', () => {
  const mockUserData = {
    userClass: [
      {
        classImage: 'class-image.jpg',
        className: '테스트 모임',
        classDescription: '테스트 모임 설명',
        classMember: [
          {
            email: 'test@test.com',
            userName: '테스트 유저',
            userImage: 'user-image.jpg'
          },
          {
            email: 'test2@test.com',
            userName: '테스트 유저2',
            userImage: 'user-image2.jpg'
          }
        ]
      }
    ]
  }

  const mockStatisticsData = {
    chart: [
      { date: '2024-01', certificationRate: 80 },
      { date: '2024-02', certificationRate: 85 }
    ]
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock API responses
    vi.mocked(axios.get).mockImplementation((url) => {
      if (url.includes('/user/info')) {
        return Promise.resolve({ data: mockUserData })
      }
      if (url.includes('/statistics')) {
        return Promise.resolve({ data: mockStatisticsData })
      }
      return Promise.reject(new Error('Not found'))
    })
  })

  it('shows loading state initially', () => {
    render(<GroupMainPage />)
    expect(screen.getByText('로딩 중...')).toBeInTheDocument()
  })

  it('renders header and navigation', () => {
    render(<GroupMainPage />)
    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByText('Navigation')).toBeInTheDocument()
  })

  it('fetches and displays group information', async () => {
    render(<GroupMainPage />)

    await waitFor(() => {
      expect(screen.getByText('테스트 모임')).toBeInTheDocument()
      expect(screen.getByText('테스트 모임 설명')).toBeInTheDocument()
    })

    expect(axios.get).toHaveBeenCalledWith(
      'https://nsptbxlxoj.execute-api.ap-northeast-2.amazonaws.com/dev/user/info',
      expect.any(Object)
    )
  })

  it('displays group members', async () => {
    render(<GroupMainPage />)

    await waitFor(() => {
      expect(screen.getByText('모임원')).toBeInTheDocument()
      expect(screen.getByText('테스트 유저')).toBeInTheDocument()
      expect(screen.getByText('테스트 유저2')).toBeInTheDocument()
    })
  })

  it('navigates to member page when clicking on a member', async () => {
    render(<GroupMainPage />)

    await waitFor(() => {
      expect(screen.getByText('테스트 유저')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('테스트 유저'))

    expect(mockNavigate).toHaveBeenCalledWith(
      '/member/테스트 유저',
      expect.any(Object)
    )
  })

  it('displays statistics chart', async () => {
    render(<GroupMainPage />)

    await waitFor(() => {
      expect(screen.getByText('통계치')).toBeInTheDocument()
      expect(screen.getByTestId('chart')).toBeInTheDocument()
    })

    expect(axios.get).toHaveBeenCalledWith(
      'https://nsptbxlxoj.execute-api.ap-northeast-2.amazonaws.com/dev/class/1/statistics',
      expect.any(Object)
    )
  })

  it('handles API error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(axios.get).mockRejectedValueOnce(new Error('API Error'))

    render(<GroupMainPage />)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching user info:',
        expect.any(Error)
      )
    })

    consoleSpy.mockRestore()
  })

  it('uses default values when API data is missing', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({ 
      data: { userClass: [{ }] } 
    })

    render(<GroupMainPage />)

    await waitFor(() => {
      const avatar = screen.getAllByTestId('avatar')[0]
      expect(avatar).toBeInTheDocument()
      // 기본 이미지가 사용되었는지 확인
      expect(avatar.querySelector('img')).toHaveAttribute('src', 'default-profile-path')
    })
  })
})