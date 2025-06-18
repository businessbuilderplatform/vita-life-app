"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

const stats = [
  { number: 50000, suffix: '+', label: 'Active Users', description: 'Trust our platform daily' },
  { number: 98, suffix: '%', label: 'Satisfaction Rate', description: 'User approval rating' },
  { number: 24, suffix: '/7', label: 'AI Support', description: 'Always available assistance' },
  { number: 150, suffix: '+', label: 'Health Metrics', description: 'Tracked parameters' },
]

function AnimatedNumber({ number, suffix }: { number: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const timer = setInterval(() => {
        setCount((prev) => {
          if (prev < number) {
            return Math.min(prev + Math.ceil(number / 50), number)
          }
          return number
        })
      }, 50)

      return () => clearInterval(timer)
    }
  }, [isInView, number])

  return (
    <span ref={ref} className="text-4xl sm:text-5xl font-bold text-white">
      {count.toLocaleString()}{suffix}
    </span>
  )
}

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-medical-600 to-health-600">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Trusted by Thousands Worldwide
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Join a growing community of health-conscious individuals who have transformed their lives with Vita-Life.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
                <AnimatedNumber number={stat.number} suffix={stat.suffix} />
                <h3 className="text-xl font-semibold text-white mt-4 mb-2">
                  {stat.label}
                </h3>
                <p className="text-white/80">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}