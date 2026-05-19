import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

export const RegisterForm: React.FC = () => {
  const { register, error, isLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'sales_user',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name) {
      errors.name = 'Full name is required';
    }
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const success = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      role: formData.role,
    });

    if (success) {
      setSuccessMessage('Registration successful! Logging you in...');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-lg text-left animate-fade-in">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-lg text-left animate-fade-in">
          {successMessage}
        </div>
      )}

      <Input
        label="Full Name"
        id="name"
        name="name"
        type="text"
        placeholder="John Doe"
        value={formData.name}
        onChange={handleChange}
        error={formErrors.name}
        required
      />

      <Input
        label="Email Address"
        id="email"
        name="email"
        type="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={handleChange}
        error={formErrors.email}
        required
      />

      <Select
        label="Role"
        id="role"
        name="role"
        options={[
          { value: 'sales_user', label: 'Sales Executive' },
          { value: 'admin', label: 'Administrator' },
        ]}
        value={formData.role}
        onChange={handleChange}
      />

      <Input
        label="Password"
        id="password"
        name="password"
        type="password"
        placeholder="At least 8 characters"
        value={formData.password}
        onChange={handleChange}
        error={formErrors.password}
        required
      />

      <Input
        label="Confirm Password"
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        placeholder="••••••••"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={formErrors.confirmPassword}
        required
      />

      <Button type="submit" variant="primary" className="w-full mt-2" loading={isLoading}>
        Create Account
      </Button>
    </form>
  );
};

export default RegisterForm;
