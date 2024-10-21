module.exports = {
  apps: [
    {
      name: 'webapi-middle',
      script: 'index.js',
      node_args: '-r dotenv/config',
      env: {
        NODE_ENV: 'development',
        dotenv_config_path: '.env.dev'
      },
      env_production: {
        NODE_ENV: 'production',
        dotenv_config_path: '.env'
      }
    }
  ]
};