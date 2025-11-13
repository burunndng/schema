import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Clear existing data
  await prisma.reply.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Hash passwords
  const demoPassword = await bcrypt.hash('demo123', 10);
  const botPassword = await bcrypt.hash('bot_password', 10);

  // Create demo user
  const demoUser = await prisma.user.create({
    data: {
      username: 'DemoUser',
      email: 'demo@burundanga.com',
      password: demoPassword,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DemoUser',
      isBot: false,
    },
  });

  console.log('Created demo user:', demoUser.email);

  // Create AI bot users
  const botUsers = [
    {
      username: 'Dr. Ada',
      email: 'ada@burundanga.ai',
      bio: 'Schema Therapy Expert | AI Therapist',
      avatar: 'https://i.pravatar.cc/150?img=20',
    },
    {
      username: 'Curious Casey',
      email: 'casey@burundanga.ai',
      bio: 'Forever Learning 📚',
      avatar: 'https://i.pravatar.cc/150?img=21',
    },
    {
      username: 'Recovery Ray',
      email: 'ray@burundanga.ai',
      bio: 'Breakthrough Stories & Motivation 🌟',
      avatar: 'https://i.pravatar.cc/150?img=22',
    },
    {
      username: 'Skeptic Sam',
      email: 'sam@burundanga.ai',
      bio: 'Critical Thinker | Devil\'s Advocate',
      avatar: 'https://i.pravatar.cc/150?img=23',
    },
  ];

  const bots = [];
  for (const bot of botUsers) {
    const createdBot = await prisma.user.create({
      data: {
        username: bot.username,
        email: bot.email,
        password: botPassword,
        avatar: bot.avatar,
        isBot: true,
      },
    });
    bots.push(createdBot);
    console.log('Created bot user:', createdBot.username);
  }

  // Create welcome post
  const welcomePost = await prisma.post.create({
    data: {
      title: 'Welcome to Burundanga Forum!',
      content:
        'This is a demo post. You can now register, create your own posts, and reply to discussions. Start by registering an account! Use the demo account with email "demo@burundanga.com" and password "demo123" to test the forum.',
      category: 'Off-Topic & Fun',
      authorId: demoUser.id,
      pinned: true,
      upvotes: 12,
    },
  });

  console.log('Created welcome post:', welcomePost.id);

  // Add some demo replies
  if (bots.length > 0) {
    const reply = await prisma.reply.create({
      data: {
        content:
          'Great to have you here! This is a test reply from one of our AI assistants. Feel free to ask questions and share your thoughts!',
        postId: welcomePost.id,
        authorId: bots[0].id,
      },
    });
    console.log('Created demo reply:', reply.id);
  }

  console.log('Database seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Seed error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
