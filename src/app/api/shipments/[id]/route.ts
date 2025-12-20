import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// GET single shipment
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const shipment = await prisma.shipment.findFirst({
      where: {
        id: params.id,
        userId: currentUser.userId,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            address: true,
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

    return NextResponse.json({ shipment });
  } catch (error) {
    console.error('Get shipment error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shipment' },
      { status: 500 }
    );
  }
}

// PATCH update shipment
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Check if shipment exists and belongs to user
    const existingShipment = await prisma.shipment.findFirst({
      where: {
        id: params.id,
        userId: currentUser.userId,
      },
    });

    if (!existingShipment) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { status, currentLocation, notes, estimatedDelivery } = body;

    // Prepare update data
    const updateData: any = {
      ...(notes !== undefined && { notes }),
      ...(estimatedDelivery !== undefined && { 
        estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : null 
      }),
    };

    // If status is being updated, add to timeline
    if (status && status !== existingShipment.status) {
      const timeline = Array.isArray(existingShipment.timeline) 
        ? existingShipment.timeline 
        : [];
      
      timeline.push({
        status,
        timestamp: new Date().toISOString(),
        location: currentLocation || existingShipment.currentLocation || '',
        description: `Status updated to ${status}`,
      });

      updateData.status = status;
      updateData.timeline = timeline;

      // Set actualDelivery if status is DELIVERED
      if (status === 'DELIVERED') {
        updateData.actualDelivery = new Date();
      }
    }

    if (currentLocation) {
      updateData.currentLocation = currentLocation;
    }

    // Update shipment
    const shipment = await prisma.shipment.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json({ shipment });
  } catch (error) {
    console.error('Update shipment error:', error);
    return NextResponse.json(
      { error: 'Failed to update shipment' },
      { status: 500 }
    );
  }
}

// DELETE shipment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Check if shipment exists and belongs to user
    const existingShipment = await prisma.shipment.findFirst({
      where: {
        id: params.id,
        userId: currentUser.userId,
      },
    });

    if (!existingShipment) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      );
    }

    // Delete shipment
    await prisma.shipment.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete shipment error:', error);
    return NextResponse.json(
      { error: 'Failed to delete shipment' },
      { status: 500 }
    );
  }
}

