import { hashPassword, comparePassword } from '../src/utils/password';

describe('password utils', () => {
  it('hashes and verifies a password correctly', async () => {
    const plain = 'SuperSecret123';
    const hashed = await hashPassword(plain);

    expect(hashed).not.toBe(plain);
    await expect(comparePassword(plain, hashed)).resolves.toBe(true);
    await expect(comparePassword('WrongPassword', hashed)).resolves.toBe(false);
  });
});
