import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { canAddShipment } from '@/lib/plans';
import { generateTrackingNumber } from '@/lib/tracking';

export const dynamic = 'force-dynamic';

// GET all shipments for current user
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const customerId = searchParams.get('customerId') || '';
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: any = {
      userId: currentUser.userId,
      ...(status && { status }),
      ...(customerId && { customerId }),
      ...(search && {
        OR: [
          { trackingNumber: { contains: search, mode: 'insensitive' as const } },
          { origin: { contains: search, mode: 'insensitive' as const } },
          { destination: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [shipments, total] = await Promise.all([
      prisma.shipment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            },
          },
        },
      }),
      prisma.shipment.count({ where }),
    ]);

    return NextResponse.json({
      shipments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get shipments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shipments' },
      { status: 500 }
    );
  }
}

// POST create new shipment
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { customerId, origin, destination, estimatedDelivery, notes } = body;

    // Validate required fields
    if (!customerId || !origin || !destination) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify customer belongs to user
    const customer = await prisma.customer.findFirst({
      where: {
        id: customerId,
        userId: currentUser.userId,
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Check plan limits
    const shipmentCount = await prisma.shipment.count({
      where: { userId: currentUser.userId },
    });

    if (!canAddShipment(currentUser.plan as 'FREE' | 'BASIC' | 'PRO', shipmentCount)) {
      return NextResponse.json(
        { error: 'Shipment limit reached for your plan' },
        { status: 403 }
      );
    }

    // Generate unique tracking number
    let trackingNumber = generateTrackingNumber();
    let exists = await prisma.shipment.findUnique({
      where: { trackingNumber },
    });

    // Regenerate if duplicate (very unlikely)
    while (exists) {
      trackingNumber = generateTrackingNumber();
      exists = await prisma.shipment.findUnique({
        where: { trackingNumber },
      });
    }

    // Create initial timeline entry
    const timeline = [
      {
        status: 'PENDING',
        timestamp: new Date().toISOString(),
        location: origin,
        description: 'Shipment created',
      },
    ];

    // Create shipment
    const shipment = await prisma.shipment.create({
      data: {
        userId: currentUser.userId,
        customerId,
        trackingNumber,
        origin,
        destination,
        currentLocation: origin,
        status: 'PENDING',
        estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : null,
        notes: notes || null,
        timeline,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ shipment }, { status: 201 });
  } catch (error) {
    console.error('Create shipment error:', error);
    return NextResponse.json(
      { error: 'Failed to create shipment' },
      { status: 500 }
    );
  }
}

