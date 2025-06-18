"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Footprints, Moon, Droplets } from 'lucide-react'
import { motion } from 'framer-motion'

const activities = [
  {
    type: 'Heart Rate',
    value: '72 BPM',
    time: '2 minutes ago',
    icon: Heart,
    color: 'text-red-500'
  },
  {
    type: 'Steps',
    value: '1,234 steps',
    time: '15 minutes ago',
    icon: Footprints,
    color: 'text-blue-500'
  },
  {
    type: 'Sleep',
    value: '7h 45m',
    time: '8 hours ago',
    icon: Moon,
    color: 'text-purple-500'
  },
  {
    type: 'Water Intake',
    value: '500ml',
    time: '1 hour ago',
    icon: Droplets,
    color: 'text-cyan-500'
  }
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.type}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex-shrink-0">
              <activity.icon className={`h-5 w-5 ${activity.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {activity.type}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {activity.value}
              </div>
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500">
              {activity.time}
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}