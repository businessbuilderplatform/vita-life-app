import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateHealthInsight(
  userProfile: any,
  healthMetrics: any[]
): Promise<string> {
  try {
    const prompt = `
      Based on the following user profile and health metrics, provide a personalized health insight:
      
      User Profile:
      - Age: ${userProfile.age}
      - Gender: ${userProfile.gender}
      - Activity Level: ${userProfile.activityLevel}
      - Health Goals: ${userProfile.healthGoals.join(', ')}
      
      Recent Health Metrics:
      ${healthMetrics.map(metric => 
        `- ${metric.type}: ${metric.value} ${metric.unit} (${metric.timestamp})`
      ).join('\n')}
      
      Please provide a concise, actionable health insight (max 150 words) that:
      1. Identifies trends or patterns
      2. Provides specific recommendations
      3. Encourages positive health behaviors
      4. Is medically sound but not diagnostic
    `

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful health and wellness AI assistant. Provide evidence-based, non-diagnostic health insights and recommendations.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    })

    return completion.choices[0]?.message?.content || 'Unable to generate insight at this time.'
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw new Error('Failed to generate health insight')
  }
}

export async function analyzeHealthTrends(metrics: any[]): Promise<any> {
  try {
    const prompt = `
      Analyze the following health metrics and identify trends:
      
      ${metrics.map(metric => 
        `${metric.type}: ${metric.value} ${metric.unit} on ${metric.timestamp}`
      ).join('\n')}
      
      Provide a JSON response with:
      {
        "trends": [
          {
            "metric": "metric_name",
            "direction": "increasing|decreasing|stable",
            "confidence": "high|medium|low",
            "significance": "description"
          }
        ],
        "recommendations": ["recommendation1", "recommendation2"]
      }
    `

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a health data analyst. Analyze trends and provide structured JSON responses.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.3,
    })

    const response = completion.choices[0]?.message?.content
    return response ? JSON.parse(response) : null
  } catch (error) {
    console.error('OpenAI trend analysis error:', error)
    return null
  }
}

export default openai