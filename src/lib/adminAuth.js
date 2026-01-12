// Admin Authentication Helper
// Simple admin check - you can make this more sophisticated with database roles

const ADMIN_EMAILS = [
  'nandhakumarkb2005@gmail.com',
  'adnanshoeb007@gmail.com'  
  // Add more admin emails here
]

export const isAdmin = (email) => {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

export const checkAdminAccess = (user) => {
  if (!user || !user.email) {
    throw new Error('You must be logged in to access admin panel')
  }
  
  if (!isAdmin(user.email)) {
    throw new Error('You do not have admin privileges')
  }
  
  return true
}
