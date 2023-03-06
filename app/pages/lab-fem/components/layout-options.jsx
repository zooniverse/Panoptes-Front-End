import React from "react";

export default function LayoutOptions({ workflow = null }) {
  const handleNaturalSubjectDimensions = (e) => {
    workflow.update({
      "configuration.display_natural_subject_dimensions": e.target.checked,
    });
  };

  const displayNaturalSubjectDimensions = !!workflow?.configuration?.display_natural_subject_dimensions

  return (
    <div>
      <span className="form-label">Image Display Options</span>
      <br />
      <small className="form-help">
        By default, subject images stretch to fit the width of the volunteer's
        browser. Check this option if you want the subject's maximum dimensions
        to be the image's original width and height.
      </small>
      <br />
      <label htmlFor="natural_subject_dimensions">
        <input
          id="natural_subject_dimensions"
          type="checkbox"
          checked={displayNaturalSubjectDimensions}
          onChange={handleNaturalSubjectDimensions}
        />
        Display subject image using original width and height
      </label>
    </div>
  );
}