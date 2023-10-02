/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/require-default-props */
/* eslint-disable radix */

import { useWorkflowContext } from '../context.js';
import strings from '../strings.json'; // TODO: move all text into strings

export default function TasksPage() {
  const { workflow, update } = useWorkflowContext();

  return (
    <div>
      Tasks Page
    </div>
  );
}
