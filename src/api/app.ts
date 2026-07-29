import { authRouter } from './routers/auth';
import { chatRouter } from './routers/chat';
import { notificationsRouter } from './routers/notifications';
import { postRouter } from './routers/post';
import { profileRouter } from './routers/profile';
import { timelineRouter } from './routers/timeline';

const app = {
  auth: authRouter,
  chat: chatRouter,
  notifications: notificationsRouter,
  post: postRouter,
  profile: profileRouter,
  timeline: timelineRouter,
};

export default app;
