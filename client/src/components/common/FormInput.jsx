import React from 'react';
import { useFormContext } from 'react-hook-form';

const FormInput = ({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  pattern,
  errorMessage,
  ...props
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className={`w-full px-5 py-2 rounded-full bg-gray-50 dark:bg-[#232d36] border border-gray-200 dark:border-gray-700 text-base text-gray-900 dark:text-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-twitter-blue focus:border-twitter-blue disabled:cursor-not-allowed disabled:opacity-50 transition-all ${
          errors[name] ? 'border-red-500 focus-visible:ring-red-500 focus:border-red-500' : ''
        }`}
        {...register(name, {
          required: required && '此字段为必填项',
          pattern: pattern && {
            value: pattern,
            message: errorMessage,
          },
        })}
        {...props}
      />
      {errors[name] && <p className="text-sm text-red-500">{errors[name].message}</p>}
    </div>
  );
};

export default FormInput;
