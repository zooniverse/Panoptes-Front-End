/*
Aggregation Item
Displays a single aggregation item.

- Usually used with the Aggregations List (See aggregations-list.jsx) but works
  as a standalone item too. Just remember to wrap it in a <ul>
- An aggregation resource can be in one of the following states:
  - pending: work is still being worked upon, in a very working manner.
  - completed: processing work is all done. We can extrapolate links to the download resources. 
  - ❓ error?: a theoretical state where something went wrong. Never actually seen in action. 
- Allows this aggregation to be deleted!
  classifications" export!

Arguments:
- aggregation: the aggregation to display. (Panoptes Aggregation Resource)
 */

function AggregationItem ({
  aggregation
}) {
  return (
    <li></li>
  );
}