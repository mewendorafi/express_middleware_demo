const { connect } = require('mongoose');

const URL = process.env.DB_URL;
const CREDENTIALS = process.env.X509_CERTIFICATE;

connect(URL, {
	tlsCertificateKeyFile: CREDENTIALS,
	authMechanism: 'MONGODB-X509',
	authSource: '$external',
})
	.then(res => console.info(`[DATABASE] Connected to Mongo instance '${res.connection.db.databaseName}' ...`))
	.catch(console.error);
