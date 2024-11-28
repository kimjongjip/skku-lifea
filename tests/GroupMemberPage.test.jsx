import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import GroupMemberPage from '@/pages/GroupMemberPage'

// Mock the dependencies
vi.mock('axios')

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useLocation: () => ({
    state: {
      users: {
        userName: '테스트 유저',
        userImage: 'test-image-url',
        userClass: [{ classId: 'test-class-id' }]
      }
    },
    pathname: '',
    search: '',
    hash: '',
    key: ''
  }),
  Link: ({ children, to }) => <a href={to}>{children}</a>
}))

// Mock Material-UI components
vi.mock('@mui/material', () => ({
  Avatar: ({ src, alt, style }) => (
    <div className="MuiAvatar-root MuiAvatar-circular">
      <img src={src} alt={alt} style={style} />
    </div>
  ),
  Box: ({ children }) => <div>{children}</div>,
  Tabs: ({ children }) => <div>{children}</div>,
  Tab: ({ label, component: Component, to, ...props }) => {
    if (Component) {
      return <Component to={to}>{label}</Component>
    }
    return <div>{label}</div>
  }
}))

// Mock your components
vi.mock('../components/common/Header', () => ({
  default: () => <div>Header</div>
}))

vi.mock('../components/common/Nav', () => ({
  default: () => (
    <nav>
      <a href="/main">메인</a>
      <a href="/certificate">인증</a>
      <a href="/penalty">벌칙</a>
      <a href="/group-info">모임관리</a>
    </nav>
  )
}))

describe('GroupMemberPage', () => {
  const mockUser = {
    userName: '테스트 유저',
    userImage: 'test-image-url',
    userClass: [{ classId: 'test-class-id' }]
  }

  const mockVerificationResponse = {
    verifications: [
      {
        verificationImage: 'verification-image-url'
      }
    ]
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(axios.get).mockResolvedValue({ data: mockVerificationResponse })
  })

  it('renders user information correctly', () => {
    render(<GroupMemberPage />)
    
    expect(screen.getByText('테스트 유저')).toBeInTheDocument()
    expect(screen.getByAltText('user')).toHaveAttribute('src', 'test-image-url')
  })

  it('renders navigation links', () => {
    render(<GroupMemberPage />)
    
    expect(screen.getByText('메인')).toBeInTheDocument()
    expect(screen.getByText('인증')).toBeInTheDocument()
    expect(screen.getByText('벌칙')).toBeInTheDocument()
    expect(screen.getByText('모임관리')).toBeInTheDocument()
  })

  it('fetches and displays verification data', async () => {
    render(<GroupMemberPage />)

    await waitFor(() => {
      const dates = screen.getAllByText(/2024-11-\d{2}/)
      expect(dates).toHaveLength(6)
    })

    expect(axios.get).toHaveBeenCalledTimes(6)
  })

  it('handles API error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(axios.get).mockRejectedValueOnce(new Error('API Error'))

    render(<GroupMemberPage />)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('인증 기록 불러오기 에러:', expect.any(Error))
    })

    consoleSpy.mockRestore()
  })

  it('formats dates correctly', async () => {
    render(<GroupMemberPage />)

    const today = new Date()
    const formattedToday = today.toISOString().split('T')[0]

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining(formattedToday),
        expect.any(Object)
      )
    })
  })

  it('filters out empty verification data', async () => {
    const emptyResponse = { data: { verifications: [] } }
    vi.mocked(axios.get)
      .mockResolvedValueOnce({ data: mockVerificationResponse })
      .mockResolvedValueOnce(emptyResponse)
      .mockResolvedValue({ data: mockVerificationResponse })

    render(<GroupMemberPage />)

    await waitFor(() => {
      const dates = screen.getAllByText(/2024-11-\d{2}/)
      expect(dates.length).toBeLessThan(6)
    })
  })
})