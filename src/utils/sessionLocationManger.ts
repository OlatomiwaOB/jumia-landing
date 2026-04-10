// utils/sessionLocationManager.ts
interface SessionLocationData {
  hasDetectedThisSession: boolean
  sessionId: string
  detectionTimestamp?: number
}

export class SessionLocationManager {
  private static SESSION_KEY = 'location-session-data'
  private static sessionId: string

  static {
    // Generate a unique session ID when the class is first loaded
    this.sessionId = this.generateSessionId()
  }

  private static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  static shouldDetectLocation(): boolean {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
      return true // Default to detecting on server-side or when sessionStorage isn't available
    }
    
    try {
      const storedData = sessionStorage.getItem(this.SESSION_KEY)
      
      if (!storedData) {
        return true // No session data, should detect
      }

      const sessionData: SessionLocationData = JSON.parse(storedData)
      
      // If the session ID is different, it's a new session
      if (sessionData.sessionId !== this.sessionId) {
        this.clearSessionData()
        return true
      }

      // If already detected in this session, don't detect again
      return !sessionData.hasDetectedThisSession
    } catch (error) {
      console.warn('Error reading session data:', error)
      return true
    }
  }

  static markAsDetected(): void {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
      return // Can't store data on server-side
    }

    try {
      const sessionData: SessionLocationData = {
        hasDetectedThisSession: true,
        sessionId: this.sessionId,
        detectionTimestamp: Date.now(),
      }
      
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData))
    } catch (error) {
      console.warn('Error storing session data:', error)
    }
  }

  static clearSessionData(): void {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
      return // Can't clear data on server-side
    }

    try {
      sessionStorage.removeItem(this.SESSION_KEY)
    } catch (error) {
      console.warn('Error clearing session data:', error)
    }
  }

  static getSessionInfo(): { sessionId: string; hasDetected: boolean } {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
      return { sessionId: this.sessionId, hasDetected: false }
    }

    try {
      const storedData = sessionStorage.getItem(this.SESSION_KEY)
      
      if (!storedData) {
        return { sessionId: this.sessionId, hasDetected: false }
      }

      const sessionData: SessionLocationData = JSON.parse(storedData)
      
      return {
        sessionId: this.sessionId,
        hasDetected: sessionData.sessionId === this.sessionId && sessionData.hasDetectedThisSession,
      }
    } catch (error) {
      return { sessionId: this.sessionId, hasDetected: false }
    }
  }
}