export default {
  site: {
    port: 5000,
    name: 'Style Guide Generator',
    secret: 'a-super-secret-passphrase',
    oauth: {
      host: 'http://localhost',
      github: {
        clientID: 'GITHUB-CLIENT-ID',
        clientSecret: 'GITHUB-CLIENT-SECRET'
      },
      google: {
        clientID: 'GOOGLE-CLIENT-ID',
        clientSecret: 'GOOGLE-CLIENT-SECRET'
      }
    },
    db: {
      url: 'localhost',
      name: 'sgg'
    }
  }
};
