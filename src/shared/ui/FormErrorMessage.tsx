import React from 'react';

type FormErrorMessageProps = {
  error?: string | null;
  className?: string;
};

const FormErrorMessage: React.FC<FormErrorMessageProps> = ({ error, className = '' }) => {
  if (!error) return null;

  return (
    <div
      aria-live="polite"
      className={['rounded-300 bg-warning-0 flex items-center gap-2 px-4 py-3', className].join(
        ' ',
      )}
    >
      <span className="material-symbols-outlined text-warning-200 flex-shrink-0 !text-[18px]">
        error
      </span>
      <p
        className="text-detail-regular text-warning-300"
        role="alert"
      >
        {error}
      </p>
    </div>
  );
};

export default FormErrorMessage;
