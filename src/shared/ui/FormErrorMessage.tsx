import React from 'react';

type FormErrorMessageProps = {
  error?: string | null;
  className?: string;
};

const FormErrorMessage: React.FC<FormErrorMessageProps> = ({ error, className = '' }) => {
  return (
    <div
      aria-live="polite"
      className={['mb-4 flex min-h-[24px] justify-center', className].join(' ')}
    >
      {error && (
        <p
          className="text-body-3-regular text-warning-200 text-center"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default FormErrorMessage;
