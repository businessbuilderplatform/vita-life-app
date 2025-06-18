"use client"

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const benefits = [
  "Free 30-day trial",
  "No setup fees",
  "Cancel anytime",
  "24/7 support"
]

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-medical-600 via-medical-700 to-health-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10" />
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Health?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already started their journey to better health with our AI-powered platform.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center text-white/90"
              >
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <span>{benefit}</span>
              </motion.div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-medical-600 hover:bg-gray-100 text-lg px-8 py-4 group"
              asChild
            >
              <Link href="/dashboard">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-medical-600 text-lg px-8 py-4"
              asChild
            >
              <Link href="/contact">
                Contact Sales
              </Link>
            </Button>
          </div>
          
          <p className="text-white/70 text-sm mt-6">
            No credit card required • HIPAA compliant • Enterprise-grade security
          </p>
        </motion.div>
      </div>
    </section>
  )
}