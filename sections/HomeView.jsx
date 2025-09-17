import React from "react";
import css from "@/styles/Home.module.css";
import PostGenerator from "@/components/PostGenerator";

const HomeView = () => {
  return (
    <div className={css.wrapper}>
      <div className={css.postArea}>
        <PostGenerator />
        <span>posts</span>
      </div>
      <div className={css.right}>
        <span>Trending section</span>
        <span>Follow suggestions</span>
      </div>
    </div>
  );
};

export default HomeView;
