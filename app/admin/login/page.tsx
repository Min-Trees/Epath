'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Eye, EyeOff, LogIn, Lock, Mail } from 'lucide-react'
import { semanticColors, radius } from '@/lib/design-tokens'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate Firebase Auth login
    // In production, use: signInWithEmailAndPassword(auth, email, password)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (email === 'admin@epath.edu.vn' && password === 'admin123') {
      // Store auth state in localStorage for demo
      localStorage.setItem('admin_auth', 'true')
      router.push('/admin/dashboard')
    } else {
      setError('Email hoặc mật khẩu không đúng')
    }
    setIsLoading(false)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(135deg, ${semanticColors.primary} 0%, ${semanticColors.primaryDark} 100%)`,
      }}
    >
      <Card
        className="w-full max-w-md"
        style={{ borderRadius: radius['2xl'] }}
      >
        <CardHeader className="text-center">
          <Image
            src="/epath_logo.png"
            alt="EPath Education"
            width={200}
            height={60}
            className="h-14 w-auto mx-auto mb-4"
          />
          <CardTitle
            className="text-xl mt-2"
            style={{ color: semanticColors.textMuted }}
          >
            Admin
          </CardTitle>
          <CardDescription>
            Đăng nhập để truy cập trang quản trị
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: semanticColors.textMuted }}
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@epath.edu.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: semanticColors.textMuted }}
                />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
                  style={{ color: semanticColors.textMuted }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="text-sm text-center p-2 rounded"
                style={{
                  color: '#dc2626',
                  backgroundColor: '#fef2f2',
                }}
              >
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                'Đang đăng nhập...'
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Đăng nhập
                </>
              )}
            </Button>
          </form>

          <div
            className="mt-6 text-center text-sm"
            style={{ color: semanticColors.textMuted }}
          >
            <p>Demo credentials:</p>
            <p className="font-mono text-xs">admin@epath.edu.vn / admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
