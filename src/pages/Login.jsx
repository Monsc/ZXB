import React from 'react';
import Button from '../components/ui/Button';

export default function Login() {
  const handleOAuth = provider => {
    // TODO: 跳转到OAuth登录接口
    alert(`模拟跳转到${provider}登录`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary">
      <div className="w-full max-w-xs space-y-6">
        <div className="text-2xl font-bold text-accent-blue text-center mb-6">登录走线吧</div>
        <Button className="w-full" onClick={() => handleOAuth('微信')}>微信登录</Button>
        <Button className="w-full" onClick={() => handleOAuth('QQ')} variant="outline">QQ登录</Button>
        <Button className="w-full" onClick={() => handleOAuth('GitHub')} variant="outline">GitHub登录</Button>
        <div className="text-center text-muted text-xs mt-6">登录即代表同意《用户协议》和《隐私政策》</div>
      </div>
    </div>
  );
} 