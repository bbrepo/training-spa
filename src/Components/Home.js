import React from "react";
import BannerBackground from "../Assets/home-banner-background.png";
import BannerImage from "../Assets/home-banner-image.png";
import Navbar from "./Navbar";
import { FiArrowRight } from "react-icons/fi";

const Home = () => {
  return (
    <div className="home-container" id="home">
      <Navbar />
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="" />
        </div>
        <div className="home-text-section">
          <h1 className="primary-heading">
          Change your career to IT to change your life
          </h1>
          <p className="primary-text">
            Enough of low-paying jobs? We help people like you to change their life. We will make you fully prepared for the lucrative IT jobs in the USA. 
            Get our exclusive IT training, resume preparation support, job search help, and interview preparation at a affordable price. You
            just decide to change your life, rest is on us.
          </p>
          <button className="secondary-button">
            Register Now <FiArrowRight />{" "}
          </button>
        </div>
        <div className="home-image-section">
          <img src={BannerImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Home;
