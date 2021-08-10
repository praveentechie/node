module.exports = {
  apps: [{
    // name of the app
    name: 'dockerize node with PM2',
    // entry file
    script: './src/server.js',
    // no of server instances to create
    instances: 1,
    // dev env
    env: {
      NODE_ENV: 'development'
    },
    // production environment
    env_production: {
      NODE_ENV: 'production'
    },
    'exec_mode': 'fork',
    // TODO: watch not working
    autorestart: true,
    watch: ['src'],
    watch_delay: 1000,
    ignore_watch: ['node_modules'],
    watch_options: {
      followSymlinks: false,
    },
  }]
};