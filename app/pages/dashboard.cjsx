# @cjsx React.DOM

React = require 'react'
LineGraph = require '../dashboard/line-graph/line-graph'
LineGraphLegend = require '../dashboard/line-graph/legend'
StatsBox = require '../dashboard/stats-box/stats-box'


PROJECT_CLASSIFICATIONS =
  data: [
    {average_classifications: 7, user_classifications: 5, date: "08/13/2014"}
    {average_classifications: 7, user_classifications: 2, date: "08/14/2014"}
    {average_classifications: 7, user_classifications: 8, date: "08/15/2014"}
    {average_classifications: 7, user_classifications: 4, date: "08/16/2014"}
    {average_classifications: 4, user_classifications: 9, date: "08/17/2014"}
    {average_classifications: 4, user_classifications: 5, date: "08/18/2014"}
    {average_classifications: 7, user_classifications: 2, date: "08/19/2014"}
    {average_classifications: 2, user_classifications: 8, date: "08/20/2014"}
    {average_classifications: 7, user_classifications: 0, date: "08/21/2014"}
    {average_classifications: 7, user_classifications: 9, date: "08/22/2014"}
    {average_classifications: 3, user_classifications: 3, date: "08/23/2014"}
    {average_classifications: 7, user_classifications: 20, date: "08/24/2014"}
    {average_classifications: 7, user_classifications: 15, date: "08/25/2014"}
    {average_classifications: 4, user_classifications: 15, date: "08/26/2014"}
    {average_classifications: 7, user_classifications: 12, date: "08/27/2014"}
    {average_classifications: 7, user_classifications: 20, date: "08/28/2014"}
    {average_classifications: 7, user_classifications: 3, date: "08/29/2014"}
    {average_classifications: 7, user_classifications: 5, date: "08/31/2014"}
    {average_classifications: 6, user_classifications: 7, date: "09/01/2014"}
    {average_classifications: 7, user_classifications: 16, date: "09/02/2014"}
    {average_classifications: 7, user_classifications: 18, date: "09/03/2014"}
    {average_classifications: 9, user_classifications: 25, date: "09/04/2014"}
    {average_classifications: 7, user_classifications: 18, date: "09/05/2014"}
    {average_classifications: 7, user_classifications: 13, date: "09/06/2014"}
    {average_classifications: 8, user_classifications: 13, date: "09/07/2014"}
    {average_classifications: 7, user_classifications: 14, date: "09/08/2014"}
    {average_classifications: 7, user_classifications: 17, date: "09/09/2014"}
    {average_classifications: 7, user_classifications: 19, date: "09/10/2014"}
    {average_classifications: 2, user_classifications: 5, date: "09/11/2014"}
  ]

PROJECT_STATS_DATA =
  total_classifications: "26,127"
  total_users: "3,145"
  total_subjects: "92,301"
  percent_complete: "27%"

USER_STATS_DATA =
  total_classifications: "1,231"
  average_daily_classifications: "15"
  total_talk_comments: "71"
  classifications_today: "5"

module?.exports = React.createClass
  displayName: 'Dashboard'

  render: ->
    <div className="dashboard">
      <StatsBox data={PROJECT_STATS_DATA} title={"#{@props.project.name} Statistics"}/>
      <StatsBox data={USER_STATS_DATA} title={"User Statistics"} />

      <h2>Classification Count</h2>

      <LineGraph
        data={PROJECT_CLASSIFICATIONS.data}
        xKey="date"
        yKeys={["average_classifications", "user_classifications"]}
        dataColors={["lightgrey", "rgb(51, 187, 255)"]}
        pointRadius={10}
        height={300}
        yLines={5}
        yLabel="Classifications" />

      <LineGraphLegend
        data={[
          {color: 'lightgrey', text: 'Community Average'},
          {color: 'rgb(51, 187, 255)', text: 'Your Totals'}
        ]}
      />
    </div>
