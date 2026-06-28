module.exports = {
  apps: [
    {
      name: 'usholding-site',
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      cwd: '/home/claude/usholding-site',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: '512M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/home/claude/usholding-site/logs/pm2-error.log',
      out_file: '/home/claude/usholding-site/logs/pm2-out.log',
    },
  ],
};
