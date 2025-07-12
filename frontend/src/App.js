import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Blog from './components/Blog';
import HomePage from './components/HomePage';
import Create from './components/Create';
import Login from './components/Login';
import About from './components/About';
import BlogDetails from './components/BlogDetails';
import BlogState from "./context/BlogState"; // ✅ import context
import EditBlog from './components/EditBlog';

import './App.css';
import PrivateRoute from './components/PrivateRoute';
import ImageGallery from './components/ImageGallery';

function App() {
  return (
    <div className="bg-white min-h-screen">
    
    <BlogState>
      <Router>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/blog" element={<Blog />} />
          <Route exact path="/images" element={<ImageGallery />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/create" element={<PrivateRoute><Create /></PrivateRoute>} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/edit/:id" element={<PrivateRoute><EditBlog /></PrivateRoute>} />
          <Route exact path="/login" element={<Login />} />
        </Routes>
      </Router>
    </BlogState>
    </div>
  );
}

export default App;
