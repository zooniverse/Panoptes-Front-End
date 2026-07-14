React = require 'react'
createReactClass = require 'create-react-class'
ChangeListener = require '../../components/change-listener'
AutoSave = require '../../components/auto-save'
handleInputChange = require('../../lib/handle-input-change').default
drawingTools = require '../drawing-tools'
alert = require('../../lib/alert').default
DrawingTaskDetailsEditor = require './drawing-task-details-editor'
NextTaskSelector = require './next-task-selector'
{MarkdownEditor, MarkdownHelp} = require 'markdownz'
isAdmin = require '../../lib/is-admin'
TOOL_COLOR_OPTIONS = require('../../constants/toolColors').default

# `import MinMaxEditor from './drawing/min-max-editor';`
MinMaxEditor = require('./drawing/min-max-editor').default
GridEditor = require('./drawing/grid-editor').default

module.exports = createReactClass
  displayName: 'GenericTaskEditor'

  getDefaultProps: ->
    workflow: null
    task: null
    taskPrefix: ''

  render: ->
    handleChange = handleInputChange.bind @props.workflow

    [mainTextKey, choicesKey] = switch @props.task.type
      when 'single', 'multiple' then ['question', 'answers']
      when 'drawing' then ['instruction', 'tools']
      when 'crop' then ['instruction']
      when 'text' then ['instruction']
      when 'slider' then ['instruction']
      when 'highlighter' then ['instruction', 'highlighterLabels']
      when 'dataVisAnnotation' then ['instruction', 'tools']
      when 'volumetric' then ['instruction']
      when 'geoDrawing' then ['instruction', 'tools']

    isAQuestion = @props.task.type in ['single', 'multiple']
    canBeRequired = @props.task.type in ['single', 'multiple', 'text']

    <div className="workflow-task-editor #{@props.task.type}">
      <div>
        <AutoSave resource={@props.workflow}>
          <span className="form-label">Main text</span>
          <br />
          <textarea name="#{@props.taskPrefix}.#{mainTextKey}" value={@props.task[mainTextKey]} className="standard-input full" onChange={handleChange} />
        </AutoSave>
        <small className="form-help">Describe the task, or ask the question, in a way that is clear to a non-expert. Markdown can be used only to add images (with alt text), bold and italic text.</small><br />
      </div>
      <br />

      {unless @props.isSubtask
        <div>
          <AutoSave resource={@props.workflow}>
            <span className="form-label">Help text</span>
            <br />
            <MarkdownEditor name="#{@props.taskPrefix}.help" onHelp={-> alert <MarkdownHelp/>} value={@props.task.help ? ""} rows="7" className="full" onChange={handleChange} />
          </AutoSave>
          <small className="form-help">Add text and images for a window that pops up when volunteers click “Need some help?” You can use markdown to format this text and add images. The help text can be as long as you need, but you should try to keep it simple and avoid jargon.</small>
        </div>}

      {if choicesKey?
        <div>
          <hr />
          <span className="form-label">Choices</span>
        </div>}
      {' '}

      {unless @props.task.type is 'geoDrawing'
        <label className="pill-button">
          <AutoSave resource={@props.workflow}>
            <input type="checkbox" checked={@props.task.enableHidePrevMarks} onChange={@toggleHidePrevMarksEnabled} />{' '}
            Allow hiding marks
          </AutoSave>
        </label>}

      {if isAQuestion
        multipleHelp = 'Multiple Choice: Check this box if more than one answer can be selected.'

        <span>
          <label className="pill-button" title={multipleHelp}>
            <AutoSave resource={@props.workflow}>
              <input type="checkbox" checked={@props.task.type is 'multiple'} onChange={@toggleMultipleChoice} />{' '}
              Allow multiple
            </AutoSave>
          </label>
          {' '}
        </span>}

      {if canBeRequired
        requiredHelp = 'Check this box if this question has to be answered before proceeding. If a marking task is Required, the volunteer will not be able to move on until they have made at least 1 mark.'
        <span>
          <label className="pill-button" title={requiredHelp}>
            <AutoSave resource={@props.workflow}>
              <input type="checkbox" name="#{@props.taskPrefix}.required" checked={@props.task.required} onChange={handleChange} />{' '}
              Required
            </AutoSave>
          </label>
          {' '}
        </span>}
      <br />

      {if choicesKey?
        <div className="workflow-task-editor-choices">
          {if (@props.task[choicesKey]?.length ? 0) is 0 # Work around the empty-array-becomes-null bug on the back end.
            <span className="form-help">No <code>{choicesKey}</code> defined for this task.</span>}
          {for choice, index in @props.task[choicesKey] ? []
            choice._key ?= Math.random()
            <div key={choice._key} className="workflow-choice-editor">
              <AutoSave resource={@props.workflow}>
                <textarea name="#{@props.taskPrefix}.#{choicesKey}.#{index}.label" className="standard-input full" value={choice.label} onChange={handleChange} />
              </AutoSave>

              <div className="workflow-choice-settings">
                {switch @props.task.type
                  when 'single'
                    unless @props.isSubtask
                      <div className="workflow-choice-setting">
                        <AutoSave resource={@props.workflow}>
                          Next task{' '}
                          <NextTaskSelector task={@props.task} workflow={@props.workflow} name="#{@props.taskPrefix}.#{choicesKey}.#{index}.next" value={choice.next ? ''} onChange={handleChange} />
                        </AutoSave>
                      </div>

                  when 'highlighter'
                    <div className="workflow-choice-setting" >
                      <AutoSave resource={@props.workflow} >
                        Color{' '}
                        <select style={{background: choice.color}} name="#{@props.taskPrefix}.#{choicesKey}.#{index}.color" value={choice.color} onChange={handleChange}>
                          {for labelOption in TOOL_COLOR_OPTIONS
                            <option
                              key={labelOption.value}
                              style={{ background: labelOption.value }}
                              value={labelOption.value}
                            >
                              {labelOption.label}
                            </option>}
                        </select>
                      </AutoSave>
                    </div>

                  when 'dataVisAnnotation'
                    <div className="workflow-choice-setting" >
                      <AutoSave resource={@props.workflow} >
                        Color{' '}
                        <select style={{background: choice.color}} name="#{@props.taskPrefix}.#{choicesKey}.#{index}.color" value={choice.color} onChange={handleChange}>
                          {for labelOption in TOOL_COLOR_OPTIONS
                            <option
                              key={labelOption.value}
                              style={{ background: labelOption.value }}
                              value={labelOption.value}
                            >
                              {labelOption.label}
                            </option>}
                        </select>
                      </AutoSave>
                    </div>

                  when 'drawing'
                    options = drawingTools[choice.type].options ? []
                    [<div key="type" className="workflow-choice-setting">
                      <AutoSave resource={@props.workflow}>
                        Type{' '}
                        <select name="#{@props.taskPrefix}.#{choicesKey}.#{index}.type" value={choice.type} onChange={handleChange}>
                          {for toolKey of drawingTools
                            <option key={toolKey} value={toolKey}>{toolKey}</option> unless toolKey in ["grid", "freehandLine", "freehandShape", "freehandSegmentLine", "freehandSegmentShape", "anchoredEllipse", "fan", "transcriptionLine", "temporalPoint", "temporalRotateRectangle"]}
                          {if @canUse("grid")
                            <option key="grid" value="grid">grid</option>}
                          {if @canUse("freehandLine")
                            <option key="freehandLine" value="freehandLine">freehand line</option>}
                          {if @canUse("freehandShape")
                            <option key="freehandShape" value="freehandShape">freehand shape</option>}
                          {if @canUse("freehandSegmentLine")
                            <option key="freehandSegmentLine" value="freehandSegmentLine">freehand segment line</option>}
                          {if @canUse("freehandSegmentShape")
                            <option key="freehandSegmentShape" value="freehandSegmentShape">freehand segment shape</option>}
                          {if @canUse("anchoredEllipse")
                            <option key="anchoredEllipse" value="anchoredEllipse">anchored ellipse</option>}
                          {if @canUse("fan")
                            <option key="fan" value="fan">fan tool</option>}
                          {if @canUse("temporalPoint")
                            <option key="temporalPoint" value="temporalPoint">temporalPoint</option>}
                          {if @canUse("temporalRotateRectangle")
                            <option key="temporalRotateRectangle" value="temporalRotateRectangle">temporalRotateRectangle</option>}
                          {if isAdmin()
                            <option key="transcriptionLine" value="transcriptionLine">transcription line</option>}
                        </select>
                      </AutoSave>
                    </div>

                    <div key="color" className="workflow-choice-setting">
                      <AutoSave resource={@props.workflow}>
                        Color{' '}
                        <select name="#{@props.taskPrefix}.#{choicesKey}.#{index}.color" value={choice.color} onChange={handleChange}>
                          # These are historic PFE task tool colors,
                          # for new development consider using TOOL_COLOR_OPTIONS.
                          <option value="#ff0000">Red</option>
                          <option value="#ffff00">Yellow</option>
                          <option value="#00ff00">Green</option>
                          <option value="#00ffff">Cyan</option>
                          <option value="#0000ff">Blue</option>
                          <option value="#ff00ff">Magenta</option>
                          <option value="#000000">Black</option>
                          <option value="#ffffff">White</option>
                        </select>
                      </AutoSave>
                    </div>

                    <MinMaxEditor
                      key='min-max'
                      workflow={@props.workflow}
                      name="#{@props.taskPrefix}.#{choicesKey}.#{index}"
                      choice={choice}
                    />

                    if 'size' in options
                      <div key="size" className="workflow-choice-setting">
                        <AutoSave resource={@props.workflow}>
                          <label>Size{' '}
                            <select
                            name="#{@props.taskPrefix}.#{choicesKey}.#{index}.size"
                            value={choice.size}
                            onChange={handleChange}
                            >
                              <option value="large">Large</option>
                              <option value="small">Small</option>
                            </select>
                          </label>
                        </AutoSave>
                      </div>
                    else
                      null
                    if 'grid' in options
                      <GridEditor
                        key="gridoptions"
                        workflow={@props.workflow}
                        name="#{@props.taskPrefix}.#{choicesKey}.#{index}"
                        choice={choice}
                      />
                    else
                      null

                    <div key="details" className="workflow-choice-setting">
                      <button type="button" onClick={@editToolDetails.bind this, @props.task, index}>Sub-tasks ({choice.details?.length ? 0})</button>{' '}
                      <small className="form-help">Ask users a question about what they’ve just drawn.</small>
                    </div>]

                  when 'geoDrawing'
                    [<div
                      key="type" 
                      className="workflow-choice-setting"
                    >
                      <AutoSave resource={@props.workflow}>
                        Geometry type{' '}
                        <select name="#{@props.taskPrefix}.#{choicesKey}.#{index}.type" value={choice.type} onChange={handleChange}>
                          <option key="Point" value="Point">Point</option>
                          <option key="SegmentedLine" value="SegmentedLine">Segmented line</option>
                        </select>
                      </AutoSave>
                    </div>

                    <div
                      key="color"
                      className="workflow-choice-setting"
                    >
                      <AutoSave resource={@props.workflow}>
                        Color{' '}
                        <select
                          style={{background: choice.color}} 
                          name="#{@props.taskPrefix}.#{choicesKey}.#{index}.color"
                          value={choice.color}
                          onChange={handleChange}
                        >
                          {for labelOption in TOOL_COLOR_OPTIONS
                            <option
                              key={labelOption.value}
                              style={{ background: labelOption.value }}
                              value={labelOption.value}
                            >
                              {labelOption.label}
                            </option>}
                        </select>
                      </AutoSave>
                    </div>
                    
                    if choice.type is 'Point'
                      <div
                        key="uncertainty_circle"
                        className="workflow-choice-setting"
                      >
                        <label>
                          <AutoSave resource={@props.workflow}>
                            Show uncertainty circle<sup>*</sup>:{' '}
                            <input
                              type="checkbox"
                              name="#{@props.taskPrefix}.#{choicesKey}.#{index}.uncertainty_circle"
                              checked={choice.uncertainty_circle}
                              onChange={handleChange}
                            />{' '}
                            <br />
                            <small><sup>*</sup>per GeoJSON feature&apos;s <code>properties.uncertainty_radius</code> value (integer).</small>{' '}
                          </AutoSave>
                        </label>
                      </div>
                    else if choice.type is 'SegmentedLine'
                      <div
                        key="segmented-line-bounds"
                        className="workflow-choice-setting"
                      >
                        <strong>Number of lines</strong>{' '}
                        <small>(controls how many lines the volunteer may draw)</small>
                        <MinMaxEditor
                          key='min-max-lines'
                          workflow={@props.workflow}
                          name="#{@props.taskPrefix}.#{choicesKey}.#{index}"
                          choice={choice}
                        />
                        <strong>Points per line</strong>{' '}
                        <small>(controls vertices within a single drawn line)</small>
                        <MinMaxEditor
                          key='min-max-vertices'
                          workflow={@props.workflow}
                          name="#{@props.taskPrefix}.#{choicesKey}.#{index}"
                          choice={choice}
                          minKey='min_vertices'
                          maxKey='max_vertices'
                          minLimit={2}
                        />
                      </div>
                    else
                      null
                    ]
                }
              </div>

              <AutoSave resource={@props.workflow}>
                <button type="button" className="workflow-choice-remove-button" title="Remove choice" onClick={@removeChoice.bind this, choicesKey, index}>&times;</button>
              </AutoSave>
            </div>}

          <AutoSave resource={@props.workflow}>
            <button type="button" className="workflow-choice-add-button" title="Add choice" onClick={@addChoice.bind this, choicesKey}>+</button>
          </AutoSave>
          <br />

          {switch choicesKey
            when 'answers'
              <div>
                <small className="form-help">The answers will be displayed next to each checkbox, so this text is as important as the main text and help text for guiding the volunteers. Keep your answers as minimal as possible -- any more than 5 answers can discourage new users.</small><br />
                <small className="form-help">The “Next task” selection describes what task you want the volunteer to perform next after they give a particular answer. You can choose from among the tasks you’ve already defined. If you want to link a task to another you haven’t built yet, you can come back and do it later (don’t forget to save your changes).</small>
              </div>
            when 'highlighterLabels'
              <div>
                <small className="form-help"> Add labels for the highlighter tool.</small>
              </div>
            when 'tools'
              if @props.task.type is 'dataVisAnnotation'
                <div>
                  <small className="form-help"> Add labels for the data selection tool.</small>
                </div>
              if @props.task.type is 'drawing'
                <div>
                  <small className="form-help">Select which marks you want for this task, and what to call each of them. The tool name will be displayed on the classification page next to each marking option. Use the simplest tool that will give you the results you need for your research.</small><br />
                  <small className="form-help"><b>bezier:</b> an arbitrary shape made of point-to-point curves. The midpoint of each segment drawn can be dragged to adjust the curvature. </small><br />
                  <small className="form-help"><b>circle:</b> a point and a radius.</small><br />
                  <small className="form-help"><b>column:</b> a box with full height but variable width; this tool <i>cannot</i> be rotated.</small><br />
                  <small className="form-help"><b>ellipse:</b> an oval of any size and axis ratio; this tool <i>can</i> be rotated.</small><br />
                  <small className="form-help"><b>line:</b> a straight line at any angle.</small><br />
                  <small className="form-help"><b>point:</b> X marks the spot.</small><br />
                  <small className="form-help"><b>polygon:</b> an arbitrary shape made of point-to-point lines.</small><br />
                  <small className="form-help"><b>rectangle:</b> a box of any size and length-width ratio; this tool <i>cannot</i> be rotated.</small><br />
                  <small className="form-help"><b>triangle:</b> an equilateral triangle of any size and vertex distance from the center; this tool <i>can</i> be rotated.</small><br />
                  {if @canUse("grid")
                    <small className="form-help"><b>grid table</b>: cells which can be made into a table for consecutive annotations.</small>}
                  {if @canUse("anchoredEllipse")
                    <small className="form-help"><b>anchored ellipse</b>: creates an ellipes in the center of the subject during the first click, and does not allow it to be dragged.</small>}}
                </div>}
        </div>}

      {if @props.task.type is 'geoDrawing'
        tileLayers = @props.workflow.configuration?.subject_viewer_config?.tile_layers ? []
        <div className="workflow-tile-layers-editor">
          <hr />
          <span className="form-label">Map tile layers</span>
          <br />
          <small className="form-help">Configure basemap layers volunteers can switch between in the map viewer.</small>
          {for layer, index in tileLayers
            urlMissingPlaceholders = layer.type is 'xyz' and (not /\{x\}/.test(layer.url ? '') or not /\{y\}/.test(layer.url ? '') or not /\{z\}/.test(layer.url ? ''))
            layersMissing = layer.type is 'wms' and not layer.params?.LAYERS
            urlPlaceholder = if layer.type is 'xyz'
              'https://a.tile.opentopomap.org/{z}/{x}/{y}.png'
            else
              'https://example.org/cgi-bin/wms?'
            <div key={index} className="workflow-tile-layer-row">
              <AutoSave resource={@props.workflow}>
                <div className="workflow-tile-layer-field workflow-tile-layer-type-row" data-field="type">
                  <label>
                    Type
                    <br />
                    <select
                      name="configuration.subject_viewer_config.tile_layers.#{index}.type"
                      value={layer.type || 'osm'}
                      onChange={handleChange}
                    >
                      <option value="osm">OpenStreetMap (osm)</option>
                      <option value="wms">WMS</option>
                      <option value="xyz">XYZ tiles</option>
                      <option value="cog">Cloud Optimized GeoTIFF (cog)</option>
                    </select>
                  </label>
                  <button
                    type="button"
                    className="workflow-tile-layer-remove-button"
                    title="Remove tile layer"
                    onClick={@removeTileLayer.bind this, index}
                  >&times;</button>
                </div>
                <div className="workflow-tile-layer-field" data-field="label">
                  <label>
                    Label
                    <br />
                    <input
                      type="text"
                      className="standard-input full"
                      name="configuration.subject_viewer_config.tile_layers.#{index}.label"
                      value={layer.label || ''}
                      onChange={handleChange}
                    />
                  </label>
                </div>
                {unless layer.type is 'osm'
                  <div className="workflow-tile-layer-field" data-field="url">
                    <label>
                      URL
                      <br />
                      <input
                        type="text"
                        className="standard-input full"
                        placeholder={urlPlaceholder}
                        name="configuration.subject_viewer_config.tile_layers.#{index}.url"
                        value={layer.url || ''}
                        onChange={handleChange}
                      />
                    </label>
                    {if urlMissingPlaceholders
                      <small
                        className="workflow-tile-layer-error"
                        data-field="url"
                        role="alert"
                      >
                        XYZ URL must contain {'{x}'}, {'{y}'}, and {'{z}'} placeholders.
                      </small>}
                  </div>}
                {if layer.type is 'wms'
                  <div className="workflow-tile-layer-field" data-field="layers">
                    <label>
                      Layer
                      <br />
                      <input
                        type="text"
                        className="standard-input full"
                        placeholder="nlcd_2019_land_cover_l48"
                        name="configuration.subject_viewer_config.tile_layers.#{index}.params.LAYERS"
                        value={layer.params?.LAYERS || ''}
                        onChange={handleChange}
                      />
                    </label>
                    {if layersMissing
                      <small
                        className="workflow-tile-layer-error"
                        data-field="layers"
                        role="alert"
                      >
                        WMS layer requires a LAYERS parameter.
                      </small>}
                  </div>}
                {if layer.type is 'wms'
                  <div className="workflow-tile-layer-field" data-field="format">
                    <label>
                      FORMAT
                      <br />
                      <select
                        name="configuration.subject_viewer_config.tile_layers.#{index}.params.FORMAT"
                        value={layer.params?.FORMAT || 'image/png'}
                        onChange={handleChange}
                      >
                        <option value="image/png">PNG (image/png)</option>
                        <option value="image/png; mode=8bit">PNG 8-bit (image/png; mode=8bit)</option>
                        <option value="image/png8">PNG 8-bit (image/png8)</option>
                        <option value="image/jpeg">JPEG (image/jpeg)</option>
                        <option value="image/vnd.jpeg-png">JPEG/PNG hybrid (image/vnd.jpeg-png)</option>
                        <option value="image/vnd.jpeg-png8">JPEG/PNG8 hybrid (image/vnd.jpeg-png8)</option>
                        <option value="image/gif">GIF (image/gif)</option>
                        <option value="image/tiff">TIFF (image/tiff)</option>
                        <option value="image/tiff8">TIFF 8-bit (image/tiff8)</option>
                        <option value="image/geotiff">GeoTIFF (image/geotiff)</option>
                        <option value="image/geotiff8">GeoTIFF 8-bit (image/geotiff8)</option>
                        <option value="image/svg+xml">SVG (image/svg+xml)</option>
                        <option value="image/webp">WebP (image/webp)</option>
                        <option value="image/bmp">BMP (image/bmp)</option>
                        <option value="application/pdf">PDF (application/pdf)</option>
                      </select>
                    </label>
                  </div>}
                {if tileLayers.length > 1
                  <div className="workflow-tile-layer-field" data-field="default">
                    <label>
                      <input
                        type="radio"
                        name="workflow-tile-layer-default"
                        checked={!!layer.default}
                        onChange={@setBasemapDefault.bind this, index}
                      />{' '}
                      Default basemap
                    </label>
                  </div>}
              </AutoSave>
            </div>}
          <button
            type="button"
            className="workflow-tile-layer-add-button"
            title="Add tile layer"
            onClick={@addTileLayer}
          >+ Add tile layer</button>
        </div>}

      {unless @props.task.type is 'single' or @props.isSubtask
        <div>
          <AutoSave resource={@props.workflow}>
            Next task{' '}
            <NextTaskSelector task={@props.task} workflow={@props.workflow} name="#{@props.taskPrefix}.next" value={@props.task.next ? ''} onChange={handleChange} />
          </AutoSave>
        </div>}
    </div>

  canUse: (tool) ->
    tool in @props.project.experimental_tools

  toggleHidePrevMarksEnabled: (e) ->
    enableHidePrevMarks = e.target.checked
    @props.task.enableHidePrevMarks = enableHidePrevMarks
    @props.onChange @props.task

  toggleMultipleChoice: (e) ->
    newType = if e.target.checked
      'multiple'
    else
      'single'
    @props.task.type = newType
    @props.onChange @props.task

  addChoice: (type) ->
    switch type
      when 'answers' then @addAnswer()
      when 'tools' then @addTool()
      when 'highlighterLabels' then @addHighlighterLabels()

  addAnswer: ->
    @props.task.answers.push
      label: 'Enter an answer'
    @props.onChange @props.task

  addHighlighterLabels: ->
    toolLabelColors = TOOL_COLOR_OPTIONS.map((option) => option.value)
    taskColors = @props.task.highlighterLabels.map((label) => label.color)
    newColor = toolLabelColors.find((color) => taskColors.indexOf(color) == -1) || toolLabelColors[0]

    @props.task.highlighterLabels.push
      color: newColor
      label: 'Enter label'
    @props.onChange @props.task

  addTool: ->
    if @props.task.type is 'drawing'
      @props.task.tools.push
        type: 'point'
        label: 'Tool name'
        color: '#00ff00'
        details: []
    if @props.task.type is 'geoDrawing'
      toolLabelColors = TOOL_COLOR_OPTIONS.map((option) => option.value)
      taskColors = @props.task.tools.map((tool) => tool.color)
      newColor = toolLabelColors.find((color) => taskColors.indexOf(color) == -1) || toolLabelColors[0]      
      @props.task.tools.push
        type: 'Point'
        label: 'Tool name',
        color: newColor
    if @props.task.type is 'dataVisAnnotation'
      toolLabelColors = TOOL_COLOR_OPTIONS.map((option) => option.value)
      taskColors = @props.task.tools.map((tool) => tool.color)
      newColor = toolLabelColors.find((color) => taskColors.indexOf(color) == -1) || toolLabelColors[0]
      @props.task.tools.push
        type: 'graph2dRangeX'
        label: 'Tool name'
        color: newColor
    @props.onChange @props.task

  editToolDetails: (task, toolIndex) ->
    @props.task.tools[toolIndex].details ?= []

    alert (resolve) =>
      <ChangeListener target={@props.workflow}>{=>
        <DrawingTaskDetailsEditor
          project={@props.project}
          workflow={@props.workflow}
          task={@props.task}
          toolIndex={toolIndex}
          details={@props.task.tools[toolIndex].details}
          toolPath="#{@props.taskPrefix}.tools.#{toolIndex}"
          onClose={resolve}
        />
      }</ChangeListener>

  removeChoice: (choicesName, index) ->
    @props.task[choicesName].splice index, 1
    @props.onChange @props.task

  addTileLayer: ->
    current = (@props.workflow.configuration?.subject_viewer_config?.tile_layers ? []).slice()
    current.push { label: '', type: 'osm', url: '', params: { FORMAT: 'image/png' } }
    @props.workflow.update 'configuration.subject_viewer_config.tile_layers': current

  removeTileLayer: (index) ->
    current = (@props.workflow.configuration?.subject_viewer_config?.tile_layers ? []).slice()
    current.splice index, 1
    @props.workflow.update 'configuration.subject_viewer_config.tile_layers': current

  setBasemapDefault: (index) ->
    current = @props.workflow.configuration?.subject_viewer_config?.tile_layers ? []
    next = current.map (layer, i) ->
      Object.assign {}, layer, default: i is index
    @props.workflow.update 'configuration.subject_viewer_config.tile_layers': next
