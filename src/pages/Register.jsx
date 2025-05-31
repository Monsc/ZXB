import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    if (!form.username || !form.password || !form.confirm) {
      setError('请填写完整信息');
      return;
    }
    if (form.password !== form.confirm) {
      setError('两次密码不一致');
      return;
    }
    setError('');
    // TODO: 注册API
    alert('注册成功（模拟）');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary">
      <div className="w-full max-w-xs space-y-6">
        <div className="text-2xl font-bold text-accent-blue text-center mb-6">注册走线吧</div>
        <Input name="username" placeholder="用户名" value={form.username} onChange={handleChange} />
        <Input name="password" type="password" placeholder="密码" value={form.password} onChange={handleChange} />
        <Input name="confirm" type="password" placeholder="确认密码" value={form.confirm} onChange={handleChange} />
        {error && <div className="text-accent-red text-xs text-center">{error}</div>}
        <Button className="w-full" onClick={handleRegister}>注册</Button>
        <div className="text-center text-muted text-xs mt-6">注册即代表同意《用户协议》和《隐私政策》</div>
      </div>
    </div>
  );
} 