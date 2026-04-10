'use client';

import TaskManager from '@/frontend/components/TaskManager';

// Force dynamic rendering to ensure the task list is always fresh
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <main>
      <TaskManager />
    </main>
  );
}
