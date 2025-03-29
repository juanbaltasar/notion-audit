import * as crypto from 'crypto';

// Configuration for the encryption algorithm
const algorithm = 'aes-256-ctr';
// This key should be stored securely, not in the source code
const secretKey = process.env.ENCRYPTION_KEY || 'defaultEncryptionKey12345678901234567890';

// Make sure the key is the right length for AES-256 (32 bytes)
const getKey = (): Buffer => {
  return crypto.createHash('sha256').update(String(secretKey)).digest();
};

// Encrypt function
const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

// Decrypt function
const decrypt = (hash: string): string => {
  try {
    const [iv, content] = hash.split(':');
    
    if (!iv || !content) {
      throw new Error('Invalid encrypted string format');
    }
    
    const decipher = crypto.createDecipheriv(
      algorithm, 
      getKey(), 
      Buffer.from(iv, 'hex')
    );
    
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(content, 'hex')), 
      decipher.final()
    ]);
    
    return decrypted.toString();
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt the string');
  }
};

export { encrypt, decrypt };
