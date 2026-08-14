// scripts/backfill-roles.js
const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

initializeApp({
  credential: cert(require('./serviceAccountKey.json')),
});

async function setRoleCustomClaim() {
  let nextPageToken;
  do {
    const result = await getAuth().listUsers(1000, nextPageToken);
    nextPageToken = result.pageToken;
    await Promise.all(result.users.map(u =>
      getAuth().setCustomUserClaims(u.uid, { role: 'authenticated' })
        .catch(e => console.error('Failed for', u.uid, e))
    ));
  } while (nextPageToken);
}

setRoleCustomClaim().then(() => {
  console.log('Done');
  process.exit(0);
});