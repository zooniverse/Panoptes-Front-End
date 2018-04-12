import React from 'react';
import counterpart from 'counterpart';
import { Markdown } from 'markdownz';

class ResourcesPage extends React.Component {
  render() {
    return (
      <div>
        <Markdown>{counterpart('about.resources.title')}</Markdown>
        <Markdown>{counterpart('about.resources.filler')}</Markdown>        
        <Markdown>{counterpart('about.resources.introduction')}</Markdown>
        <Markdown>{counterpart('about.resources.officialMaterials')}</Markdown>
        <Markdown>{counterpart('about.resources.printables')}</Markdown>
        <Markdown>{counterpart('about.resources.press')}</Markdown>
        <Markdown>{counterpart('about.resources.tips')}</Markdown>
        <Markdown>{counterpart('about.resources.listOne')}</Markdown>
        <Markdown>{counterpart('about.resources.listTwo')}</Markdown>
        <Markdown>{counterpart('about.resources.listThree')}</Markdown>
      </div>
    );
  }
}

export default ResourcesPage;
