Store = {}

userStore = Object.create Store
userStore.instances = {}
userStore.signOut = ->
  request.get '/sign-out', ->
