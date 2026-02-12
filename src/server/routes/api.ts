import { Hono } from 'hono';
import { context, redis, reddit } from '@devvit/web/server';
import type {
  DecrementResponse,
  IncrementResponse,
  InitResponse,
} from '../../shared/api';

type ErrorResponse = {
  status: 'error';
  message: string;
};

export const api = new Hono();

api.get('/init', async (c) => {
  const { postId } = context;

  if (!postId) {
    console.error('API Init Error: postId not found in devvit context');
    return c.json<ErrorResponse>(
      {
        status: 'error',
        message: 'postId is required but missing from context',
      },
      400
    );
  }

  try {
    const [count, username] = await Promise.all([
      redis.get('count'),
      reddit.getCurrentUsername(),
    ]);

    return c.json<InitResponse>({
      type: 'init',
      postId: postId,
      count: count ? parseInt(count) : 0,
      username: username ?? 'anonymous',
    });
  } catch (error) {
    console.error(`API Init Error for post ${postId}:`, error);
    let errorMessage = 'Unknown error during initialization';
    if (error instanceof Error) {
      errorMessage = `Initialization failed: ${error.message}`;
    }
    return c.json<ErrorResponse>(
      { status: 'error', message: errorMessage },
      400
    );
  }
});

api.post('/increment', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<ErrorResponse>(
      {
        status: 'error',
        message: 'postId is required',
      },
      400
    );
  }

  const count = await redis.incrBy('count', 1);
  return c.json<IncrementResponse>({
    count,
    postId,
    type: 'increment',
  });
});



// Helper for server-side date string
const getTodayString = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

api.get('/daily-status', async (c) => {
  try {
    const user = await reddit.getCurrentUser();
    if (!user) {
      return c.json({ isSolved: false, username: null, avatarUrl: null });
    }

    const today = getTodayString();
    const key = `daily_solved:${user.id}:${today}`;
    const isSolved = await redis.get(key);

    // Get snoovatar (avatar)
    const snoovatar = await user.getSnoovatarUrl();

    return c.json({
      isSolved: isSolved === 'true',
      username: user.username,
      avatarUrl: snoovatar ?? null,
    });
  } catch (e) {
    console.error('Error fetching daily status:', e);
    return c.json({ isSolved: false, username: null, avatarUrl: null });
  }
});

api.post('/complete-daily', async (c) => {
  try {
    const user = await reddit.getCurrentUser();
    if (!user) {
      return c.json({ success: false, streak: 0 }, 401);
    }

    const today = getTodayString();
    const key = `daily_solved:${user.id}:${today}`;
    
    // Set expiry for 48 hours to be safe, or just keep it. 
    // Let's keep it simple.
    await redis.set(key, 'true');
    
    // Optional: Increment streak (future feature)
    
    return c.json({ success: true, streak: 1 });
  } catch (e) {
    console.error('Error completing daily:', e);
    return c.json({ success: false, streak: 0 }, 500);
  }
});
