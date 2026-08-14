import { beforeUserCreated, beforeUserSignedIn } from 'firebase-functions/v2/identity'

export const beforecreated = beforeUserCreated((event) => {
  return { customClaims: { role: 'authenticated' } }
})

export const beforesignedin = beforeUserSignedIn((event) => {
  return { customClaims: { role: 'authenticated' } }
})