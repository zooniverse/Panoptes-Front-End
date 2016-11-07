counterpart = require 'counterpart'
React = require 'react'
{Markdown} = (require 'markdownz').default

counterpart.registerTranslations 'en',
  acknowledgements:
   pageContent: '''
    ## Acknowledging the Zooniverse
    Per the [Zooniverse Project Builder Policies](/lab-policies), all research publications using any data derived from Zooniverse approved projects (those listed on the [Zooniverse Projects page](/projects)) are required to acknowledge the Zooniverse and the Project Builder platform. To do so, please use the following text:

    *This publication uses data generated via the [Zooniverse.org](https://www.zooniverse.org/) platform, development of which was supported by a Global Impact Award from Google, and by the Alfred P. Sloan Foundation.*

    We ask that all researchers making use of the Zooniverse Project Builder platform in any way also consider including the above acknowledgement in their publications.

    We strongly encourage project owners to report published accepted research publications using Zooniverse-produced data to us via [this form](https://docs.google.com/forms/d/e/1FAIpQLSdbAKVT2tGs1WfBqWNrMekFE5lL4ZuMnWlwJuCuNM33QO2ZYg/viewform). You can find a list of publications written using the Zooniverse on our [Publications page](publications).

    If you have any questions about how to acknowledge the Zooniverse, such as referencing a particular individual or custom code, please [get in touch](contact).
'''

module.exports = React.createClass
  displayName: 'Acknowledgements'

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  render: ->
    <Markdown>{counterpart "acknowledgements.pageContent"}</Markdown>
