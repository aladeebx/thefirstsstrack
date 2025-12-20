import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateTrackingNumber } from '@/lib/tracking';

// GET shipment by tracking number with userId filter (public, no auth required)
// This endpoint ensures customers can only see shipments from their company
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingNumber = searchParams.get('trackingNumber');
    const userId = searchParams.get('userId');

    // Validate required parameters
    if (!trackingNumber) {
      return NextResponse.json(
        { error: 'Tracking number is required' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Validate tracking number format
    if (!validateTrackingNumber(trackingNumber)) {
      return NextResponse.json(
        { error: 'Invalid tracking number format' },
        { status: 400 }
      );
    }

    // Find shipment with BOTH trackingNumber AND userId
    // This ensures customers can only see shipments from their company
    const shipment = await prisma.shipment.findFirst({
      where: {
        trackingNumber,
        userId, // Critical: Filter by userId to isolate companies
      },
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
        { error: 'Shipment not found. Please check your tracking number and try again.' },
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

