test = require 'blue-tape'
auth = require '../app/api/auth'

TEST_NAME = 'TEST_' + (new Date).toISOString().replace /\W/g, '_'
TEST_EMAIL = TEST_NAME.toLowerCase() + '@zooniverse.org'
TEST_PASSWORD = 'P@$$wørd'

test 'Checking the current user initially fails', (t) ->
  auth.checkCurrent()
    .then (user) ->
      if user?
        t.fail 'Nobody should be signed in'
      else
        t.pass 'Nobody is signed in'

test 'Registering an account with no data fails', (t) ->
  BLANK_REGISTRATION = {}

  auth.register BLANK_REGISTRATION
    .then ->
      t.fail 'Should not have been able to register'

    .catch (error) ->
      t.ok error.message.match(/^display_name(.+)blank/mi), 'Display name error should mention "blank"'
      t.ok error.message.match(/^email(.+)blank/mi), 'Email error should mention "blank"'
      t.ok error.message.match(/^password(.+)blank/mi), 'Password error should mention "blank"'

test 'Registering an account with a short password fails', (t) ->
  SHORT_PASSWORD_REGISTRATION =
    display_name: TEST_NAME + '_short_password'
    email: TEST_EMAIL
    password: TEST_PASSWORD[0...7] # 8 characters minimum

  auth.register SHORT_PASSWORD_REGISTRATION
    .then ->
      t.fail 'Should not have been able to register'

    .catch (error) ->
      t.ok error.message.match(/^password(.+)short/mi), 'Password error should mention "short"'

test 'Registering a new account works', (t) ->
  GOOD_REGISTRATION =
    display_name: TEST_NAME
    email: TEST_EMAIL
    password: TEST_PASSWORD

  auth.register GOOD_REGISTRATION
    .then (user) ->
      t.ok user?, 'Should have gotten the new user'
      t.ok user.display_name is TEST_NAME, 'Display_name should be whatever display_name was given'

test 'Registering keeps you signed in', (t) ->
  auth.checkCurrent()
    .then (user) ->
      t.ok user?, 'Should have gotten a user'
      t.ok user.display_name is TEST_NAME, 'Display_name should be whatever display_name was given'

test 'Sign out', (t) ->
  auth.signOut()
    .then ->
      t.pass 'Signed out'

test 'Registering an account with an already used display_name fails', (t) ->
  DUPLICATE_REGISTRATION =
    display_name: TEST_NAME
    email: TEST_EMAIL
    password: TEST_PASSWORD

  auth.register DUPLICATE_REGISTRATION
    .then ->
      t.fail 'Should not have been able to register with a duplicate display_name'

    .catch (error) ->
      t.ok error.message.match(/^display_name(.+)taken/mi), 'Display name error should mention "taken"'
      t.ok error.message.match(/^email(.+)taken/mi), 'Email error should mention "taken"'

test 'Signing in with an unknown login fails', (t) ->
  BAD_LOGIN =
    display_name: 'NOT_' + TEST_NAME
    password: TEST_PASSWORD

  auth.signIn BAD_LOGIN
    .then ->
      t.fail 'Should not have been able to sign in with a bad login'

    .catch (error) ->
      # NOTE: A bad login should return the same error as a bad password.
      t.ok error.message.match(/^invalid(.+)password/mi), 'Error should mention "invalid" and "password"'

test 'Signing in with the wrong password fails', (t) ->
  BAD_PASSWORD =
    display_name: TEST_NAME
    password: 'NOT_' + TEST_PASSWORD

  auth.signIn BAD_PASSWORD
    .then ->
      t.fail 'Should not have been able to sign in with a bad password'

    .catch (error) ->
      t.ok error.message.match(/^invalid(.+)password/mi), 'Error should mention "invalid" and "password"'

test 'Signing in with good details works', (t) ->
  GOOD_LOGIN_DETAILS =
    display_name: TEST_NAME
    password: TEST_PASSWORD

  auth.signIn GOOD_LOGIN_DETAILS
    .then (user) ->
      t.ok user?, 'Should have gotten a user'
      t.ok user.display_name is TEST_NAME, 'Display name should be the original'

test 'Disabling an account works', (t) ->
  auth.disableAccount()
    .then ->
      OLD_LOGIN_DETAILS =
        display_name: TEST_NAME
        password: TEST_PASSWORD

      auth.signIn OLD_LOGIN_DETAILS
        .then (user) ->
          t.fail 'Should not have been able to sign in to a disabled account'

        .catch ->
          t.pass 'Could not sign in to a disabled account'
