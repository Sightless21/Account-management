// Function to generate a random password with customizable options
export function generatePassword(length: number = 12): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = uppercase + lowercase + numbers + special;
  
  // Ensure at least one character from each category
  const getRandomChar = (str: string) => str[Math.floor(Math.random() * str.length)];
  
  const password = [
    getRandomChar(uppercase),
    getRandomChar(lowercase),
    getRandomChar(numbers),
    getRandomChar(special),
  ];
  
  // Fill the rest of the password length with random characters
  for (let i = password.length; i < length; i++) {
    password.push(getRandomChar(allChars));
  }
  
  // Shuffle the password array
  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [password[i], password[j]] = [password[j], password[i]];
  }
  
  return password.join('');
}

// Optional: Function with customizable options
interface PasswordOptions {
  length?: number;
  includeUppercase?: boolean;
  includeLowercase?: boolean;
  includeNumbers?: boolean;
  includeSpecial?: boolean;
}

export function generateCustomPassword(options: PasswordOptions = {}): string {
  const {
    length = 6,
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSpecial = true,
  } = options;

  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let availableChars = '';
  const password = [];

  const getRandomChar = (str: string) => str[Math.floor(Math.random() * str.length)];

  // Build available characters and ensure at least one of each required type
  if (includeUppercase) {
    availableChars += uppercase;
    password.push(getRandomChar(uppercase));
  }
  if (includeLowercase) {
    availableChars += lowercase;
    password.push(getRandomChar(lowercase));
  }
  if (includeNumbers) {
    availableChars += numbers;
    password.push(getRandomChar(numbers));
  }
  if (includeSpecial) {
    availableChars += special;
    password.push(getRandomChar(special));
  }

  // Fill remaining length
  for (let i = password.length; i < length; i++) {
    password.push(getRandomChar(availableChars));
  }

  // Shuffle
  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [password[i], password[j]] = [password[j], password[i]];
  }

  return password.join('');
}