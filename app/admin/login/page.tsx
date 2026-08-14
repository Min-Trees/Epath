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
import { getFirebaseAuth, isFirebaseConfigured } from '@/lib/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

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

    try {
      if (!isFirebaseConfigured) {
        throw new Error(
          'Firebase chưa được cấu hình. Vui lòng thêm NEXT_PUBLIC_FIREBASE_* vào .env.local'
        )
      }
      const auth = getFirebaseAuth()
      const credential = await signInWithEmailAndPassword(auth, email, password)
      const idToken = await credential.user.getIdToken()
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Đăng nhập thất bại')
      }
      router.push('/admin/dashboard')
    } catch (err) {
      const message = (err as Error).message || 'Đăng nhập thất bại'
      setError(message.includes('auth/') ? 'Email hoặc mật khẩu không đúng' : message)
    } finally {
      setIsLoading(false)
    }
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
            className="mt-6 text-center text-xs"
            style={{ color: semanticColors.textMuted }}
          >
            <p>Đăng nhập bằng tài khoản Firebase đã được cấp quyền admin.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}