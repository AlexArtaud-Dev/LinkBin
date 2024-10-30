// tests/api/shorten.test.ts

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
import { POST } from '@/app/api/shorten/route';
import { ErrorCodes } from '@/constants/errorCodes';

// Cast prisma to the mocked type
const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe('POST /api/shorten', () => {
  const mockShortCode = 'abc123';

  beforeEach(() => {
    mockReset(prismaMock);
    (nanoid as jest.Mock).mockReturnValue(mockShortCode);
  });

  it('should return a short code for a new URL', async () => {
    prismaMock.shortUrl.findFirst.mockResolvedValue(null);

    prismaMock.shortUrl.create.mockResolvedValue({
      id: 1,
      originalUrl: 'https://example.com/',
      shortCode: mockShortCode,
      createdAt: new Date(),
      usageCount: 0,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    const request = new Request('http://localhost/api/shorten', {
      method: 'POST',
      body: JSON.stringify({ url: 'https://example.com' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual({ shortCode: mockShortCode });
    expect(prismaMock.shortUrl.findFirst).toHaveBeenCalledTimes(1);
    expect(prismaMock.shortUrl.findFirst).toHaveBeenCalledWith({
      where: { originalUrl: 'https://example.com/' },
    });
    expect(prismaMock.shortUrl.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.shortUrl.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        originalUrl: 'https://example.com/',
        shortCode: mockShortCode,
        expiresAt: expect.any(Date),
      }),
    });
  });

  it('should return existing short code if URL already exists', async () => {
    prismaMock.shortUrl.findFirst.mockResolvedValue({
      id: 1,
      originalUrl: 'https://example.com/',
      shortCode: mockShortCode,
      createdAt: new Date(),
      usageCount: 0,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    const request = new Request('http://localhost/api/shorten', {
      method: 'POST',
      body: JSON.stringify({ url: 'https://example.com' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ shortCode: mockShortCode });
    expect(prismaMock.shortUrl.findFirst).toHaveBeenCalledTimes(1);
    expect(prismaMock.shortUrl.findFirst).toHaveBeenCalledWith({
      where: { originalUrl: 'https://example.com/' },
    });
    expect(prismaMock.shortUrl.create).not.toHaveBeenCalled();
  });

  it('should return error if URL is missing', async () => {
    const request = new Request('http://localhost/api/shorten', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      code: ErrorCodes.UrlRequired.toString(),
      message: 'URL is required.',
    });
  });

  it('should return error for invalid URL format', async () => {
    const request = new Request('http://localhost/api/shorten', {
      method: 'POST',
      body: JSON.stringify({ url: 'invalid-url' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      code: ErrorCodes.InvalidUrlFormat.toString(),
      message: 'Invalid URL format.',
    });
  });

  it('should handle internal server errors', async () => {
    prismaMock.shortUrl.findFirst.mockRejectedValue(new Error('Database error'));

    const request = new Request('http://localhost/api/shorten', {
      method: 'POST',
      body: JSON.stringify({ url: 'https://example.com' }),
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
