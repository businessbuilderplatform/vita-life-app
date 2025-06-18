# HealthTracker Lite - Implementation Roadmap

## Project Overview
A zero-budget health tracking web application built by a solo developer using only free tools and services.

## Quick Start Guide

### Prerequisites Setup (Day 1)
```bash
# Install Node.js (LTS version)
# Download from nodejs.org

# Verify installation
node --version
npm --version

# Install global tools
npm install -g create-next-app
npm install -g vercel
```

### Project Initialization
```bash
# Create Next.js project
npx create-next-app@latest healthtracker-lite --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Navigate to project
cd healthtracker-lite

# Install additional dependencies
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install lucide-react class-variance-authority clsx tailwind-merge
npm install @hookform/resolvers react-hook-form zod
npm install recharts date-fns
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-toast @radix-ui/react-tabs

# Install development dependencies
npm install -D @types/node @testing-library/react @testing-library/jest-dom
npm install -D jest jest-environment-jsdom
npm install -D prettier prettier-plugin-tailwindcss
```

## Week-by-Week Implementation

### Week 1: Foundation & Design

#### Day 1-2: Environment Setup
```bash
# Initialize Git repository
git init
git add .
git commit -m "Initial commit"

# Create GitHub repository and push
gh repo create healthtracker-lite --public
git remote add origin https://github.com/yourusername/healthtracker-lite.git
git push -u origin main
```

**Figma Setup:**
1. Create free Figma account
2. Start with "Web Design" template
3. Create wireframes for:
   - Landing page
   - Dashboard
   - Health metrics input
   - Goals setting
   - Profile page

#### Day 3-4: Database Schema Design
```sql
-- Supabase SQL Schema
-- Users table (handled by Supabase Auth)

-- Health metrics table
CREATE TABLE health_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  metric_type VARCHAR(50) NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Goals table
CREATE TABLE goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_value DECIMAL(10,2) NOT NULL,
  current_value DECIMAL(10,2) DEFAULT 0,
  unit VARCHAR(20) NOT NULL,
  target_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements table
CREATE TABLE achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences table
CREATE TABLE user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  theme VARCHAR(20) DEFAULT 'light',
  units_system VARCHAR(20) DEFAULT 'metric',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own health metrics" ON health_metrics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health metrics" ON health_metrics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health metrics" ON health_metrics
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own health metrics" ON health_metrics
  FOR DELETE USING (auth.uid() = user_id);

-- Similar policies for other tables...
```

#### Day 5-7: UI Design System
```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// src/components/ui/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

### Week 2: Authentication & Core Setup

#### Day 1-2: Supabase Configuration
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// src/lib/auth.ts
import { supabase } from './supabase'

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
```

#### Day 3-4: Authentication Pages
```typescript
// src/app/auth/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await signIn(email, password)
    
    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

#### Day 5-7: Protected Routes & Middleware
```typescript
// src/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is not signed in and the current path is not /auth/login or /auth/register
  if (!user && !req.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // If user is signed in and the current path is /auth/login or /auth/register
  if (user && req.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

### Week 3: Core Functionality

#### Day 1-3: Health Metrics System
```typescript
// src/types/health.ts
export interface HealthMetric {
  id: string
  user_id: string
  metric_type: 'weight' | 'exercise' | 'water' | 'sleep'
  value: number
  unit: string
  recorded_at: string
  notes?: string
  created_at: string
}

// src/lib/health-metrics.ts
import { supabase } from './supabase'
import type { HealthMetric } from '@/types/health'

export async function createHealthMetric(metric: Omit<HealthMetric, 'id' | 'user_id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('health_metrics')
    .insert([metric])
    .select()
    .single()

  return { data, error }
}

export async function getHealthMetrics(userId: string, metricType?: string) {
  let query = supabase
    .from('health_metrics')
    .select('*')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false })

  if (metricType) {
    query = query.eq('metric_type', metricType)
  }

  const { data, error } = await query

  return { data, error }
}

export async function updateHealthMetric(id: string, updates: Partial<HealthMetric>) {
  const { data, error } = await supabase
    .from('health_metrics')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

export async function deleteHealthMetric(id: string) {
  const { error } = await supabase
    .from('health_metrics')
    .delete()
    .eq('id', id)

  return { error }
}
```

#### Day 4-5: Health Metrics Input Form
```typescript
// src/components/health/metric-form.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { createHealthMetric } from '@/lib/health-metrics'

const metricSchema = z.object({
  metric_type: z.enum(['weight', 'exercise', 'water', 'sleep']),
  value: z.number().positive(),
  unit: z.string().min(1),
  recorded_at: z.string(),
  notes: z.string().optional(),
})

type MetricFormData = z.infer<typeof metricSchema>

const metricTypes = [
  { value: 'weight', label: 'Weight', unit: 'kg' },
  { value: 'exercise', label: 'Exercise', unit: 'minutes' },
  { value: 'water', label: 'Water Intake', unit: 'ml' },
  { value: 'sleep', label: 'Sleep', unit: 'hours' },
]

export function MetricForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState<string>('')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<MetricFormData>({
    resolver: zodResolver(metricSchema),
    defaultValues: {
      recorded_at: new Date().toISOString().split('T')[0],
    },
  })

  const onSubmit = async (data: MetricFormData) => {
    setLoading(true)
    
    const { error } = await createHealthMetric({
      ...data,
      recorded_at: new Date(data.recorded_at).toISOString(),
    })

    if (error) {
      console.error('Error creating metric:', error)
    } else {
      reset()
      onSuccess?.()
    }

    setLoading(false)
  }

  const handleTypeChange = (type: string) => {
    setSelectedType(type)
    const metricType = metricTypes.find(t => t.value === type)
    if (metricType) {
      setValue('unit', metricType.unit)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="metric_type">Metric Type</Label>
        <Select onValueChange={handleTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select metric type" />
          </SelectTrigger>
          <SelectContent>
            {metricTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.metric_type && (
          <p className="text-red-500 text-sm">{errors.metric_type.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="value">Value</Label>
          <Input
            id="value"
            type="number"
            step="0.1"
            {...register('value', { valueAsNumber: true })}
          />
          {errors.value && (
            <p className="text-red-500 text-sm">{errors.value.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Input
            id="unit"
            {...register('unit')}
            readOnly
          />
          {errors.unit && (
            <p className="text-red-500 text-sm">{errors.unit.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="recorded_at">Date</Label>
        <Input
          id="recorded_at"
          type="date"
          {...register('recorded_at')}
        />
        {errors.recorded_at && (
          <p className="text-red-500 text-sm">{errors.recorded_at.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          {...register('notes')}
          placeholder="Add any additional notes..."
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Saving...' : 'Save Metric'}
      </Button>
    </form>
  )
}
```

### Week 4: Dashboard & Visualization

#### Day 1-3: Dashboard Layout
```typescript
// src/app/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/auth'
import { getHealthMetrics } from '@/lib/health-metrics'
import { MetricCard } from '@/components/dashboard/metric-card'
import { MetricChart } from '@/components/dashboard/metric-chart'
import { QuickActions } from '@/components/dashboard/quick-actions'
import type { HealthMetric } from '@/types/health'

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<HealthMetric[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMetrics()
  }, [])

  const loadMetrics = async () => {
    const user = await getCurrentUser()
    if (user) {
      const { data } = await getHealthMetrics(user.id)
      if (data) {
        setMetrics(data)
      }
    }
    setLoading(false)
  }

  const getLatestMetric = (type: string) => {
    return metrics.find(m => m.metric_type === type)
  }

  const getMetricTrend = (type: string) => {
    const typeMetrics = metrics
      .filter(m => m.metric_type === type)
      .slice(0, 7)
      .reverse()
    
    return typeMetrics.map(m => ({
      date: new Date(m.recorded_at).toLocaleDateString(),
      value: m.value
    }))
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Health Dashboard</h1>
        <p className="text-gray-600">Track your health metrics and progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Weight"
          value={getLatestMetric('weight')?.value}
          unit="kg"
          trend={getMetricTrend('weight')}
        />
        <MetricCard
          title="Exercise"
          value={getLatestMetric('exercise')?.value}
          unit="min"
          trend={getMetricTrend('exercise')}
        />
        <MetricCard
          title="Water Intake"
          value={getLatestMetric('water')?.value}
          unit="ml"
          trend={getMetricTrend('water')}
        />
        <MetricCard
          title="Sleep"
          value={getLatestMetric('sleep')?.value}
          unit="hrs"
          trend={getMetricTrend('sleep')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <MetricChart metrics={metrics} />
        </div>
        <div>
          <QuickActions onMetricAdded={loadMetrics} />
        </div>
      </div>
    </div>
  )
}
```

#### Day 4-5: Chart Components
```typescript
// src/components/dashboard/metric-chart.tsx
'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { HealthMetric } from '@/types/health'

interface MetricChartProps {
  metrics: HealthMetric[]
}

export function MetricChart({ metrics }: MetricChartProps) {
  const [selectedMetric, setSelectedMetric] = useState('weight')

  const chartData = metrics
    .filter(m => m.metric_type === selectedMetric)
    .slice(0, 30)
    .reverse()
    .map(m => ({
      date: new Date(m.recorded_at).toLocaleDateString(),
      value: m.value,
      fullDate: m.recorded_at
    }))

  const metricOptions = [
    { value: 'weight', label: 'Weight (kg)' },
    { value: 'exercise', label: 'Exercise (min)' },
    { value: 'water', label: 'Water (ml)' },
    { value: 'sleep', label: 'Sleep (hrs)' },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Health Trends</CardTitle>
            <CardDescription>Your health metrics over time</CardDescription>
          </div>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {metricOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                labelFormatter={(label) => `Date: ${label}`}
                formatter={(value) => [value, selectedMetric]}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
```

### Week 5-6: Goals & Achievements

#### Day 1-3: Goals System
```typescript
// src/types/goals.ts
export interface Goal {
  id: string
  user_id: string
  title: string
  description?: string
  target_value: number
  current_value: number
  unit: string
  target_date?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// src/lib/goals.ts
import { supabase } from './supabase'
import type { Goal } from '@/types/goals'

export async function createGoal(goal: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('goals')
    .insert([goal])
    .select()
    .single()

  return { data, error }
}

export async function getGoals(userId: string) {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function updateGoalProgress(goalId: string, currentValue: number) {
  const { data, error } = await supabase
    .from('goals')
    .update({ 
      current_value: currentValue,
      updated_at: new Date().toISOString()
    })
    .eq('id', goalId)
    .select()
    .single()

  return { data, error }
}
```

#### Day 4-5: Achievement System
```typescript
// src/lib/achievements.ts
import { supabase } from './supabase'
import type { HealthMetric } from '@/types/health'

export interface Achievement {
  id: string
  user_id: string
  achievement_type: string
  title: string
  description: string
  earned_at: string
}

const achievementRules = [
  {
    type: 'first_metric',
    title: 'Getting Started',
    description: 'Logged your first health metric',
    check: (metrics: HealthMetric[]) => metrics.length >= 1
  },
  {
    type: 'week_streak',
    title: 'Week Warrior',
    description: 'Logged metrics for 7 consecutive days',
    check: (metrics: HealthMetric[]) => {
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        return date.toDateString()
      })
      
      return last7Days.every(day => 
        metrics.some(m => new Date(m.recorded_at).toDateString() === day)
      )
    }
  },
  {
    type: 'exercise_milestone',
    title: 'Fitness Enthusiast',
    description: 'Completed 1000 minutes of exercise',
    check: (metrics: HealthMetric[]) => {
      const totalExercise = metrics
        .filter(m => m.metric_type === 'exercise')
        .reduce((sum, m) => sum + m.value, 0)
      return totalExercise >= 1000
    }
  }
]

export async function checkAchievements(userId: string, metrics: HealthMetric[]) {
  const { data: existingAchievements } = await supabase
    .from('achievements')
    .select('achievement_type')
    .eq('user_id', userId)

  const earnedTypes = existingAchievements?.map(a => a.achievement_type) || []
  const newAchievements = []

  for (const rule of achievementRules) {
    if (!earnedTypes.includes(rule.type) && rule.check(metrics)) {
      const { data, error } = await supabase
        .from('achievements')
        .insert([{
          user_id: userId,
          achievement_type: rule.type,
          title: rule.title,
          description: rule.description
        }])
        .select()
        .single()

      if (data) {
        newAchievements.push(data)
      }
    }
  }

  return newAchievements
}
```

### Week 7-8: Polish & Testing

#### Day 1-3: Testing Setup
```typescript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
  ],
}

module.exports = createJestConfig(customJestConfig)

// jest.setup.js
import '@testing-library/jest-dom'

// src/__tests__/health-metrics.test.ts
import { createHealthMetric, getHealthMetrics } from '@/lib/health-metrics'

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: mockMetric, error: null }))
        }))
      })),
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({ data: [mockMetric], error: null }))
        }))
      }))
    }))
  }
}))

const mockMetric = {
  id: '1',
  user_id: 'user1',
  metric_type: 'weight',
  value: 70,
  unit: 'kg',
  recorded_at: '2024-01-01',
  created_at: '2024-01-01'
}

describe('Health Metrics', () => {
  test('creates health metric', async () => {
    const { data, error } = await createHealthMetric({
      metric_type: 'weight',
      value: 70,
      unit: 'kg',
      recorded_at: '2024-01-01'
    })

    expect(error).toBeNull()
    expect(data).toEqual(mockMetric)
  })

  test('gets health metrics', async () => {
    const { data, error } = await getHealthMetrics('user1')

    expect(error).toBeNull()
    expect(data).toEqual([mockMetric])
  })
})
```

#### Day 4-5: Performance Optimization
```typescript
// src/hooks/use-health-metrics.ts
import { useState, useEffect, useCallback } from 'react'
import { getHealthMetrics } from '@/lib/health-metrics'
import { getCurrentUser } from '@/lib/auth'
import type { HealthMetric } from '@/types/health'

export function useHealthMetrics() {
  const [metrics, setMetrics] = useState<HealthMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadMetrics = useCallback(async () => {
    try {
      setLoading(true)
      const user = await getCurrentUser()
      if (user) {
        const { data, error } = await getHealthMetrics(user.id)
        if (error) {
          setError(error.message)
        } else {
          setMetrics(data || [])
        }
      }
    } catch (err) {
      setError('Failed to load metrics')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMetrics()
  }, [loadMetrics])

  return {
    metrics,
    loading,
    error,
    refetch: loadMetrics
  }
}

// src/components/dashboard/metric-card.tsx - Optimized version
import { memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface MetricCardProps {
  title: string
  value?: number
  unit: string
  trend: Array<{ date: string; value: number }>
}

export const MetricCard = memo(function MetricCard({ title, value, unit, trend }: MetricCardProps) {
  const getTrendDirection = () => {
    if (trend.length < 2) return 'neutral'
    const latest = trend[trend.length - 1]?.value || 0
    const previous = trend[trend.length - 2]?.value || 0
    
    if (latest > previous) return 'up'
    if (latest < previous) return 'down'
    return 'neutral'
  }

  const trendDirection = getTrendDirection()
  const TrendIcon = trendDirection === 'up' ? TrendingUp : 
                   trendDirection === 'down' ? TrendingDown : Minus

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <TrendIcon className={`h-4 w-4 ${
          trendDirection === 'up' ? 'text-green-600' :
          trendDirection === 'down' ? 'text-red-600' :
          'text-gray-400'
        }`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value ? `${value} ${unit}` : 'No data'}
        </div>
        <p className="text-xs text-muted-foreground">
          {trend.length > 0 ? `${trend.length} entries` : 'Start tracking'}
        </p>
      </CardContent>
    </Card>
  )
})
```

### Week 9-10: Deployment & Launch

#### Day 1-2: Environment Configuration
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000

# .env.production
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

#### Day 3-4: Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to Vercel
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Deploy to production
vercel --prod
```

#### Day 5: Analytics Setup
```typescript
// src/lib/analytics.ts
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties)
  }
}

// Usage in components
import { trackEvent } from '@/lib/analytics'

const handleMetricSave = async () => {
  // Save metric logic
  trackEvent('metric_saved', {
    metric_type: selectedType,
    value: formData.value
  })
}
```

## Testing Strategy

### Unit Tests
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### E2E Tests with Playwright
```typescript
// tests/auth.spec.ts
import { test, expect } from '@playwright/test'

test('user can sign up and log in', async ({ page }) => {
  // Sign up
  await page.goto('/auth/register')
  await page.fill('[data-testid=email]', 'test@example.com')
  await page.fill('[data-testid=password]', 'password123')
  await page.click('[data-testid=submit]')
  
  // Should redirect to dashboard
  await expect(page).toHaveURL('/dashboard')
  
  // Log out
  await page.click('[data-testid=logout]')
  
  // Log in
  await page.goto('/auth/login')
  await page.fill('[data-testid=email]', 'test@example.com')
  await page.fill('[data-testid=password]', 'password123')
  await page.click('[data-testid=submit]')
  
  // Should redirect to dashboard
  await expect(page).toHaveURL('/dashboard')
})

test('user can log health metrics', async ({ page }) => {
  // Login first
  await page.goto('/auth/login')
  await page.fill('[data-testid=email]', 'test@example.com')
  await page.fill('[data-testid=password]', 'password123')
  await page.click('[data-testid=submit]')
  
  // Navigate to add metric
  await page.click('[data-testid=add-metric]')
  
  // Fill form
  await page.selectOption('[data-testid=metric-type]', 'weight')
  await page.fill('[data-testid=metric-value]', '70')
  await page.click('[data-testid=save-metric]')
  
  // Should see success message
  await expect(page.locator('[data-testid=success-message]')).toBeVisible()
})
```

## Monitoring & Maintenance

### Error Tracking with Sentry
```typescript
// src/lib/sentry.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})

// Usage
try {
  await createHealthMetric(data)
} catch (error) {
  Sentry.captureException(error)
  throw error
}
```

### Performance Monitoring
```typescript
// src/lib/performance.ts
export function measurePerformance(name: string, fn: () => Promise<any>) {
  return async (...args: any[]) => {
    const start = performance.now()
    try {
      const result = await fn.apply(this, args)
      const end = performance.now()
      
      // Log to analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'timing_complete', {
          name,
          value: Math.round(end - start)
        })
      }
      
      return result
    } catch (error) {
      const end = performance.now()
      console.error(`Performance measurement failed for ${name}:`, error)
      throw error
    }
  }
}
```

This implementation roadmap provides a complete, step-by-step guide for building HealthTracker Lite using only free tools and services, ensuring a professional result within the 12-week timeline.