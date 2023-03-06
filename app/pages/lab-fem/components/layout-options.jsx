import React from "react";

export default function LayoutOptions({ workflow = null }) {
  const handleNaturalSubjectDimesions = (e) => {
    return workflow.update({
      "configuration.use_natural_subject_dimensions": e.target.checked,
    });
  };

  const useNaturalSubjectDimensions = !!workflow?.configuration?.use_natural_subject_dimensions

  return (
    <div>
      <span className="form-label">Image Display Options</span>
      <br />
      <small className="form-help">
        By default, subject images stretch to fit the width of the volunteer's
        browser. Check this option if you want the subject's maximum dimensions
        to be the image's natural width and natural height.{" "}
      </small>
      <br />
      <label htmlFor="use_natural_subject_dimensions">
        <input
          id="use_natural_subject_dimensions"
          type="checkbox"
          checked={useNaturalSubjectDimensions}
          onChange={handleNaturalSubjectDimesions}
        />
        Display subject image using natural width and height
      </label>
    </div>
  );
}
