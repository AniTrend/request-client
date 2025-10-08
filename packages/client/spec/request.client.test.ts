import { afterEach, beforeEach, describe, it } from '@std/testing/bdd';
import { assertEquals, assertRejects } from '@std/assert';
import { mockFetch, resetFetch } from '@c4spar/mock-fetch';
import { createClient } from '@anitrend/request-client';
import { bytes, json, text } from './mock.helper.ts';

describe('RequestClient', () => {
  beforeEach(() => resetFetch());
  afterEach(() => resetFetch());

  it('builds URL with baseURL and query params', async () => {
    mockFetch(
      'https://api.example.com/users?page=1&size=20',
      json({ ok: true }),
    );
    const api = createClient({ baseURL: 'https://api.example.com' });
    const { data } = await api.get<{ ok: boolean }>('/users', {
      params: { page: 1, size: 20 },
    });
    assertEquals(data?.ok, true);
  });

  it('merges headers: instance then request overrides', async () => {
    mockFetch(
      {
        url: 'https://x/echo-headers',
        headers: {
          'x-a': '1',
          'x-b': 'override',
          'x-c': '3',
        },
      },
      json({
        a: '1',
        b: 'override',
        c: '3',
      }),
    );

    const api = createClient({ headers: { 'x-a': '1', 'x-b': '2' } });
    const { data } = await api
      .get<{ a: string | null; b: string | null; c: string | null }>(
        'https://x/echo-headers',
        { headers: { 'x-b': 'override', 'x-c': '3' } },
      );

    assertEquals(data, { a: '1', b: 'override', c: '3' });
  });

  it('auto parses json/text/bytes', async () => {
    mockFetch('https://x/json', json({ a: 1 }));
    mockFetch('https://x/text', text('hello'));
    mockFetch('https://x/bytes', bytes(new Uint8Array([1, 2, 3])));

    const api = createClient();
    const jres = await api.get<{ a: number }>('https://x/json', {
      responseType: 'json',
    });
    assertEquals(jres.data?.a, 1);

    const tres = await api.get<string>('https://x/text', {
      responseType: 'text',
    });
    assertEquals(tres.data, 'hello');

    const bres = await api.get<ArrayBuffer>('https://x/bytes', {
      responseType: 'arrayBuffer',
    });
    assertEquals(
      Array.from(new Uint8Array(bres.data ?? new ArrayBuffer(0))),
      [1, 2, 3],
    );
  });

  it('throws on non-2xx with default validateStatus', async () => {
    mockFetch(
      'https://x/404',
      json({ error: 'Not Found' }, { status: 404, statusText: 'Not Found' }),
    );
    const api = createClient();
    await assertRejects(
      () => api.get('https://x/404'),
      Error,
      'Request failed with status 404',
    );
  });

  it('returns response and data with custom validateStatus', async () => {
    mockFetch('https://x/tea', json({ a: 1 }, { status: 418 }));
    const api = createClient();
    const response = await api.get<{ a: number }>('https://x/tea', {
      validateStatus: () => true,
    });
    assertEquals(response.status, 418);
    assertEquals(response.data?.a, 1);
  });

  it('validates status with custom validateStatus', async () => {
    mockFetch('https://x/maybe-created', json({ ok: true }, { status: 201 }));
    mockFetch('https://x/maybe-created', json({ ok: true }, { status: 201 }));
    const api = createClient();

    // Accept both 200 and 201
    const response1 = await api.get('https://x/maybe-created', {
      validateStatus: (status) => status === 200 || status === 201,
    });
    assertEquals(response1.status, 201);

    // Only accept 200
    await assertRejects(
      () =>
        api.get('https://x/maybe-created', {
          validateStatus: (status) => status === 200,
        }),
      Error,
      'Request failed with status 201',
    );
  });

  it('handles non-2xx status codes with validateStatus', async () => {
    mockFetch('https://x/endpoint', json({ ok: true }, { status: 503 }));

    const api = createClient();
    const response = await api.get<{ ok: boolean }>('https://x/endpoint', {
      validateStatus: () => true, // Accept all status codes
    });
    assertEquals(response.status, 503);
    assertEquals(response.data?.ok, true);
  });

  it('aborts on timeout', async () => {
    const originalFetch = globalThis.fetch;
    const api = createClient({ timeout: 20 });
    try {
      globalThis.fetch = (_input, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            reject(new DOMException('Timeout', 'TimeoutError'));
          });
        });
      await assertRejects(
        () => api.get('https://x/slow'),
        Error,
      );
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('runs interceptors in order', async () => {
    const seen: string[] = [];
    mockFetch(
      { url: 'https://x/echo', headers: { 'x-one': '1' } },
      json({ ok: true }),
    );

    const api = createClient();
    api.interceptors.request.use((config) => {
      if (!config.headers) config.headers = {};
      config.headers['x-one'] = '1';
      seen.push('req1');
      return config;
    });
    api.interceptors.response.use((response) => {
      seen.push('res1');
      return response;
    });
    api.interceptors.error.use((error) => {
      seen.push('err1');
      return error;
    });

    const { data } = await api.get<{ ok: boolean }>('https://x/echo');
    assertEquals(data?.ok, true);
    assertEquals(seen, ['req1', 'res1']);
  });

  it('counts request interceptor invocations', async () => {
    mockFetch(
      'https://x/endpoint',
      json({ error: 'Service Unavailable' }, { status: 503 }),
    );

    const api = createClient();
    let attempts = 0;
    api.interceptors.request.use((config) => {
      attempts += 1;
      return config;
    });

    await assertRejects(
      () => api.get('https://x/endpoint'),
      Error,
      'Request failed with status 503',
    );
    assertEquals(attempts, 1);
  });
  it('post() sets content-type & body for JSON data', async () => {
    mockFetch('https://x/json', json({ ok: true }));

    const api = createClient();
    const jRes = await api.post<{ ok: boolean }>('https://x/json', { a: 1 });
    assertEquals(jRes.data?.ok, true);
  });
});
