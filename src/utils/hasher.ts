import bcrypt from 'bcrypt';

export const hasher = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

export const verifyHash = async (
  data: string,
  encrypted: string
): Promise<boolean> => {
  return await bcrypt.compare(data, encrypted);
};
