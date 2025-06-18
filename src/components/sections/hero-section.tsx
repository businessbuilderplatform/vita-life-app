"use client"

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Heart, Shield, Zap } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-medical-50 via-white to-health-50 py-20 sm:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <div className="flex items-center space-x-2 bg-medical-100 px-4 py-2 rounded-full">
                <Shield className="h-4 w-4 text-medical-600" />
                <span className="text-sm font-medium text-medical-700">HIPAA Compliant</span>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Your AI-Powered
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-600 to-health-600">
                {" "}Health Journey
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              Transform your wellness with personalized AI insights, real-time health monitoring, 
              and expert recommendations tailored just for you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="group" asChild>
                <Link href="/dashboard">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#features">
                  Learn More
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start space-x-8 mt-12">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">98%</div>
                <div className="text-sm text-gray-600">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">AI Support</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Health Dashboard</h3>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-health-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Heart className="h-8 w-8 text-health-600 animate-pulse-health" />
                    <div>
                      <div className="font-semibold text-gray-900">Heart Rate</div>
                      <div className="text-sm text-gray-600">72 BPM</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-health-600 font-medium">Normal</div>
                    <div className="text-xs text-gray-500">+2% from yesterday</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-medical-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Zap className="h-8 w-8 text-medical-600" />
                    <div>
                      <div className="font-semibold text-gray-900">Energy Level</div>
                      <div className="text-sm text-gray-600">85%</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-medical-600 font-medium">Excellent</div>
                    <div className="text-xs text-gray-500">Peak performance</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-medical-500 to-health-500 rounded-lg text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">AI Insight</span>
                </div>
                <p className="text-sm opacity-90">
                  Your sleep quality improved by 15% this week. Consider maintaining your current bedtime routine.
                </p>
              </div>
            </div>
            
            {/* Floating elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-health-500 text-white p-3 rounded-full shadow-lg"
            >
              <Heart className="h-6 w-6" />
            </motion.div>
            
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -bottom-4 -left-4 bg-medical-500 text-white p-3 rounded-full shadow-lg"
            >
              <Zap className="h-6 w-6" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}