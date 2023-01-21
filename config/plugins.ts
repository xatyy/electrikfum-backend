module.exports = ({env}) => ({
    email: {
        config: {
          provider: 'sendgrid', // For community providers pass the full package name (e.g. provider: 'strapi-provider-email-mandrill')
          providerOptions: {
            apiKey: env('SENDGRID_API_KEY'),
          },
          settings: {
            defaultFrom: 'info@electrikfum.ro',
            defaultReplyTo: 'info@electrikfum.ro',
            testAddress: 'info@electrikfum.ro',
          },
        },
      }, 
});