import PropTypes from 'prop-types';

function TaskIcon({
  alt,
  type,
  width = 19,
  height = 19,
}) {
  switch (type) {
    case 'drawing':
      return (
        <svg
          width="19"
          height="19"
          viewBox="0 0 19 19"
          fill="none"
        >
          <path
            d="M11.4566 3.70706L13.784 1.37957C13.9744 1.18928 14.2325 1.08238 14.5017 1.08238C14.7708 1.08238 15.029 1.18928 15.2193 1.37957L17.8442 4.00447C18.0345 4.19481 18.1414 4.45295 18.1414 4.7221C18.1414 4.99125 18.0345 5.24938 17.8442 5.43973L15.5167 7.76722M11.4566 3.70706L1.60356 13.5601C1.41319 13.7504 1.30621 14.0085 1.30615 14.2777V16.9026C1.30615 17.1718 1.41309 17.43 1.60345 17.6203C1.79381 17.8107 2.05199 17.9176 2.32119 17.9176H4.94609C5.21527 17.9176 5.47341 17.8106 5.66372 17.6202L15.5167 7.76722M11.4566 3.70706L15.5167 7.76722"
            stroke="#7CDFF2"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      )
    
    case 'multiple':  // Multiple answer question
    case 'single':  // Single answer question
      return (
        <svg
          width="19"
          height="19"
          viewBox="0 0 19 19"
          fill="none"
        >
          <path
            d="M8.8377 14.7078H10.6098V12.9357H8.8377V14.7078ZM9.72377 0.530762C8.56017 0.530762 7.40797 0.759949 6.33294 1.20524C5.25792 1.65053 4.28113 2.3032 3.45834 3.12599C1.79664 4.78768 0.863113 7.04142 0.863113 9.39141C0.863113 11.7414 1.79664 13.9951 3.45834 15.6568C4.28113 16.4796 5.25792 17.1323 6.33294 17.5776C7.40797 18.0229 8.56017 18.2521 9.72377 18.2521C12.0738 18.2521 14.3275 17.3185 15.9892 15.6568C17.6509 13.9951 18.5844 11.7414 18.5844 9.39141C18.5844 8.22782 18.3552 7.07561 17.9099 6.00059C17.4647 4.92557 16.812 3.94877 15.9892 3.12599C15.1664 2.3032 14.1896 1.65053 13.1146 1.20524C12.0396 0.759949 10.8874 0.530762 9.72377 0.530762ZM9.72377 16.4799C5.81622 16.4799 2.63524 13.299 2.63524 9.39141C2.63524 5.48387 5.81622 2.30289 9.72377 2.30289C13.6313 2.30289 16.8123 5.48387 16.8123 9.39141C16.8123 13.299 13.6313 16.4799 9.72377 16.4799ZM9.72377 4.07502C8.78377 4.07502 7.88227 4.44844 7.2176 5.11311C6.55292 5.77779 6.17951 6.67929 6.17951 7.61928H7.95164C7.95164 7.14929 8.13834 6.69854 8.47068 6.3662C8.80302 6.03386 9.25377 5.84715 9.72377 5.84715C10.1938 5.84715 10.6445 6.03386 10.9769 6.3662C11.3092 6.69854 11.4959 7.14929 11.4959 7.61928C11.4959 9.39142 8.8377 9.1699 8.8377 12.0496H10.6098C10.6098 10.056 13.268 9.83445 13.268 7.61928C13.268 6.67929 12.8946 5.77779 12.2299 5.11311C11.5653 4.44844 10.6638 4.07502 9.72377 4.07502Z"
            fill="#52DB72"
          />
        </svg>
      )
    
    case 'text':
      return (
        <svg
          width="17"
          height="19"
          viewBox="0 0 17 19"
          fill="none"
        >
          <path
            d="M3.97344 12.4523H11.7675M3.97344 9.39139H13.3263M3.97344 6.33044H7.87048M10.2087 0.97377V4.33044C10.2087 5.43501 11.1041 6.33044 12.2087 6.33044H15.6646M15.6646 15.809V6.4044C15.6646 5.8676 15.4488 5.35334 15.0658 4.97727L11.5716 1.54664C11.1976 1.17948 10.6945 0.97377 10.1704 0.97377H3.63521C2.53064 0.97377 1.63521 1.8692 1.63521 2.97377V15.809C1.63521 16.9136 2.53064 17.809 3.63521 17.809H13.6646C14.7691 17.809 15.6646 16.9136 15.6646 15.809Z"
            stroke="#F1AE45"
            stroke-width="1.5"
          />
        </svg>
      )
    
    default: 
      return (
        <svg
          width="19"
          height="19"
          viewBox="0 0 19 19"
          fill="none"
        >
          <g
            stroke="#E45950"
            stroke-width="2"
          >
            <line x1="2" y1="2" x2="17" y2="17" />
            <line x1="17" y1="2" x2="2" y2="17" />
          </g>
        </svg>
      )
  }
}

TaskIcon.propTypes = {
  alt: PropTypes.string,
  type: PropTypes.string
};

export default TaskIcon;
