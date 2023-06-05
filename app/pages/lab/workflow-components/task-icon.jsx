export default function TaskIcon({ type }) {
  switch (type) {
    case 'single': return <i className="fa fa-dot-circle-o fa-fw"></i>;
    case 'multiple': return <i className="fa fa-check-square-o fa-fw"></i>;
    case 'drawing': return <i className="fa fa-pencil fa-fw"></i>;
    case 'survey': return <i className="fa fa-binoculars fa-fw"></i>;
    case 'flexibleSurvey': return <i className="fa fa-binoculars fa-fw"></i>;
    case 'crop': return <i className="fa fa-crop fa-fw"></i>;
    case 'text': return <i className="fa fa-file-text-o fa-fw"></i>;
    case 'dropdown': return <i className="fa fa-list fa-fw"></i>;
    case 'combo': return <i className="fa fa-cubes fa-fw"></i>;
    case 'slider': return <i className="fa fa-sliders fa-fw"></i>;
    case 'highlighter': return <i className="fa fa-i-cursor"></i>;
    case 'transcription': return <i className="fa fa-font fa-fw"></i>;
  }
  return null
}
