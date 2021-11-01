import React from 'react'

import Workflow from '../lab/workflow'

/**
The Front End Monorepo Lab (Project Builder) Router returns a different
component, depending on the path, AND whether or not the associated Zooniverse
Project is FEM-compatible.
 */
export default function FEMLabRouter (props) {
  console.log('+++ props: ', props)
  console.log('+++ Workflow: ', Workflow)
  return <h2>'HELLO WORLD'</h2>
}
