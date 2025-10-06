export type LoginCardProps = {
  className?: string;
  onLogin?: (email: string, password: string) => Promise<void> | void;
};
