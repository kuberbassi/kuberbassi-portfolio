import { afterEach, describe, expect, it, vi } from 'vitest';
import handler from './github-projects.js';

function createResponse() {
  const headers = new Map();
  const response = {
    code: 200,
    body: undefined,
    setHeader: vi.fn((name, value) => headers.set(name, value)),
    status: vi.fn((code) => {
      response.code = code;
      return response;
    }),
    json: vi.fn((body) => {
      response.body = body;
      return response;
    }),
    headers,
  };
  return response;
}

afterEach(() => vi.unstubAllGlobals());

describe('GitHub projects API route', () => {
  it('rejects methods that should not proxy to GitHub', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const response = createResponse();
    await handler({ method: 'POST' }, response);

    expect(response.code).toBe(405);
    expect(response.headers.get('Allow')).toBe('GET');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns successful GitHub data with shared-cache headers', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [{ id: 1, name: 'portfolio' }],
    }));
    const response = createResponse();
    await handler({ method: 'GET' }, response);

    expect(response.code).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: 'portfolio' }]);
    expect(response.headers.get('Cache-Control')).toContain('s-maxage=900');
  });
});
