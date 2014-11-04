test = require 'blue-tape'
Auth = require '../app/api/auth'
auth = new Auth()

TEST_LOGIN = 'TEST_' + (new Date).toISOString().replace /\W/g, '_'
TEST_EMAIL = TEST_LOGIN.toLowerCase() + '@zooniverse.org'
TEST_PASSWORD = 'P@$$wørd'

test 'Checking the current user initially fails', (t) ->
  auth.checkCurrent()
    .then (user) ->
      if user?
        t.fail 'Nobody should be signed in'
      else
        t.pass 'Nobody is signed in'

    .catch ->
      t.fail 'Failed to check current user'

test 'Registering an account with no data fails', (t) ->
  BLANK_REGISTRATION = {}

  auth.register BLANK_REGISTRATION
    .then ->
      t.fail 'Should not have been able to register'

    .catch (errors) ->
      t.ok errors?.length is 1, 'Should have gotten one error'
      t.ok errors[0].message.login[0].indexOf('blank') isnt -1, 'Login error should mention "blank"'
      t.ok errors[0].message.email[0].indexOf('blank') isnt -1, 'Email error should mention "blank"'
      t.ok errors[0].message.password[0].indexOf('blank') isnt -1, 'Password error should mention "blank"'

test 'Registering an account with a short password fails', (t) ->
  SHORT_PASSWORD_REGISTRATION =
    login: TEST_LOGIN
    email: TEST_EMAIL
    password: TEST_PASSWORD[0...7] # 8 characters minimum

  auth.register SHORT_PASSWORD_REGISTRATION
    .then ->
      t.fail 'Should not have been able to register'

    .catch (errors) ->
      t.ok errors?.length is 1, 'Should have gotten one error'
      t.ok errors[0].message.password[0].indexOf('short') isnt -1, 'Password error should mention "short"'

test 'Registering a new account works', (t) ->
  GOOD_REGISTRATION =
    login: TEST_LOGIN
    email: TEST_EMAIL
    password: TEST_PASSWORD

  auth.register GOOD_REGISTRATION
    .then (user) ->
      t.ok user?, 'Should have gotten a user'
      t.ok user.display_name is TEST_LOGIN, 'Display name should be whatever login was given'

    .catch ->
      t.fail 'Should have worked'

test 'Registering keeps you signed in', (t) ->
  auth.checkCurrent()
    .then (user) ->
      t.ok user?, 'Should have gotten a user'
      t.ok user.display_name is TEST_LOGIN, 'Display name should be whatever login was given'

    .catch ->
      t.fail 'Somebody should be signed in'

test 'Sign out', (t) ->
  auth.signOut()
    .then ->
      t.pass 'Signed out'

    .catch ->
      t.fail 'Sign out should work'

test 'Registering an account with an already used login fails', (t) ->
  DUPLICATE_REGISTRATION =
    login: TEST_LOGIN
    email: TEST_EMAIL
    password: TEST_PASSWORD

  auth.register DUPLICATE_REGISTRATION
    .then ->
      t.fail 'Should not have been able to register with a duplicate login'

    .catch (errors) ->
      t.ok errors?.length is 1, 'Should have gotten one error'
      t.ok errors[0].message.login[0].indexOf('taken') isnt -1, 'Login error should mention "taken"'
      t.ok errors[0].message.email[0].indexOf('taken') isnt -1, 'Email error should mention "taken"'

test 'Signing in with an unknown login fails', (t) ->
  BAD_LOGIN =
    login: 'NOT_' + TEST_LOGIN
    password: TEST_PASSWORD

  auth.signIn BAD_LOGIN
    .then ->
      t.fail 'Should not have been able to sign in with a bad login'

    .catch (errors) ->
      t.ok errors?.length is 1, 'Should have gotten one error'
      # NOTE: A bad login should return the same error as a bad password.
      t.ok errors[0].message.password[0].indexOf('incorrect') isnt -1, 'Password error should mention "incorrect"'

test 'Signing in with the wrong password fails', (t) ->
  BAD_PASSWORD =
    login: TEST_LOGIN
    password: 'NOT_' + TEST_PASSWORD

  auth.signIn BAD_PASSWORD
    .then ->
      t.fail 'Should not have been able to sign in with a bad password'

    .catch (errors) ->
      t.ok errors?.length is 1, 'Should have gotten one error'
      t.ok errors[0].message.password[0].indexOf('incorrect') isnt -1, 'Password error should mention "incorrect"'

test 'Signing in with good details works', (t) ->
  GOOD_LOGIN_DETAILS =
    login: TEST_LOGIN
    password: TEST_PASSWORD

  auth.signIn GOOD_LOGIN_DETAILS
    .then (user) ->
      t.ok user?, 'Should have gotten a user'
      t.ok user.display_name is TEST_LOGIN, 'Display name should be original'

    .catch ->
      t.fail 'Sign in should work'

test 'Deleting an account works', (t) ->
  auth.checkCurrent().then (user) ->
    user.delete()
      .then ->
        OLD_LOGIN_DETAILS =
          login: TEST_LOGIN
          password: TEST_PASSWORD

        auth.signIn OLD_LOGIN_DETAILS
          .then (user) ->
            t.fail 'Should not have been able to sign in to a deleted account'

          .catch ->
            t.pass 'Could not sign in to a deleted account'

      .catch (errors) ->
        t.fail 'Failed to delete account', JSON.stringify errors
