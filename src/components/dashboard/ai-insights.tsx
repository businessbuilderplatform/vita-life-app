"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Brain, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const insights = [
  {
    type: 'recommendation',
    title: 'Optimize Your Sleep Schedule',
    description: 'Your sleep quality has improved by 15% this week. Consider maintaining your current bedtime routine of 10:30 PM for optimal recovery.',
    priority: 'medium',
    icon: Brain,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20'
  },
  {
    type: 'trend',
    title: 'Heart Rate Variability Improving',
    description: 'Your HRV has shown consistent improvement over the past month, indicating better cardiovascular fitness and stress management.',
    priority: 'low',
    icon: TrendingUp,
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20'
  },
  {
    type: 'alert',
    title: 'Hydration Reminder',
    description: 'You\'ve consumed 40% less water than usual today. Consider increasing your fluid intake to maintain optimal hydration.',
    priority: 'high',
    icon: AlertCircle,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20'
  }
]

export function AIInsights() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          AI Health Insights
        </h2>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>
      
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${insight.bgColor}`}>
                      <insight.icon className={`h-5 w-5 ${insight.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
                        {insight.title}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          insight.priority === 'high' 
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                            : insight.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        }`}>
                          {insight.priority} priority
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {insight.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}