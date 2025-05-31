import React from 'react';
import { Feed } from '../components/Feed';
import { CreatePost } from '../components/CreatePost';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export const Home = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">{t('welcome')}</h1>
      {user && <CreatePost />}
      <Feed />
    </>
  );
};

export default Home;
