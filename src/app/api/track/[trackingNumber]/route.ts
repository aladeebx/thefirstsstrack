import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateTrackingNumber } from '@/lib/tracking';

// GET shipment by tracking number (public, no auth required)
// Supports optional userId query parameter for company-specific filtering
export async function GET(
  request: NextRequest,
  { params }: { params: { trackingNumber: string } }
) {
  try {
    const { trackingNumber } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Validate tracking number format
    if (!validateTrackingNumber(trackingNumber)) {
      return NextResponse.json(
        { error: 'Invalid tracking number format' },
        { status: 400 }
      );
    }

    // Build where clause - if userId is provided, filter by it
    const whereClause: any = userId 
      ? { trackingNumber, userId }
      : { trackingNumber };

    // Find shipment
    const shipment = await prisma.shipment.findFirst({
      where: whereClause,
      include: {
        customer: {
          select: {
            name: true,
            // Don't expose sensitive customer data
          },
        },
        user: {
          select: {
            companyName: true,
          },
        },
      },
    });

    if (!shipment) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      );
    }

    // Return public tracking information
    return NextResponse.json({
      trackingNumber: shipment.trackingNumber,
      status: shipment.status,
      origin: shipment.origin,
      destination: shipment.destination,
      currentLocation: shipment.currentLocation,
      estimatedDelivery: shipment.estimatedDelivery,
      actualDelivery: shipment.actualDelivery,
      timeline: shipment.timeline,
      customer: {
        name: shipment.customer.name,
      },
      company: {
        name: shipment.user.companyName,
      },
      createdAt: shipment.createdAt,
      updatedAt: shipment.updatedAt,
    });
  } catch (error) {
    console.error('Track shipment error:', error);
    return NextResponse.json(
      { error: 'Failed to track shipment' },
      { status: 500 }
    );
  }
}

