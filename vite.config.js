import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts', // setup.ts 파일 경로
    coverage: {
      provider: 'istanbul',  // 'c8'을 커버리지 제공자로 사용
      reporter: ['text', 'lcov', 'html'], // 커버리지 리포트 형식 설정
      all: true, // 테스트되지 않은 파일도 포함
      exclude: ['node_modules', 'dist', 'coverage', 'tests', 'public', 'src/routers'], // 제외할 디렉토리
    },
  },
});
