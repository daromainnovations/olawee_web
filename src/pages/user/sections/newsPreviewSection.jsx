

import React, { useEffect, useState } from "react";
import axios from "axios";
import '../sections/styles/newsPreviewSection.scss';

const NewsPreviewSection = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const cachedNews = sessionStorage.getItem("okapiNews");

    if (cachedNews) {
      setPosts(JSON.parse(cachedNews));
    } else {
      const fetchNews = async () => {
        try {
          const response = await axios.get(
            "https://api.olawee.com/wp-json/wp/v2/posts?_embed&per_page=3"
          );
          setPosts(response.data);
          sessionStorage.setItem("okapiNews", JSON.stringify(response.data));
        } catch (error) {
          console.error("Error fetching news:", error);
        }
      };

      fetchNews();
    }
  }, []);

  return (
    <section className="dashboard-news-section">
      <h3>Latest News</h3>
      <div className="news-cards">
        {posts.map((post) => {
          const image =
            post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
            "https://via.placeholder.com/400x200";
          const excerpt = post.excerpt?.rendered?.replace(/<[^>]+>/g, "").slice(0, 120) + "...";
          const date = new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          return (
            <div className="news-card" key={post.id}>
              <img src={image} alt={post.title.rendered} className="news-image" />
              <div className="news-content">
                <div className="news-date">{date}</div>
                <h4 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                <p>{excerpt}</p>
                <a href={post.link} target="_blank" rel="noopener noreferrer" className="read-more">
                  Read More →
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default NewsPreviewSection;
