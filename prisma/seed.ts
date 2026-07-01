import { prisma } from '../src/lib/prisma'; 
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Начало сидирования базы данных...');

  const adminLogin = 'Manager'; 
  const rawPassword = 'Dragon851171!';

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(rawPassword, salt);

  await prisma.admin_users.upsert({
    where: { login: adminLogin },
    update: {},
    create: {
      login: adminLogin,
      password: hashedPassword,
    },
  });

  console.log(`✅ Администратор "${adminLogin}" успешно создан/проверен.`);
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при сидировании:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });