import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B1320',
        bg2: '#0F1A2B',
        panel: '#13243A',
        panel2: '#172C46',
        accent: '#FF8A3D',
        accent2: '#FFB37A',
        muted: '#7E94AC',
        success: '#3DDC97',
        warning: '#FFC857',
        danger: '#FF5C5C',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
