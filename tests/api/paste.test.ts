// tests/api/paste.test.ts

import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

// Mock nanoid before importing the module that uses it
jest.mock('nanoid', () => ({
  nanoid: jest.fn(),
}));

// Mock prisma before importing the module that uses it
jest.mock('@/lib/prisma', () => {
  return {
    __esModule: true,
    default: mockDeep<PrismaClient>(),
  };
});

// Import the mocked modules
import { nanoid } from 'nanoid';
import prisma from '@/lib/prisma';

// Now import the module under test
import { POST } from '@/app/api/paste/route';
import { ErrorCodes } from '@/constants/errorCodes';

// Cast prisma to the mocked type
const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe('POST /api/paste', () => {
  const mockPasteCode = 'def456';

  beforeEach(() => {
    mockReset(prismaMock);
    (nanoid as jest.Mock).mockReturnValue(mockPasteCode);
  });

  it('should create a new paste', async () => {
    prismaMock.paste.create.mockResolvedValue({
      id: 1,
      content: 'Hello World',
      pasteCode: mockPasteCode,
      createdAt: new Date(),
      usageCount: 0,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    const request = new Request('http://localhost/api/paste', {
      method: 'POST',
      body: JSON.stringify({ content: 'Hello World' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual({ pasteCode: mockPasteCode });
    expect(prismaMock.paste.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.paste.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        content: 'Hello World',
        pasteCode: mockPasteCode,
        expiresAt: expect.any(Date),
      }),
    });
  });

  it('should return error if content is missing', async () => {
    const request = new Request('http://localhost/api/paste', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      code: ErrorCodes.ContentRequired.toString(),
      message: 'Content is required.',
    });
  });

  it('should handle internal server errors', async () => {
    prismaMock.paste.create.mockRejectedValue(new Error('Database error'));

    const request = new Request('http://localhost/api/paste', {
      method: 'POST',
      body: JSON.stringify({ content: 'Hello World' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      code: ErrorCodes.InternalServerError.toString(),
      message: 'An unexpected error occurred.',
    });
  });
});
