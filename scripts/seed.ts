import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../src/models/Product';
import User from '../src/models/User';
import bcrypt from 'bcryptjs';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/g-ecommerce';

const products = [
  {
    name: 'iPhone 15 Pro Max',
    description: 'The ultimate iPhone with titanium design, A17 Pro chip, and advanced camera system. Features a 6.7-inch Super Retina XDR display, ProMotion technology, and all-day battery life.',
    price: 1199.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=500&h=500&fit=crop',
    stock: 50,
    rating: 4.8,
    numReviews: 342,
    brand: 'Apple',
    tags: ['smartphone', '5G', 'premium', 'titanium'],
    isFeatured: true,
  },
  {
    name: 'MacBook Pro 16" M3 Max',
    description: 'Supercharged by M3 Max chip for unprecedented performance. Features a stunning Liquid Retina XDR display, up to 22 hours battery life, and advanced thermal system.',
    price: 3499.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
    stock: 25,
    rating: 4.9,
    numReviews: 189,
    brand: 'Apple',
    tags: ['laptop', 'professional', 'M3', 'creative'],
    isFeatured: true,
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancellation with premium sound quality. Up to 30 hours battery life, crystal clear hands-free calling, and ultra-comfortable design.',
    price: 399.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&h=500&fit=crop',
    stock: 100,
    rating: 4.7,
    numReviews: 521,
    brand: 'Sony',
    tags: ['headphones', 'noise-cancelling', 'wireless', 'premium'],
    isFeatured: true,
  },
  {
    name: 'Nike Air Max 270',
    description: 'The Air Max 270 delivers visible cushioning under every step. Features a stretchy inner sleeve for a snug fit, foam midsole for responsive cushioning.',
    price: 149.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    stock: 200,
    rating: 4.5,
    numReviews: 892,
    brand: 'Nike',
    tags: ['sneakers', 'running', 'casual', 'comfortable'],
    isFeatured: true,
  },
  {
    name: 'Atomic Habits by James Clear',
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving every day. Learn how tiny changes can lead to remarkable results.',
    price: 16.99,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&h=500&fit=crop',
    stock: 500,
    rating: 4.9,
    numReviews: 15420,
    brand: 'Penguin Random House',
    tags: ['self-help', 'productivity', 'bestseller', 'psychology'],
    isFeatured: true,
  },
  {
    name: 'Modern Sofa Set',
    description: 'Contemporary 3-seater sofa with premium fabric upholstery. Features high-density foam cushions, solid wood frame, and modern design that complements any living room.',
    price: 899.99,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop',
    stock: 15,
    rating: 4.6,
    numReviews: 78,
    brand: 'HomeStyle',
    tags: ['furniture', 'living room', 'modern', 'comfortable'],
    isFeatured: false,
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Extra thick 6mm yoga mat with non-slip surface. Perfect for yoga, pilates, and floor exercises. Includes carrying strap for easy transport.',
    price: 39.99,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop',
    stock: 150,
    rating: 4.4,
    numReviews: 234,
    brand: 'FitLife',
    tags: ['yoga', 'fitness', 'exercise', 'mat'],
    isFeatured: false,
  },
  {
    name: 'LEGO Star Wars Millennium Falcon',
    description: 'Build and display the ultimate LEGO Star Wars collectible. This detailed model features 1,351 pieces, rotating gun turrets, removable canopy, and minifigures.',
    price: 169.99,
    category: 'Toys',
    image: 'https://images.unsplash.com/photo-1585366119957-e9730b6e0f9b?w=500&h=500&fit=crop',
    stock: 45,
    rating: 4.8,
    numReviews: 567,
    brand: 'LEGO',
    tags: ['building', 'star wars', 'collectible', 'kids'],
    isFeatured: false,
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'The ultimate Galaxy experience with Galaxy AI. Features a 200MP camera, S Pen, titanium frame, and the brightest Galaxy display ever.',
    price: 1299.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&h=500&fit=crop',
    stock: 60,
    rating: 4.7,
    numReviews: 289,
    brand: 'Samsung',
    tags: ['smartphone', '5G', 'android', 'premium'],
    isFeatured: true,
  },
  {
    name: 'Adidas Ultraboost 23',
    description: 'Experience incredible energy return with every stride. Features BOOST cushioning, Primeknit+ upper, and Continental rubber outsole for exceptional grip.',
    price: 189.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&h=500&fit=crop',
    stock: 120,
    rating: 4.6,
    numReviews: 445,
    brand: 'Adidas',
    tags: ['running', 'sneakers', 'performance', 'comfortable'],
    isFeatured: false,
  },
  {
    name: 'The Psychology of Money',
    description: 'Timeless lessons on wealth, greed, and happiness. Morgan Housel explores the strange ways people think about money and teaches you how to make better financial decisions.',
    price: 18.99,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=500&h=500&fit=crop',
    stock: 300,
    rating: 4.8,
    numReviews: 8934,
    brand: 'Harriman House',
    tags: ['finance', 'psychology', 'investing', 'bestseller'],
    isFeatured: false,
  },
  {
    name: 'Smart LED Desk Lamp',
    description: 'Adjustable LED desk lamp with wireless charging base. Features multiple brightness levels, color temperature control, and USB charging port.',
    price: 59.99,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1534239697880-805a087bb37f?w=500&h=500&fit=crop',
    stock: 80,
    rating: 4.3,
    numReviews: 156,
    brand: 'TechLight',
    tags: ['lighting', 'smart home', 'desk', 'LED'],
    isFeatured: false,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert products
    await Product.insertMany(products);
    console.log(`✅ Inserted ${products.length} products`);

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin User',
      email: 'admin@gstore.com',
      password: adminPassword,
      role: 'admin',
    });
    console.log('✅ Created admin user (admin@gstore.com / admin123)');

    // Create demo user
    const userPassword = await bcrypt.hash('user123', 10);
    await User.create({
      name: 'Demo User',
      email: 'user@gstore.com',
      password: userPassword,
      role: 'user',
    });
    console.log('✅ Created demo user (user@gstore.com / user123)');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Login credentials:');
    console.log('   Admin: admin@gstore.com / admin123');
    console.log('   User:  user@gstore.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
