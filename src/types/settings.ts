export type SettingsPage = "profile" | "display" | "security"

export interface ProfileFormData {
  username: string
  email: string
  bio: string
}

export interface DisplayFormData {
  theme: "light" | "dark" 
  denseMode: boolean
  showAvatars: boolean
  showStatus: boolean
}

export interface SecurityFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
  twoFactorEnabled: boolean
}

