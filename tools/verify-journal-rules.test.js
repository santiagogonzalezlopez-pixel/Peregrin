const test=require('node:test');
const assert=require('node:assert/strict');
const project='demo-peregrin-free';
const authHost=process.env.FIREBASE_AUTH_EMULATOR_HOST;
const dbHost=process.env.FIRESTORE_EMULATOR_HOST;
if(!authHost||!dbHost)throw Error('Run only through the local Firebase emulators.');
async function user(){
 const res=await fetch(`http://${authHost}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=local-test`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:`test-${crypto.randomUUID()}@example.test`,password:'local-test-password',returnSecureToken:true})});
 assert.equal(res.status,200);return res.json();
}
async function doc(method,path,token,fields){
 return fetch(`http://${dbHost}/v1/projects/${project}/databases/(default)/documents/${path}`,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},...(fields?{body:JSON.stringify({fields})}:{})});
}
test('unpaid owners can use private journals; other users and anonymous readers cannot',async()=>{
 const alice=await user(),bob=await user();
 const note=`users/${alice.localId}/journal/1`;
 const fields={sanctuaryId:{stringValue:'1'},text:{stringValue:'Private prayer'},updatedAtMs:{integerValue:String(Date.now())},updatedAtIso:{stringValue:new Date().toISOString()}};
 assert.equal((await doc('PATCH',`users/${alice.localId}`,alice.idToken,{displayName:{stringValue:'Local test'}})).status,200);
 assert.equal((await doc('PATCH',note,alice.idToken,fields)).status,200);
 assert.equal((await doc('GET',note,alice.idToken)).status,200);
 assert.equal((await doc('GET',note,bob.idToken)).status,403);
 assert.equal((await doc('PATCH',note,bob.idToken,fields)).status,403);
 assert.equal((await doc('GET',note,null)).status,403);
 assert.equal((await doc('PATCH',note,alice.idToken,{...fields,text:{stringValue:'x'.repeat(1001)}})).status,403);
 assert.equal((await doc('DELETE',note,bob.idToken)).status,403);
 assert.equal((await doc('DELETE',note,alice.idToken)).status,200);
});
