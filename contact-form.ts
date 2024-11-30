import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, User, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm = () => {
  const { 
    register, 
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful }
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      // Simulate form submission delay
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      
      console.log(data);

      // Reset form on successful submit
      reset();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <section className="bg-gray-900 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg mx-auto"
      >
        <h2 className="text-3xl font-extrabold text-center mb-8
                    text-transparent bg-clip-text bg-gradient-to-br  
                    from-blue-400 to-purple-500">
          Get In Touch
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="text-gray-200">Name</label>
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
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="text-gray-200">Email</label>
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
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>  
            )}
          </div>

          <div>
            <label htmlFor="message" className="text-gray-200">Message</label>
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
                    message: 'Message must not exceed 500 characters'
                  }
                })}
              />
            </div>
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium  
                        text-white bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>

          {isSubmitSuccessful && (
            <p className="text-green-400 text-sm flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>Your message has been sent successfully!</span>
            </p>
          )}

          {errors.name || errors.email || errors.message ? (
            <p className="text-red-400 text-sm flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />  
              <span>Please fix the errors above and resubmit.</span>
            </p>
          ) : null}
        </form>
      </motion.div>
    </section>
  );
};

export default ContactForm;
