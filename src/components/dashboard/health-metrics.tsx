"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Activity, Moon, Footprints } from 'lucide-react'
import { motion } from 'framer-motion'

const metrics = [
  {
    title: 'Heart Rate',
    value: '72',
    unit: 'BPM',
    change: '+2%',
    icon: Heart,
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-900/20'
  },
  {
    title: 'Steps Today',
    value: '8,432',
    unit: 'steps',
    change: '+15%',
    icon: Footprints,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20'
  },
  {
    title: 'Sleep Quality',
    value: '85',
    unit: '%',
    change: '+5%',
    icon: Moon,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20'
  },
  {
    title: 'Activity Score',
    value: '92',
    unit: 'points',
    change: '+8%',
    icon: Activity,
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20'
  }
]

export function HealthMetrics() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Today's Metrics
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="metric-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {metric.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline space-x-2">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {metric.unit}
                  </div>
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                  {metric.change} from yesterday
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}