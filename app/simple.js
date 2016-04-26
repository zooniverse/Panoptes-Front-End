import React from 'react'
import ReactDOM from 'react-dom'
import ES6Hello from './simple.jsx'
import CoffeeScriptHello from './simple.cjsx'
import './simple.styl'

var Root = React.createClass({
  render: function(){
    var dev = "Amy"
    return <div>
      <ES6Hello name={dev}/>
      <CoffeeScriptHello name={dev}/>
    </div>
  }
})

ReactDOM.render(<Root />, document.getElementById('root'))
