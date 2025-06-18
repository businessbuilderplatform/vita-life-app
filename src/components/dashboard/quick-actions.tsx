"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, FileText, Settings } from 'lucide-react'
import { motion } from 'framer-motion'

const actions = [
  {
    title: 'Log Health Data',
    description: 'Record new measurements',
    icon: Plus,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20'
  },
  {
    title: 'Schedule Checkup',
    description: 'Book appointment',
    icon: Calendar,
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20'
  },
  {
    title: 'View Reports',
    description: 'Health analytics',
    icon: FileText,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20'
  },
  {
    title: 'Settings',
    description: 'Manage preferences',
    icon: Settings,
    color: 'text-gray-500',
    bgColor: 'bg-gray-50 dark:bg-gray-900/20'
  }
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Button
              variant="ghost"
              className="w-full justify-start h-auto p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <div className={`p-2 rounded-lg ${action.bgColor} mr-3`}>
                <action.icon className={`h-4 w-4 ${action.color}`} />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">
                  {action.title}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {action.description}
                </div>
              </div>
            </Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}