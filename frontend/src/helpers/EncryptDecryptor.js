import CryptoJS from 'crypto-js';

const SECRET_KEY = 'technodynamicV2-ACCESS_KEY';

// Function to encrypt a value
export const encryptValue = (value) => {
  // Encrypt the value using AES encryption
  const ciphertext = CryptoJS.AES.encrypt(
    value.toString(),
    SECRET_KEY
  ).toString();
  return ciphertext;
};

// Function to decrypt a value
export const decryptValue = (encryptedValue) => {
  try {
    // Decrypt the value using AES decryption
    const bytes = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  } catch (error) {
    console.error('Decryption failed:', error);
    return null; // Return null if decryption fails
  }
};
