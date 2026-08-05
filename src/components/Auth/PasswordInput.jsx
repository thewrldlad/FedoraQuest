import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = forwardRef(function PasswordInput(
  { label, id, error, className = "", ...inputProps },
  ref
) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-gray-300"
        >
          {label}
        </label>
      )}

      <div className="relative">

        <input
          id={id}
          ref={ref}
          type={visible ? "text" : "password"}
          className={`
            w-full
            rounded-2xl
            border
            border-white/15
            bg-white/5
            px-5
            py-4
            pr-14
            text-white
            placeholder:text-gray-400
            outline-none
            transition-all
            duration-200
            focus:border-cyan-400
            focus:bg-white/10
            ${className}
          `}
          {...inputProps}
        />

        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-gray-400
            transition-colors
            hover:text-white
          "
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>

      </div>

      {error && (
        <p className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
});

export default PasswordInput;
