import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get statistics
    const [
      totalCustomers,
      totalShipments,
      activeShipments,
      deliveredShipments,
      pendingShipments,
      recentShipments,
    ] = await Promise.all([
      prisma.customer.count({
        where: { userId: currentUser.userId },
      }),
      prisma.shipment.count({
        where: { userId: currentUser.userId },
      }),
      prisma.shipment.count({
        where: {
          userId: currentUser.userId,
          status: { in: ['PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'] },
        },
      }),
      prisma.shipment.count({
        where: {
          userId: currentUser.userId,
          status: 'DELIVERED',
        },
      }),
      prisma.shipment.count({
        where: {
          userId: currentUser.userId,
          status: 'PENDING',
        },
      }),
      prisma.shipment.findMany({
        where: { userId: currentUser.userId },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalCustomers,
        totalShipments,
        activeShipments,
        deliveredShipments,
        pendingShipments,
      },
      recentShipments,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}

