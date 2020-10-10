const name = 'redwood-pm2' // Name to use in PM2
const repo = 'git@github.com:njjkgeerts/redwood-pm2.git' // Link to your repo
const user = 'deploy' // Server user
const path = `/home/${user}/${name}` // Path on the server to deploy to
const host = 'nickgeerts.com' // Server hostname
const port = 8911 // Port to use locally on the server

module.exports = {
  apps: [
    {
      name,
      node_args: '-r dotenv/config',
      cwd: `${path}/current/`,
      script: 'node_modules/@redwoodjs/api-server/dist/index.js',
      args: `-f api/dist/functions --port ${port}`,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],

  deploy: {
    production: {
      user,
      host,
      ref: 'origin/master',
      repo,
      path,
      ssh_options: 'ForwardAgent=yes',
      'post-deploy':
        'yarn install && yarn rw build && yarn rw db up && yarn rw db seed && pm2 reload ecosystem.config.js --env production',
    },
  },
}
