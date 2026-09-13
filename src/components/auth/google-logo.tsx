import type { SVGProps } from "react";

export function GoogleLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Google"
      role="img"
      {...props}
    >
      <path
        fill="#4285F4"
        d="M21.35 12.23c0-.79-.07-1.55-.2-2.28H12v4.31h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
      />
      <path
        fill="#34A853"
        d="M12 21.67c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.54 0-4.7-1.72-5.47-4.03H3.28v2.53A9.75 9.75 0 0 0 12 21.67Z"
      />
      <path
        fill="#FBBC05"
        d="M6.53 13.77a5.86 5.86 0 0 1 0-3.54V7.7H3.28a9.75 9.75 0 0 0 0 8.6l3.25-2.53Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.2c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.3 14.63 2.33 12 2.33a9.75 9.75 0 0 0-8.72 5.37l3.25 2.53C7.3 7.92 9.46 6.2 12 6.2Z"
      />
    </svg>
  );
}