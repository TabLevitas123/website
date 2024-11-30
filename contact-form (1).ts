import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, User, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface ContactFormProps {
  onSubmit: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit, 
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful }
  } = useForm<FormData>();

  const onSubmitHandler = async (data: FormData) => {
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(data);
      onSubmit();
      reset();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      {/* Name Field */}  
      <div>
        <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-300">
          Name
        </label>
        <div className="relative mt-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <User className="w-5 h-5 text-gray-400" />
          </span>
          <input
            type="text"
            id="name"
            className={`w-full pl-10 pr-3 py-2 text-white bg-gray-800 rounded-md
                      focus:outline-none focus:ring-2 focus:ring-blue-500  
                      ${errors.name ? 'ring-2 ring-red-500' : ''}`}
            placeholder="John Doe"
            {...register('name', { required: 'Name is required' })}
          />
        </div>
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-300">
          Email
        </label>
        <div className="relative mt-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">  
            <Mail className="w-5 h-5 text-gray-400" />
          </span>
          <input 
            type="email"
            id="email"
            className={`w-full pl-10 pr-3 py-2 text-white bg-gray-800 rounded-md
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${errors.email ? 'ring-2 ring-red-500' : ''}`}
            placeholder="john@example.com"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>
      
      {/* Message Field */}
      <div>
        <label htmlFor="message" className="block mb-1 text-sm font-medium text-gray-300">
          Message  
        </label>
        <div className="relative mt-1">
          <span className="absolute left-0 top-0 flex items-start pt-2 pl-3">
            <MessageSquare className="w-5 h-5 text-gray-400" />  
          </span>
          <textarea
            id="message"
            rows={4}
            className={`w-full pl-10 pr-3 py-2 resize-none text-white bg-gray-800 rounded-md
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${errors.message ? 'ring-2 ring-red-500' : ''}`}
            placeholder="Your message..."
            {...register('message', {
              required: 'Message is required',
              maxLength: {
                value: 500,
                message: 'Message cannot exceed 500 characters'  
              }
            })}
          />  
        </div>
        {errors.message && (
          <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit" 
          disabled={isSubmitting}
          className="w-full px-4 py-2 text-sm font-medium text-white transition-colors 
                  duration-300 transform bg-blue-600 rounded-md hover:bg-blue-700
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                  focus:ring-offset-gray-900"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>

      {/* Success Message */}  
      {isSubmitSuccessful && (
        <p className="flex items-center mt-2 space-x-2 text-sm text-green-400">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>Your message was sent successfully!</span>
        </p>
      )}

      {/* Error Summary */}
      {(errors.name || errors.email || errors.message) && (
        <p className="flex items-center mt-2 space-x-2 text-sm text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>Please correct the errors above and resubmit.</span>  
        </p>
      )}
    </form>
  );
};

export default ContactForm;
