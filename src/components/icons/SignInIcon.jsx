const SignInIcon = ({ selected = false }) => {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.6699 2.5H13.3366C13.6902 2.5 14.0293 2.64048 14.2794 2.89052C14.5294 3.14057 14.6699 3.47971 14.6699 3.83333V13.1667C14.6699 13.5203 14.5294 13.8594 14.2794 14.1095C14.0293 14.3595 13.6902 14.5 13.3366 14.5H10.6699"
        stroke={selected ? "#2563EB" : "#6B7280"}
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.33667 11.8334L10.67 8.50002L7.33667 5.16669"
        stroke={selected ? "#2563EB" : "#6B7280"}
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.6699 8.5H2.66992"
        stroke={selected ? "#2563EB" : "#6B7280"}
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SignInIcon;
