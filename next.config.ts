import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Aliasing /api/tasks to /tasks to strictly match the assignment specification
  async rewrites() {
    return [
      {
        source: '/tasks',
        destination: '/api/tasks',
      },
      {
        source: '/tasks/:id',
        destination: '/api/tasks/:id',
      },
    ];
  },
};

export default nextConfig;
