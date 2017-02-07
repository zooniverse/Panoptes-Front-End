import ComboTask from './combo/';
import SingleTask from './single';
import MultipleTask from './multiple';
import DrawingTask from './drawing/';
import SurveyTask from './survey/';
import CropTask from './crop/';
import TextTask from './text/';
import DropdownTask from './dropdown/';
import ShortcutTask from './shortcut';

const tasks = {
  combo: ComboTask,
  single: SingleTask,
  multiple: MultipleTask,
  drawing: DrawingTask,
  survey: SurveyTask,
  crop: CropTask,
  text: TextTask,
  dropdown: DropdownTask,
  shortcut: ShortcutTask
};

export default tasks;
