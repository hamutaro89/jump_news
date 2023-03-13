module.exports = {
    apps : [{
        name: "docker-nodejs-pm2-demo",
        script: "./app.js",
        instances: 1,
        exec_mode: 'cluster',
        combine_logs: true,
        out_file: '/dev/null'
    }]
}