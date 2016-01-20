# define the styles for various jsPlumb elements
connectorHoverStyle =
  lineWidth: 3
  strokeStyle: "#888"
  outlineWidth: 1.5
  outlineColor: "white"

endpointHoverStyle =
  fillStyle: "#888"

connectorPaintStyle =
  lineWidth: 3
  strokeStyle: "#000"
  joinstyle: "round"
  outlineColor: "white"
  outlineWidth: 1.5
  dashstyle: "1 0"

connectorPaintStyleDashed =
  lineWidth: 3
  strokeStyle: "#000"
  joinstyle: "round"
  outlineColor: "white"
  outlineWidth: 1.5
  dashstyle: "4 2"

commonA =
  connector: ["Flowchart",
    stub: 30
    cornerRadius: 5
    alwaysRespectStubs: false
    midpoint: 0.5]
  anchor: "Right"
  isSource: false
  endpoint: "Dot"
  connectorStyle: connectorPaintStyle
  hoverPaintStyle: endpointHoverStyle
  connectorHoverStyle: connectorHoverStyle
  scope: 'normal'
  paintStyle:
    fillStyle: "#000"
    radius: 5

commonAOpen =
  connector: ["Flowchart",
    stub: 30
    cornerRadius: 5
    alwaysRespectStubs: false
    midpoint: 0.5]
  anchor: "Right"
  isSource: false
  endpoint: "Dot"
  connectorStyle: connectorPaintStyleDashed
  hoverPaintStyle: endpointHoverStyle
  connectorHoverStyle: connectorHoverStyle
  scope: 'sub'
  paintStyle:
    fillStyle: "transparent"
    strokeStyle: "#000"
    radius: 4
    lineWidth: 2

commonT =
  anchor: "Left"
  isTarget: false
  endpoint: "Dot"
  maxConnections: -1
  hoverPaintStyle: endpointHoverStyle
  connectorHoverStyle: connectorHoverStyle
  scope: 'normal sub'
  dropOptions:
    hoverClass: "hover"
    activeClass: "active"
  paintStyle:
    fillStyle: "#000"
    radius: 7

commonTDraw =
  anchor: "Left"
  isTarget: false
  endpoint: "Dot"
  maxConnections: -1
  hoverPaintStyle: endpointHoverStyle
  connectorHoverStyle: connectorHoverStyle
  scope: 'normal'
  dropOptions:
    hoverClass: "hover"
    activeClass: "active"
  paintStyle:
    fillStyle: "#000"
    radius: 7

module.exports = {
  commonA
  commonAOpen
  commonT
  commonTDraw
}
