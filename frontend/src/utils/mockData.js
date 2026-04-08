export const mockStudent = {
  id: 'a1b2c3d4-0000-0000-0000-000000000001',
  registrationNumber: 'CS/2022/0147',
  firstName: 'Amara',
  lastName: 'Osei',
  email: 'amara.osei@university.ac.ke',
};

export const mockExamUnits = [
  {
    id: 'unit-0001',
    unitCode: 'CS 201',
    unitTitle: 'Data Structures & Algorithms',
    standardFee: 3500,
  },
  {
    id: 'unit-0002',
    unitCode: 'CS 301',
    unitTitle: 'Database Systems',
    standardFee: 3500,
  },
  {
    id: 'unit-0003',
    unitCode: 'CS 302',
    unitTitle: 'Operating Systems',
    standardFee: 3500,
  },
  {
    id: 'unit-0004',
    unitCode: 'MATH 201',
    unitTitle: 'Calculus & Linear Algebra',
    standardFee: 3000,
  },
  {
    id: 'unit-0005',
    unitCode: 'CS 401',
    unitTitle: 'Computer Networks',
    standardFee: 3500,
  },
  {
    id: 'unit-0006',
    unitCode: 'CS 402',
    unitTitle: 'Software Engineering',
    standardFee: 3500,
  },
  {
    id: 'unit-0007',
    unitCode: 'MATH 301',
    unitTitle: 'Discrete Mathematics',
    standardFee: 3000,
  },
  {
    id: 'unit-0008',
    unitCode: 'CS 403',
    unitTitle: 'Artificial Intelligence',
    standardFee: 4000,
  },
];

// BookingStatus: Pending | AwaitingPayment | Paid | Failed | Consumed
export const mockBookings = [
  {
    id: 'booking-0001',
    examUnit: mockExamUnits[0],
    status: 'Paid',
    createdAt: '2026-03-15T09:22:00Z',
    paymentRecord: {
      amount: 3500,
      mpesaReceiptNumber: 'RGH4K8P9LM',
      phoneNumber: '0712 345 678',
    },
    ticket: {
      id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      isUsed: false,
    },
  },
  {
    id: 'booking-0002',
    examUnit: mockExamUnits[3],
    status: 'Pending',
    createdAt: '2026-03-20T14:05:00Z',
    paymentRecord: null,
    ticket: null,
  },
  {
    id: 'booking-0003',
    examUnit: mockExamUnits[1],
    status: 'Failed',
    createdAt: '2026-03-10T11:30:00Z',
    paymentRecord: {
      amount: 3500,
      mpesaReceiptNumber: null,
      phoneNumber: '0712 345 678',
    },
    ticket: null,
  },
  {
    id: 'booking-0004',
    examUnit: mockExamUnits[4],
    status: 'Consumed',
    createdAt: '2026-02-28T08:00:00Z',
    paymentRecord: {
      amount: 3500,
      mpesaReceiptNumber: 'QWE2T7Y1OP',
      phoneNumber: '0712 345 678',
    },
    ticket: {
      id: 'c72e4a1b-91dd-4c3f-bcd2-7f308a9e1234',
      isUsed: true,
      scannedAt: '2026-03-01T08:45:00Z',
    },
  },
];

// IDs of units that already have an active (non-failed) booking
export const bookedUnitIds = mockBookings
  .filter((b) => b.status !== 'Failed')
  .map((b) => b.examUnit.id);
