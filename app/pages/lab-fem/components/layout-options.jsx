import React from "react";

export default function LayoutOptions({ workflow = null }) {
  const handleLimitSubjectHeight = (e) => {
    workflow.update({
      "configuration.limit_subject_height": e.target.checked,
    });
  };

  const limitSubjectHeight = !!workflow?.configuration?.limit_subject_height

  return (
    <div>
      <span className="form-label">Image Display Options</span>
      <br />
      <small className="form-help">
        Check this option if you want to limit subject height to always fit in the browser window. The max height will be the image's original pixel height.
      </small>
      <br />
      <label htmlFor="limit_subject_height">
        <input
          id="limit_subject_height"
          type="checkbox"
          checked={limitSubjectHeight}
          onChange={handleLimitSubjectHeight}
        />
        Limit subject image height
      </label>
    </div>
  );
}