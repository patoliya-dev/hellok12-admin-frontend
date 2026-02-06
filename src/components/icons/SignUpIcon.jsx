const SignUpIcon = ({ selected = false }) => {
  return (
    <>
      <svg
        width="17"
        height="17"
        viewBox="0 0 17 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.9466 14.5V13.1667C10.9466 12.4594 10.6657 11.7811 10.1656 11.281C9.66547 10.781 8.98719 10.5 8.27995 10.5H4.27995C3.5727 10.5 2.89443 10.781 2.39433 11.281C1.89423 11.7811 1.61328 12.4594 1.61328 13.1667V14.5"
          stroke={selected ? "#2563EB" : "#6B7280"}
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.27995 7.83333C7.75271 7.83333 8.94661 6.63943 8.94661 5.16667C8.94661 3.69391 7.75271 2.5 6.27995 2.5C4.80719 2.5 3.61328 3.69391 3.61328 5.16667C3.61328 6.63943 4.80719 7.83333 6.27995 7.83333Z"
          stroke={selected ? "#2563EB" : "#6B7280"}
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.9468 5.83331V9.83331"
          stroke={selected ? "#2563EB" : "#6B7280"}
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.9468 7.83331H10.9468"
          stroke={selected ? "#2563EB" : "#6B7280"}
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};

export default SignUpIcon;
