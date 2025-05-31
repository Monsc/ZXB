import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Settings() {
  const [form, setForm] = useState({ nickname: '', bio: '' });
  const [theme, setTheme] = useState('dark');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTheme = t => {
    setTheme(t);
    document.documentElement.classList.toggle('dark', t === 'dark');
  };

  const handleSave = () => {
    // TODO: 保存API
    alert('保存成功（模拟）');
  };

  return (
    <div className="space-y-6 py-6 max-w-main mx-auto">
      <div className="text-xl font-bold text-accent-blue mb-4">设置</div>
      <div className="space-y-4">
        <Input name="nickname" placeholder="昵称" value={form.nickname} onChange={handleChange} />
        <Input name="bio" placeholder="个人简介" value={form.bio} onChange={handleChange} />
      </div>
      <div className="flex items-center space-x-4 mt-4">
        <span className="text-muted">主题：</span>
        <Button variant={theme === 'dark' ? 'primary' : 'outline'} onClick={() => handleTheme('dark')}>深色</Button>
        <Button variant={theme === 'light' ? 'primary' : 'outline'} onClick={() => handleTheme('light')}>浅色</Button>
      </div>
      <Button className="mt-6" onClick={handleSave}>保存</Button>
    </div>
  );
} 