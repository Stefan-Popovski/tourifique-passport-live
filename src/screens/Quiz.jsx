import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import OnboardingFlow from '../components/onboarding'
import { useStore } from '../store/useStore'
import { generateProfile } from '../lib/generateProfile'

const CONTENT_TYPE = {
  'Travel vlogs': 'reels',
  'Food reviews': 'food',
  'Hotel/luxury stays': 'lifestyle',
  'Culture/history content': 'documentary',
  'Adventure content': 'documentary',
  'Lifestyle content': 'lifestyle',
}

const TRAVEL_STYLE = {
  'Budget explorer': 'budget',
  'Luxury traveler': 'luxury',
  'Hidden-gems hunter': 'culture',
  'Food lover': 'culture',
  'Culture explorer': 'culture',
  'Adventure seeker': 'adventure',
}

const TRAVEL_VIBE = {
  'Beautiful hotels': 'luxury',
  'Delicious food': 'food',
  'Hidden places': 'culture',
  'Adventure videos': 'adventure',
  'Local culture': 'culture',
  'Luxury experiences': 'luxury',
  'Funny travel moments': 'lifestyle',
}

function toProfileAnswers(answers) {
  return {
    contentType: CONTENT_TYPE[answers.q1] || 'reels',
    dreamDestination: answers.q2 || 'Anywhere / surprise me',
    travelStyle: TRAVEL_STYLE[answers.q3] || 'culture',
    platform: answers.q4 || 'TikTok',
    travelVibe: TRAVEL_VIBE[answers.q5] || answers.q5 || 'culture',
  }
}

export default function Quiz() {
  const navigate = useNavigate()
  const { user, setUser, addPoints } = useStore()

  const handleComplete = useCallback((answers) => {
    const profileAnswers = toProfileAnswers(answers)
    const profile = generateProfile(profileAnswers)

    setUser({
      ...(user || {}),
      quizAnswers: answers,
      profileAnswers,
      profile,
    })
    addPoints(100)
    navigate('/reveal')
  }, [addPoints, navigate, setUser, user])

  return (
    <OnboardingFlow
      fullScreen
      storageKey="tourifique.passport.quiz"
      onComplete={handleComplete}
    />
  )
}
