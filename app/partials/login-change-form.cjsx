counterpart = require 'counterpart'
React = require 'react'
createReactClass = require 'create-react-class'
ReactDOM = require 'react-dom'
Translate = require 'react-translate-component'
LoadingIndicator = require('../components/loading-indicator').default

counterpart.registerTranslations 'en',
  loginChangeForm:
    updateMessage: "To use our new platform, you may need to update your Zooniverse ID. Please choose carefully: this will be your only chance to choose a new username for this account! User names can no longer have spaces, or symbols other than hyphens and underscores."
    updateMessageCont: "Your username will be used for other users to reference you by typing: @%(login)s. In addition to your user name, you will also have a “display name” that you may change as often as you like from your Profile page."
    login: "Login"
    submit: "Set Login"

module.exports = createReactClass
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
          ReactDOM.findDOMNode(@).querySelector('[name="login"]')?.focus()
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
      <Translate content="loginChangeForm.updateMessage" component='p'/>
      <Translate login={@state.login} content="loginChangeForm.updateMessageCont" component='p'/>
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
