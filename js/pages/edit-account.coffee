React = require 'react'
Routed = require 'react-routed'

{div, p, img, span, a, strong, small, ul, li, fieldset, legend, label, input, button, table, tr, td} = React.DOM

module.exports = React.createClass
  displayName: 'EditAccountPage'

  render: ->
    div className: 'edit-account-page',
      div null, a href: '#/edit/account/contact', 'Contact details'
      div null, a href: '#/edit/account/password', 'Password'
      div null, a href: '#/edit/account/profile', 'Profile'
      div null, a href: '#/edit/account/roles', 'Roles'
      div null, a href: '#/edit/account/notifications', 'Notifications'
      div null, a href: '#/edit/account/groups', 'Groups'
      div null, a href: '#/edit/account/projects', 'Projects'
      div null, a href: '#/edit/account/subjects', 'Subjects'

      Routed null,
        Routed hash: '#/edit/account/contact',
          div null,
            fieldset null,
              legend null, 'Contact info'
                span null, 'Email address'
                input type: 'email', name: 'email', placeholder: 'me@example.com', size: 50
                p null,
                  small null, 'We\'ll never share this address. You can edit your public contact information in your profile'

            fieldset null,
              legend null, 'Contact preferences'
              table className: 'for-checkboxes',
                tr null,
                  td null,
                    input type: 'checkbox', name: 'wants-betas'
                  td null,
                    label null, 'I want to help test new projects under development.'
                tr null,
                  td null,
                    input type: 'checkbox', name: 'can-survey'
                  td null,
                    label null, 'I\'m willing to take part in occasional surveys from the Zooniverse and associated scientists.'

            button type: 'submit', 'Save account settings'

        Routed hash: '#/edit/account/password',
          div null,
            fieldset null,
              legend null, 'Change your password'
              table className: 'for-text-fields',
                tr null,
                  td null, 'Old password'
                  td null,
                    input type: 'password', name: 'passsword-old', size: 50
                tr null,
                  td null, 'New password'
                  td null,
                    input type: 'password', name: 'passsword-new', size: 50
                tr null,
                  td null, 'Confirm new password'
                  td null,
                    input type: 'password', name: 'passsword-confirmed', size: 50

            button type: 'submit', 'Save password'

        Routed hash: '#/edit/account/profile',
          div null,
            fieldset null,
              legend null, 'Avatar'
              table null,
                tr null,
                  td style: verticalAlign: 'middle',
                    img src: '//placehold.it/512.png', width: 96, height: 96
                  td null,
                    label null,
                      'Upload an image'
                      small null, '(square .jpg or .png, max [[N]] KB)'
                      input type: 'file', name: 'avatar'
                    p null,
                      'Or'
                      button type: 'button', name: 'delete-avatar', 'Delete this avatar'

            fieldset null,
              legend null, 'Optional profile details'
              table null,
                tr null,
                  td null,
                    label null, 'Your name'
                  td null,
                    input type: 'text', name: 'real-name', placeholder: 'John Smith', size: 50
                    p null,
                      small 'We\'ll use this to give acknowledgement in papers, on posters, etc.'
                tr null,
                  td null,
                    label null, 'Location'
                  td null,
                    input type: 'text', name: 'location', placeholder: 'Chicago, IL', size: 50
                tr null,
                  td null,
                    label null, 'Public email address'
                  td null,
                    input type: 'text', name: 'public-email', placeholder: 'me@example.com', size: 50
                tr null,
                  td null,
                    label null, 'Web site'
                  td null,
                    input type: 'url', name: 'www', placeholder: 'https://www.example.com/', size: 50

            fieldset null,
              legend null, 'Social media'
              table null,
                tr null,
                  td null, 'Twitter'
                  td null,
                    input type: 'text', name: 'twitter', placeholder: 'Your Twitter handle'
                tr null,
                  td null, 'Pinterest'
                  td null,
                    input type: 'text', name: 'pinterest', placeholder: 'Your Pinterest user name'

            button type: 'submit', 'Save profile'

        Routed hash: '#/edit/account/roles',
          div null,
            p null,
              'Project roles are assigned by project owners, and visible to other volunteers in discussions and on your profile.'
              strong null, 'NOTE:'
              'Only project owners can assign roles. If you give up a role, you won\'t be able to get it back yourself!'
            p null,
              'Zooniverse'
              strong null, 'Galaxy Zoo'
              span className: 'badge',
                'Moderator'
                button null, '&times;'
              span className: 'badge',
                'Expert classifier'
                button null, '&times;'
            p null,
              'Zooniverse'
              strong null, 'Planet Hunters'
              span className: 'badge', null,
                'Scientist'
                button null, '&times;'

        Routed hash: '#/edit/account/notifications',
          div null,
            fieldset null,
              legend null, 'News and updates'
              label null,
                input type: 'checkbox', name: 'notify-on-zooniverse-news'
                span null, 'Email me general Zooniverse news'
              p null,
                small null, 'News emails don\'t go out more than once or twice per month. We\'ll always email you when important site changes occur.'

            fieldset null,
              legend null, 'Watched projects',
              'Zooniverse'
              strong null, 'Galaxy Zoo'
              button type: 'button', 'Stop watching'
              p null,
                label null,
                  input type: 'checkbox', name: 'email-on-data', value: ''
                  'Email &emsp;'
                label null,
                  input type: 'checkbox', name: 'email-on-data', value: ''
                  'Message &emsp;'
                'General project updates'
              p null,
                label null,
                  input type: 'checkbox', name: 'email-on-data', value: ''
                  'Email'
                  '&emsp;'
                label null,
                  input type: 'checkbox', name: 'email-on-data', value: '',
                  'Message'
                  '&emsp;'
                'When new data is added'

            fieldset null,
              legend null, 'Watched discussion threads'
              ul null,
                li null,
                  a href: '#', 'Zooniverse General Discussion &gt; What\'s the deal with those airplane peanuts?'
                  button type: 'button', 'Stop watching'
                  div null,
                    label null,
                      input type: 'checkbox', name: 'email-on-data', value: ''
                      'Email'
                      '&emsp;'
                    label null,
                      input type: 'checkbox', name: 'email-on-data', value: ''
                      'Message'
                      '&emsp;'
                    'New comments'

            button type: 'submit', 'Save notification settings'

        Routed hash: '#/edit/account/groups',
          div null,
            p null, 'You own'
            ul null,
              li null,
                a href: '#', 'Brian\'s cool group'
            p null, 'You are a member of'
            ul null,
              li null,
                a href: '#', 'Zooniverse'
              li null,
                a href: '#', 'NYPL'

        Routed hash: '#/edit/account/projects',
          div null,
            p null, 'Your projects are...'

        Routed hash: '#/edit/account/subjects',
          div null,
            p null, 'Your subjects are...'
