import type { Config } from "tailwindcss";

export default {
	// darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}", 
		"./myComponents/**/*.{ts,tsx}", 
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Child-friendly color palette
				kid: {
					pink: 'hsl(var(--kid-pink))',
					purple: 'hsl(var(--kid-purple))',
					blue: 'hsl(var(--kid-blue))',
					green: 'hsl(var(--kid-green))',
					yellow: 'hsl(var(--kid-yellow))',
					orange: 'hsl(var(--kid-orange))',
					teal: 'hsl(var(--kid-teal))',
					cream: 'hsl(var(--kid-cream))',
				},
				// Success and warning colors
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				// Legacy colors for backward compatibility
				purple: {
					light: '#F2E9FF',
					DEFAULT: '#9B6BF3',
					dark: '#6A41C8',
				},
				teal: {
					light: '#E6F8F8',
					DEFAULT: '#4ECDC4',
					dark: '#38A39B',
				},
				blush: {
					light: '#FFF0F3',
					DEFAULT: '#FFABB6',
					dark: '#FF8A98',
				},
				cream: '#FFF8F0',
				pastel: {
					pink: '#FFDEE2',
					blue: '#D3E4FD',
					purple: '#E5DEFF',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				// Child-friendly border radius
				'kid': '1.5rem',
				'kid-lg': '2rem',
				'kid-xl': '2.5rem',
			},
			fontFamily: {
				'kid': ['Comic Sans MS', 'Chalkboard SE', 'Arial Rounded MT Bold', 'Arial', 'sans-serif'],
				'fun': ['Fredoka One', 'Comic Sans MS', 'Arial Rounded MT Bold', 'sans-serif'],
			},
			fontSize: {
				'kid-xs': ['0.75rem', { lineHeight: '1.2' }],
				'kid-sm': ['0.875rem', { lineHeight: '1.3' }],
				'kid-base': ['1rem', { lineHeight: '1.4' }],
				'kid-lg': ['1.125rem', { lineHeight: '1.4' }],
				'kid-xl': ['1.25rem', { lineHeight: '1.4' }],
				'kid-2xl': ['1.5rem', { lineHeight: '1.3' }],
				'kid-3xl': ['1.875rem', { lineHeight: '1.2' }],
				'kid-4xl': ['2.25rem', { lineHeight: '1.1' }],
			},
			spacing: {
				'kid': '0.75rem',
				'kid-lg': '1rem',
				'kid-xl': '1.5rem',
				'kid-2xl': '2rem',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': { 
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': { 
						opacity: '1',
						transform: 'translateY(0)'
					},
				},
				'scale-in': {
					'0%': { 
						opacity: '0',
						transform: 'scale(0.95)'
					},
					'100%': { 
						opacity: '1',
						transform: 'scale(1)'
					},
				},
				'slide-in': {
					'0%': { 
						transform: 'translateX(-20px)',
						opacity: '0'
					},
					'100%': { 
						transform: 'translateX(0)',
						opacity: '1'
					},
				},
				'pulse-soft': {
					'0%, 100%': { 
						opacity: '1'
					},
					'50%': { 
						opacity: '0.8'
					},
				},
				// Child-friendly animations
				'bounce-gentle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-4px)' }
				},
				'wiggle': {
					'0%, 100%': { transform: 'rotate(0deg)' },
					'25%': { transform: 'rotate(2deg)' },
					'75%': { transform: 'rotate(-2deg)' }
				},
				'sparkle': {
					'0%, 100%': { opacity: '1', transform: 'scale(1)' },
					'50%': { opacity: '0.8', transform: 'scale(1.1)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'rainbow': {
					'0%': { filter: 'hue-rotate(0deg)' },
					'100%': { filter: 'hue-rotate(360deg)' }
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'scale-in': 'scale-in 0.4s ease-out forwards',
				'slide-in': 'slide-in 0.4s ease-out forwards',
				'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
				'spin-slow': 'spin 4s linear infinite',
				// Child-friendly animations
				'bounce-gentle': 'bounce-gentle 0.6s ease-in-out',
				'wiggle': 'wiggle 0.3s ease-in-out',
				'sparkle': 'sparkle 2s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'rainbow': 'rainbow 3s linear infinite',
			},
			boxShadow: {
				'kid': '0 4px 8px rgba(0, 0, 0, 0.1)',
				'kid-lg': '0 8px 16px rgba(0, 0, 0, 0.1)',
				'kid-xl': '0 12px 24px rgba(0, 0, 0, 0.15)',
				'kid-glow': '0 0 20px rgba(59, 130, 246, 0.3)',
				'kid-glow-pink': '0 0 20px rgba(236, 72, 153, 0.3)',
				'kid-glow-purple': '0 0 20px rgba(147, 51, 234, 0.3)',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

