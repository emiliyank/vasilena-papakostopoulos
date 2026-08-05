import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "ghost" | "text";

const variants: Record<ButtonVariant, string> = {
  primary:
    "inline-flex items-center justify-center border border-[var(--color-ink)] bg-[var(--color-ink)] px-6 py-3 text-sm tracking-[0.08em] text-[var(--color-bg)] uppercase transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink)] disabled:pointer-events-none disabled:opacity-50",
  ghost:
    "inline-flex items-center justify-center border border-[var(--color-ink)] bg-transparent px-6 py-3 text-sm tracking-[0.08em] text-[var(--color-ink)] uppercase transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink)] disabled:pointer-events-none disabled:opacity-50",
  text: "inline-flex items-center text-sm tracking-[0.06em] uppercase text-[var(--color-ink)] underline-offset-4 transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink)] disabled:pointer-events-none disabled:opacity-50",
};

type SharedProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

type LinkButtonProps = SharedProps & {
  href: string;
};

type NativeButtonProps = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

export function Button(props: LinkButtonProps | NativeButtonProps) {
  const variant = props.variant ?? "primary";
  const classes = `${variants[variant]} ${props.className ?? ""}`.trim();

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {props.children}
      </Link>
    );
  }

  const buttonProps = props as NativeButtonProps;

  return (
    <button
      type={buttonProps.type ?? "button"}
      className={classes}
      disabled={buttonProps.disabled}
      onClick={buttonProps.onClick}
      name={buttonProps.name}
      value={buttonProps.value}
      form={buttonProps.form}
      aria-label={buttonProps["aria-label"]}
    >
      {buttonProps.children}
    </button>
  );
}
