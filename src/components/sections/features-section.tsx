"use client"

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Brain, 
  Heart, 
  Shield, 
  Smartphone, 
  TrendingUp, 
  Users,
  Zap,
  Clock,
  Globe
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: "AI Health Insights",
    description: "Get personalized health recommendations powered by advanced machine learning algorithms.",
    color: "text-purple-600"
  },
  {
    icon: Heart,
    title: "Real-time Monitoring",
    description: "Track your vital signs and health metrics in real-time with connected devices.",
    color: "text-red-600"
  },
  {
    icon: Shield,
    title: "HIPAA Compliant",
    description: "Your health data is protected with enterprise-grade security and privacy measures.",
    color: "text-green-600"
  },
  {
    icon: Smartphone,
    title: "Wearable Integration",
    description: "Seamlessly connect with popular fitness trackers and health monitoring devices.",
    color: "text-blue-600"
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Visualize your health journey with detailed analytics and progress reports.",
    color: "text-orange-600"
  },
  {
    icon: Users,
    title: "Expert Network",
    description: "Connect with healthcare professionals and wellness experts for guidance.",
    color: "text-indigo-600"
  },
  {
    icon: Zap,
    title: "Instant Alerts",
    description: "Receive immediate notifications for important health changes or milestones.",
    color: "text-yellow-600"
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Access AI-powered health assistance and emergency support around the clock.",
    color: "text-pink-600"
  },
  {
    icon: Globe,
    title: "Multi-language",
    description: "Available in multiple languages to serve users worldwide.",
    color: "text-teal-600"
  }
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Health Management
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover powerful features designed to transform your health journey with cutting-edge technology and personalized care.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}