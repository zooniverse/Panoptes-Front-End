counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
LoadingIndicator = require '../components/loading-indicator'

counterpart.registerTranslations 'en',
  loginChangeForm:
    updateMessage: "Other Volunteers will be able to mention you in Talk as @%(login)s and find your profile at #/users/%(login)s. You can change it below, but this is permanent"
    login: "Login"
    submit: "Set Login"

module.exports = React.createClass
  displayName: "LoginChangeForm"

  getInitialState: ->
    login: @props.user.login
    busy: false
    error: null

  changeLogin: ->
    @props.user.update({login: @state.login}).save()
      .then (user) =>
        @setState {busy: false}, =>
          @props.onSuccess user
      .catch (e) =>
        @setState {busy: false, error: e}, =>
          @getDOMNode().querySelector('[name="login"]')?.focus()
          @props.onFailure? user

  handleSubmit: (e) ->
    e.preventDefault()
    if @state.login isnt @props.user.login
      @setState {busy: true}, => @changeLogin()
    else
      @props.onSuccess(@props.user)

  handleLoginChange: (e) ->
    @setState {login: e.target.value}

  render: ->
    <form onSubmit={@handleSubmit}>
      <Translate login={@state.login} content="loginChangeForm.updateMessage" />
      <label>
        <Translate content="loginChangeForm.login" component='p' />
        <input type="text" className="standard-input full" name="login" value={@state.login} disabled={@state.busy} autoFocus onChange={@handleLoginChange} />
      </label>

      <br />

      <p style={textAlign: 'center'}>
        {if @state.error?
          <span>{@state.error.toString()}</span>
         else if @state.busy
          <LoadingIndicator />
         else
           <span>&nbsp;</span>}{' '}
      </p>

      <button type="submit" className="standard-button full" disabled={@state.busy or @state.login.length is 0}>
        <Translate content="loginChangeForm.submit" />
      </button>
    </form>


