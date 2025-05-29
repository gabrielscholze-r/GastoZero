import React from 'react';
import { useForm } from 'react-hook-form';
import create from './Actions.jsx';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      await create(data.name, data.email, data.password);
      toast.success("Account created successfully.");
      navigate('/login');
    } catch (e) {
      toast.error(`Error creating account: ${e.message}`);
    }
  };

  return (
      <div className="h-screen w-full flex items-center justify-center font-displa text-textcontainerbg dark:bg-bglight">
        <div className="w-full max-w-md bg-containerbg dark:bg-grayDark p-10 rounded-2xl shadow-lg space-y-6">
          <h1 className="text-4xl font-bold text-center text-textcontainerbg">Sign Up</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-textcontainerbg mb-1 font-semibold text-sm">Name</label>
              <input
                  {...register('name', { required: 'Name is required' })}
                  placeholder="First and Last Name"
                  className="w-full px-4 py-2 rounded-lg bg-textcontainerbg text-primary dark:bg-bglight dark:text-primary font-medium outline-none focus:ring-2 focus:ring-gold"
              />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-textcontainerbg mb-1 font-semibold text-sm">Email</label>
              <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email address'
                    }
                  })}
                  placeholder="Digite seu email"
                  className="w-full px-4 py-2 rounded-lg bg-textcontainerbg text-primary dark:bg-bglight dark:text-primary font-medium outline-none focus:ring-2 focus:ring-gold"
              />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-textcontainerbg mb-1 font-semibold text-sm">Password</label>
              <input
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message: 'Password must be at least 8 characters long and contain one uppercase letter, one lowercase letter, one number, and one special character'
                    }
                  })}
                  placeholder="Password"
                  className="w-full px-4 py-2 rounded-lg bg-textcontainerbg text-primary dark:bg-bglight dark:text-primary font-medium outline-none focus:ring-2 focus:ring-gold"
              />
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-textcontainerbg mb-1 font-semibold text-sm">Confirm Password</label>
              <input
                  type="password"
                  {...register('confirmPassword', { required: 'Confirm password is required' })}
                  placeholder="Confirm password"
                  className="w-full px-4 py-2 rounded-lg bg-textcontainerbg text-primary dark:bg-bglight dark:text-primary font-medium outline-none focus:ring-2 focus:ring-gold"
              />
              {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            {password && confirmPassword && password !== confirmPassword && (
                <p className="text-red-500">Passwords must match</p>
            )}

            <button
                type="submit"
                className="w-full py-3 bg-bgdark transition-all text-text font-bold text-lg rounded-lg cursor-pointer hover:opacity-80"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
  );
}
