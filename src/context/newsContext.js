
// src/context/NewsContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get('https://okapi-woocommerc-wr9i20lbrp.live-website.com/wp-json/wp/v2/posts?_embed&per_page=3');
        setNews(res.data);
      } catch (err) {
        console.error('Error loading news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <NewsContext.Provider value={{ news, loading }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => useContext(NewsContext);
