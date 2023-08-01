# Time Log

A direct replacement for the method of time-tracking I've been doing analog in my journals for the past few years.
![image](https://github.com/lachlansleight/time-log/assets/24868085/f7132693-82e2-4772-9ea0-ca65f7eaf382)

## Installation

1. Set up a Firebase project with authentication + realtime database, create at least one user with the email/password scheme
2. Fork+clone the repo, run `npm i` and create a .env file containing the following:

```
NEXT_PUBLIC_FIREBASE_API_KEY = "your api key here"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = "your auth domain here"
NEXT_PUBLIC_FIREBASE_DATABASE = "your rtdb url here"
NEXT_PUBLIC_FIREBASE_PROJECT_ID = "your project id here"

FB_EMAIL = "your user email"
FB_PASSWORD = "your user password"
```
3. Run `npm run dev` to test the project locally at `https://localhost:3134`

## Deployment 

Deploy to your platform of choice, I use Vercel because I'm basic. Nothing special needs to be done, just make sure you bring your env variables across.

For production, set your firebase RTDB security rules like so for production - non-authenticated users will see only time blocks and colors:
```
{
  "rules": {
    ".read": "auth.uid!=null",
    ".write": "auth.uid!=null"
  }
}
```
Non-authenticated users will have data obscured by the API, no category, activity names or activity notes will be sent to the client at all.
