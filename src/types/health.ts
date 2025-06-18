export interface HealthMetric {
  id: string
  type: 'heart_rate' | 'blood_pressure' | 'weight' | 'steps' | 'sleep' | 'calories'
  value: number
  unit: string
  timestamp: Date
  deviceId?: string
  notes?: string
}

export interface User {
  id: string
  email: string
  name: string
  dateOfBirth: Date
  gender: 'male' | 'female' | 'other'
  height: number
  weight: number
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active'
  healthGoals: string[]
  medicalConditions: string[]
  medications: string[]
  createdAt: Date
  updatedAt: Date
}

export interface AIInsight {
  id: string
  userId: string
  type: 'recommendation' | 'alert' | 'achievement' | 'trend'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  category: 'fitness' | 'nutrition' | 'sleep' | 'mental_health' | 'medical'
  actionable: boolean
  actions?: string[]
  createdAt: Date
  readAt?: Date
}

export interface Device {
  id: string
  name: string
  type: 'fitness_tracker' | 'smart_watch' | 'blood_pressure_monitor' | 'scale' | 'glucose_meter'
  brand: string
  model: string
  isConnected: boolean
  lastSync: Date
  batteryLevel?: number
}

export interface HealthGoal {
  id: string
  userId: string
  type: 'weight_loss' | 'weight_gain' | 'fitness' | 'nutrition' | 'sleep' | 'custom'
  title: string
  description: string
  targetValue: number
  currentValue: number
  unit: string
  deadline: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}