React = require 'react'
{Markdown} = require 'markdownz'

TalkMarkdownHelp = React.createClass
  render: ->
    <table border="1">
      <thead>
        <tr>
          <th colSpan="2">Zooniverse Hashtags, Users and Subjects</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Add a Hashtag</td>
          <td>#hashtag</td>
        </tr>
        <tr>
          <td>Mention User</td>
          <td>@user</td>
        </tr>
        <tr>
          <td>Mention Subject<br/>(project Talk)</td>
          <td>^S<subject_id><br/>e.g. ^S830273</td>
        </tr>
        <tr>
          <td>Mention Subject<br/>(any Talk)</td>
          <td>@owner/project^S<subject_id><br/>e.g. @zooniverse/wildcam-gorongosa^S830273</td>
        </tr>
        <tr>
          <td>Mention<br/>Project Teams</td>
          <td>
            @admins - mention the project administrators<br/>
            @moderators - mention the project moderators<br/>
            @researchers or @scientists - mention the project researchers<br/>
            @team - mention the entire Zooniverse team
          </td>
        </tr>
        <tr>
          <th colSpan="2">Adding Emoji to Posts</th>
        </tr>
        <tr>
          <td>Complete<br/>Emoji List</td>
          <td><a href="http://www.emoji-cheat-sheet.com/" target="_blank">use this website for all supported emoji</a></td>
        </tr>
      </tbody>
    </table>

module?.exports = React.createClass
  displayName: 'MarkdownHelp'

  getDefaultProps: ->
    talk: false
    title: <h1>Guide to using Markdown</h1>

  render: ->
    <div className="markdown-editor-help">
      <table border="1">
        <thead>
          <tr>
            <th colSpan="3">{@props.title}</th>
          </tr>
          <tr>
            <th colSpan="3"><p>Utilizing a slightly customized version of <a href='http://daringfireball.net/projects/markdown/basics' target="_blank">Markdown</a>.</p></th>
          </tr>
          <tr>
            <th>Style</th>
            <th>Type</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Bold</td>
            <td>**bold** <em>or</em> __bold__</td>
            <td><Markdown>**bold** _or_ __bold__</Markdown></td>
          </tr>
          <tr>
            <td>Italics</td>
            <td>*italics* <em>or</em> _italics_</td>
            <td><Markdown>*italics* _or_ _italics_</Markdown></td>
          </tr>
          <tr>
            <td>Bold Italics</td>
            <td>**_bolditalics_**</td>
            <td><Markdown>**_bolditalics_**</Markdown></td>
          </tr>
          <tr>
            <td>Hyperlink</td>
            <td>[zooniverse](http://www.zooniverse.org)</td>
            <td><Markdown>[zooniverse](http://www.zooniverse.org)</Markdown></td>
          </tr>
          <tr>
            <td>Hyperlink<br/>(new tab)</td>
            <td>[zooniverse](+tab+http://www.zooniverse.org)</td>
            <td><Markdown>[zooniverse](+tab+http://www.zooniverse.org)</Markdown></td>
          </tr>
          <tr>
            <td>Bulleted List</td>
            <td>
              - item one<br/>
              - item two<br/>
              - item three
            </td>
            <td>
              <Markdown>
                - item one
                - item two
                - item three
              </Markdown>
            </td>
          </tr>
          <tr>
            <td>Numbered List</td>
            <td>
              1. item one<br/>
              2. item two<br/>
              3. item three
            </td>
            <td>
              <Markdown>
                1. item one
                2. item two
                3. item three
              </Markdown>
            </td>
          </tr>
          <tr>
            <td>Nested List</td>
            <td>
              <span>- item one</span><br/>
              <span>&nbsp;&nbsp;- item two</span><br/>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;- item three</span><br/>
              <span>- item four</span>
            </td>
            <td>
              <Markdown>
                - item one
                  - item two
                    - item three
                - item four
              </Markdown>
            </td>
          </tr>
          <tr>
            <td>Quoted Text /<br/>Blockquote</td>
            <td>
              > Quoted text.
            </td>
            <td>
              <Markdown>> Quoted text.</Markdown>
            </td>
          </tr>
          <tr>
            <td>Header</td>
            <td>
              # header1<br/>
              ## header2<br/>
              ### header3<br/>
              <em>etc., up to six # symbols</em>
            </td>
            <td>
              <Markdown>
                # header1
                ## header2
                ### header3
              </Markdown>
            </td>
          </tr>
          <tr>
            <td>Code Blocks</td>
            <td>
              <span>`code block`</span><br/>
              <span><em>or with four (4) spaces before (and optionally, after)</em></span><br/>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;code block&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </td>
            <td>
              <Markdown>`code block`</Markdown>
            </td>
          </tr>
          <tr>
            <td>Strikethrough</td>
            <td>~~strikethrough~~</td>
            <td><Markdown>~~strikethrough~~</Markdown></td>
          </tr>
          <tr>
            <td>Image</td>
            <td>
              ![imagealttext](./assets/simple-avatar.jpg)<br/>
              <em>images must already be uploaded; use <a href="http://imgur.com/" target="_blank">imgur</a> to host new images</em>
            </td>
            <td>
              <Markdown>![imagealttext](./assets/simple-avatar.jpg)</Markdown>
            </td>
          </tr>
          <tr>
            <td>Resized Image</td>
            <td>
              ![imagealttext](./assets/simple-avatar.jpg =MxN)<br/>
              <em>M is width in pixels, N is height in pixels</em><br/>
              <em>constrain by ommitting one value, e.g.: =75x or =x75</em>
            </td>
            <td>
              <Markdown>![imagealttext](./assets/simple-avatar.jpg =75x75)</Markdown>
              sample set @ 75x75
            </td>
          </tr>
          <tr>
            <td>Horizontal Line</td>
            <td>--- <em>or</em> *** <em>or</em> ___</td>
            <td>
              <Markdown>---</Markdown>
            </td>
          </tr>
          <tr>
            <td>Tables</td>
            <td colSpan="2"><a href="http://www.tablesgenerator.com/markdown_tables" target="_blank">use this website to generate markdown tables</a></td>
          </tr>
          <tr>
            <td>URL Shortening</td>
            <td colSpan="2">URLs can be written as /projects/username/projectname and /projects/username/projectname/pagename, omitting the "https://www.zooniverse.org."</td>
          </tr>
        </tbody>
      </table>
      {if @props.talk
        <TalkMarkdownHelp />
      }
      <p>If you need any more help formatting posts, please ask on the <a href="https://www.zooniverse.org/talk/">Zooniverse Talk</a> boards!</p>
    </div>
