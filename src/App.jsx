import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';

import Book from './components/Book';
import MyNavbar from './components/MyNavbar';
import Home from './components/Home';
import Content from './components/Content';
import Contact from './components/Contact';
import Upload from './components/Upload';
import Activities from './components/Activities';
import './App.css';
import useStories, { StoryProvider } from './hooks/useStories';
import Auth0ProviderWithNavigate from './auth/Auth0ProviderWithNavigate';
import Quiz from './components/Quiz';

function App() {
  const { fetchStories } = useStories();
  const [searchItem, setSearchItem] = useState('');

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const handleSearch = (target) => {
    setSearchItem(target);
  };

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Auth0ProviderWithNavigate>
        <StoryProvider>
          <div className="container-fluid px-0 main-container vh-100 vw-100 text-white">
            <MyNavbar handleSearch={handleSearch} />
            <Container className="p-2 custom-container px-2" fluid="xl">
              <Routes>
                <Route path="/" element={<Home searchItem={searchItem} />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/book/:bookIndex" element={<Book />} />
                <Route path="/activities" element={<Activities />} />
                <Route
                  path="/book/:bookIndex/content/:category"
                  element={<Content />}
                />
                <Route path="/quiz/:bookIndex" element={<Quiz />} />
                {/* Redirect unknown routes to home */}
                <Route path="*" element={<Home searchItem={searchItem} />} />
              </Routes>
            </Container>
          </div>
        </StoryProvider>
      </Auth0ProviderWithNavigate>
    </Router>
  );
}

export default App;
