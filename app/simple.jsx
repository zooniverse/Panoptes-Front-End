import React from 'react'

export default class SimpleClass extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    return <p>Hello from ES6, <span className="name">{this.props.name}</span></p>
  }
}
