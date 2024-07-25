interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button className={`font-medium text-sm py-1 px-2 min-w-16 ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
