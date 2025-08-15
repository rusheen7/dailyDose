import { fetchApod, NasaApodError, type ApodResponse } from '@/lib/nasa';

describe('fetchApod (NASA APOD)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  function mockFetchOnce(status: number, body: unknown) {
    const json = async () => body;
    global.fetch = jest.fn().mockResolvedValue({ ok: status >= 200 && status < 300, status, json } as any);
  }

  it('requests latest APOD by default (no date) and returns parsed data', async () => {
    delete process.env.NASA_API_KEY;
    const payload: ApodResponse = {
      date: '2024-05-01',
      explanation: 'A stunning view of the cosmos',
      media_type: 'image',
      title: 'Galactic Beauty',
      url: 'https://apod.nasa.gov/apod/image/test.jpg',
      hdurl: 'https://apod.nasa.gov/apod/image/test_hd.jpg',
    };
    mockFetchOnce(200, payload);

    const result = await fetchApod();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toMatch(/^https:\/\/api.nasa.gov\/planetary\/apod\?/);
    expect(calledUrl).toContain('api_key=DEMO_KEY');
    expect(calledUrl).toContain('thumbs=true');
    expect(calledUrl).not.toContain('date=');
    expect(result.title).toBe('Galactic Beauty');
  });

  it('uses provided API key and date when given', async () => {
    process.env.NASA_API_KEY = 'MY_KEY';
    const payload: ApodResponse = {
      date: '2024-05-02',
      explanation: 'Another day, another cosmos',
      media_type: 'video',
      title: 'Cosmic Motion',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail_url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    } as any;
    mockFetchOnce(200, payload);

    const result = await fetchApod({ date: '2024-05-02' });
    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toContain('api_key=MY_KEY');
    expect(calledUrl).toContain('date=2024-05-02');
    expect(result.media_type).toBe('video');
  });

  it('throws on non-OK HTTP status', async () => {
    mockFetchOnce(500, { error: 'Internal Server Error' });
    await expect(fetchApod()).rejects.toBeInstanceOf(NasaApodError);
  });

  it('throws on network failure', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('ENOTFOUND')) as any;
    await expect(fetchApod()).rejects.toBeInstanceOf(NasaApodError);
  });

  it('throws on malformed payload', async () => {
    mockFetchOnce(200, { title: 'x' });
    await expect(fetchApod()).rejects.toBeInstanceOf(NasaApodError);
  });
});


