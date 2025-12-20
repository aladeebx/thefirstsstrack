const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.shipment.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Cleared existing data');

  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.create({
    data: {
      email: 'demo@trakoship.com',
      password: hashedPassword,
      companyName: 'TrakoShip Demo Company',
      plan: 'FREE',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'pro@trakoship.com',
      password: hashedPassword,
      companyName: 'Pro Shipping Solutions',
      plan: 'PRO',
    },
  });

  console.log('✅ Created test users');
  console.log('   - demo@trakoship.com (password: password123)');
  console.log('   - pro@trakoship.com (password: password123)');

  // Create customers for user1
  const customer1 = await prisma.customer.create({
    data: {
      userId: user1.id,
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1-555-0101',
      address: '123 Main Street, New York, NY 10001',
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      userId: user1.id,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1-555-0102',
      address: '456 Oak Avenue, Los Angeles, CA 90001',
    },
  });

  const customer3 = await prisma.customer.create({
    data: {
      userId: user1.id,
      name: 'Ahmed Ali',
      email: 'ahmed.ali@example.com',
      phone: '+971-50-123-4567',
      address: 'Dubai Marina, Dubai, UAE',
    },
  });

  console.log('✅ Created customers');

  // Create shipments
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const futureDate = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

  await prisma.shipment.create({
    data: {
      trackingNumber: 'TKS-ABC12345',
      userId: user1.id,
      customerId: customer1.id,
      status: 'DELIVERED',
      origin: 'New York, NY',
      destination: 'Boston, MA',
      currentLocation: 'Boston Distribution Center',
      estimatedDelivery: yesterday,
      actualDelivery: yesterday,
      notes: 'Fragile items - Handle with care',
      timeline: [
        {
          status: 'PENDING',
          timestamp: threeDaysAgo.toISOString(),
          location: 'New York Warehouse',
          description: 'Shipment created and awaiting pickup',
        },
        {
          status: 'PICKED_UP',
          timestamp: twoDaysAgo.toISOString(),
          location: 'New York Warehouse',
          description: 'Package picked up by carrier',
        },
        {
          status: 'IN_TRANSIT',
          timestamp: yesterday.toISOString(),
          location: 'En route to Boston',
          description: 'Package in transit',
        },
        {
          status: 'DELIVERED',
          timestamp: yesterday.toISOString(),
          location: 'Boston, MA',
          description: 'Package delivered successfully',
        },
      ],
    },
  });

  await prisma.shipment.create({
    data: {
      trackingNumber: 'TKS-XYZ67890',
      userId: user1.id,
      customerId: customer2.id,
      status: 'IN_TRANSIT',
      origin: 'Los Angeles, CA',
      destination: 'San Francisco, CA',
      currentLocation: 'Fresno Distribution Center',
      estimatedDelivery: futureDate,
      notes: 'Express delivery',
      timeline: [
        {
          status: 'PENDING',
          timestamp: yesterday.toISOString(),
          location: 'Los Angeles Warehouse',
          description: 'Shipment created',
        },
        {
          status: 'PICKED_UP',
          timestamp: yesterday.toISOString(),
          location: 'Los Angeles Warehouse',
          description: 'Package picked up',
        },
        {
          status: 'IN_TRANSIT',
          timestamp: now.toISOString(),
          location: 'Fresno Distribution Center',
          description: 'Package in transit to destination',
        },
      ],
    },
  });

  await prisma.shipment.create({
    data: {
      trackingNumber: 'TKS-DEF54321',
      userId: user1.id,
      customerId: customer3.id,
      status: 'PENDING',
      origin: 'Dubai, UAE',
      destination: 'Abu Dhabi, UAE',
      currentLocation: 'Dubai Warehouse',
      estimatedDelivery: futureDate,
      timeline: [
        {
          status: 'PENDING',
          timestamp: now.toISOString(),
          location: 'Dubai Warehouse',
          description: 'Shipment created and ready for pickup',
        },
      ],
    },
  });

  await prisma.shipment.create({
    data: {
      trackingNumber: 'TKS-GHI98765',
      userId: user1.id,
      customerId: customer1.id,
      status: 'OUT_FOR_DELIVERY',
      origin: 'Chicago, IL',
      destination: 'New York, NY',
      currentLocation: 'New York Distribution Center',
      estimatedDelivery: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
      timeline: [
        {
          status: 'PENDING',
          timestamp: twoDaysAgo.toISOString(),
          location: 'Chicago Warehouse',
          description: 'Shipment created',
        },
        {
          status: 'PICKED_UP',
          timestamp: yesterday.toISOString(),
          location: 'Chicago Warehouse',
          description: 'Package picked up',
        },
        {
          status: 'IN_TRANSIT',
          timestamp: yesterday.toISOString(),
          location: 'En route to New York',
          description: 'Package in transit',
        },
        {
          status: 'OUT_FOR_DELIVERY',
          timestamp: now.toISOString(),
          location: 'New York Distribution Center',
          description: 'Out for delivery - arriving today',
        },
      ],
    },
  });

  console.log('✅ Created shipments with tracking numbers:');
  console.log('   - TKS-ABC12345 (Delivered)');
  console.log('   - TKS-XYZ67890 (In Transit)');
  console.log('   - TKS-DEF54321 (Pending)');
  console.log('   - TKS-GHI98765 (Out for Delivery)');

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📝 You can now login with:');
  console.log('   Email: demo@trakoship.com');
  console.log('   Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

