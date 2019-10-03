## How to use

Step 1 - Access /giveme route using a GET request and copy the accessToken

Step 2 - Create a cookie named 'accessToken' and paste the access token copied at step 1 (one)

step 3 - You can emit and receive data from your backend.

I use to website : [socketserve.io](http://socketserve.io/)

And the 4 routes have worked as expected.

If you want to test everything,

### Events to subscribe

- gotError
- userFound
- userCreated
- profileFound
- profileCreated

### Events to emit

- findProfile (Will answer on gotError with 'No profiles found !')
- findUser (Will return a numbered list)
- createUser (Will return Success !) (You have to set the data to 'object' and you can let it empty)
- createProfile (Will return Success !) (You have to set the data to 'object' and you can let it empty)

If you want to follow each steps, you can check the console output. It will give you more informations.
