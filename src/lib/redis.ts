import { createClient } from 'redis'

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
})

client.on('error', (err) => {
  console.error('Redis Client Error:', err)
})

export async function connectToRedis() {
  if (!client.isOpen) {
    await client.connect()
  }
  return client
}

export async function setCache(key: string, value: any, ttl: number = 3600) {
  try {
    const redis = await connectToRedis()
    await redis.setEx(key, ttl, JSON.stringify(value))
  } catch (error) {
    console.error('Redis set error:', error)
  }
}

export async function getCache(key: string) {
  try {
    const redis = await connectToRedis()
    const value = await redis.get(key)
    return value ? JSON.parse(value) : null
  } catch (error) {
    console.error('Redis get error:', error)
    return null
  }
}

export async function deleteCache(key: string) {
  try {
    const redis = await connectToRedis()
    await redis.del(key)
  } catch (error) {
    console.error('Redis delete error:', error)
  }
}

export default client