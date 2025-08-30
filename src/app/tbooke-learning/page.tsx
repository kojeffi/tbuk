'use client';

import { useState, useEffect, useContext, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaSearch, FaSlidersH, FaVideo, FaEdit, FaFolderOpen, FaCalendar, FaEye, FaTimes, FaComments, FaExclamationCircle, FaBook, FaGraduationCap, FaHistory, FaBookmark, FaUserFriends, FaUsers, FaNewspaper } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import { AuthContext } from '@/components/AuthContext';
import { debounce } from 'lodash';
import styles from '@/components/TbookeLearning.module.css';

const TEAL = '#008080';

const TbookeLearning = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableTopics, setAvailableTopics] = useState([]);
  const [showButtons, setShowButtons] = useState(true);

  // Safely access AuthContext with null check
  const authContext = useContext(AuthContext);
  const { authToken, profileData, loading: authLoading } = authContext || {};
  const router = useRouter();

  const fetchContents = useCallback(async () => {
    if (!authToken) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('https://tbooke.net/api/tbooke-learning', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (response.data && Array.isArray(response.data.contents)) {
        setContents(response.data.contents);

        const categoriesSet = new Set();
        const topicsSet = new Set();

        response.data.contents.forEach(content => {
          if (content.content_category) {
            content.content_category.split(',').forEach(cat => {
              categoriesSet.add(cat.trim());
            });
          }

          if (content.topic_id) {
            topicsSet.add(content.topic_id.toString());
          }
        });

        setAvailableCategories(
          Array.from(categoriesSet).map(cat => ({
            id: cat,
            name: cat
          }))
        );

        setAvailableTopics(
          Array.from(topicsSet).map(topicId => ({
            id: topicId,
            name: `Topic ${topicId}`
          }))
        );
      } else {
        setContents([]);
        setAvailableCategories([]);
        setAvailableTopics([]);
      }
    } catch (error) {
      console.error('Fetch Contents Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [authToken]);

  useEffect(() => {
    // Only fetch contents if we have a valid auth token
    if (authToken) {
      fetchContents();
    } else if (authLoading === false) {
      // If auth loading is done and no token, set loading to false
      setLoading(false);
    }
  }, [authToken, authLoading, fetchContents]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchContents();
  }, [fetchContents]);

  const toggleCategory = useCallback((categoryName) => {
    setSelectedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
  }, []);

  const toggleTopic = useCallback((topicId) => {
    setSelectedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedTopics([]);
    setSearchQuery('');
  }, []);

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const cleanContent = useCallback((text) => {
    return text ? text.replace(/&nbsp;/g, ' ').replace(/<[^>]+>/g, '').trim() : '';
  }, []);

  const handleProfileNavigation = useCallback((contentUser) => {
    if (!contentUser?.username) return;

    if (contentUser.username === profileData?.username) {
      router.push('/profile');
    } else {
      router.push(`/profile/${contentUser.username}`);
    }
  }, [profileData, router]);

  const handleSearchChange = useCallback(
    debounce((query) => {
      setSearchQuery(query);
    }, 300),
    []
  );

  const filteredContents = useMemo(() => {
    let filtered = [...contents];

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((content) => {
        const title = content.content_title ? content.content_title.toLowerCase() : '';
        const creatorFirstName = content.user?.first_name ? content.user.first_name.toLowerCase() : '';
        const creatorLastName = content.user?.surname ? content.user.surname.toLowerCase() : '';
        return (
          title.includes(query) ||
          creatorFirstName.includes(query) ||
          creatorLastName.includes(query)
        );
      });
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(content => {
        if (!content.content_category) return false;
        const contentCategories = content.content_category.split(',').map(c => c.trim());
        return selectedCategories.some(cat =>
          contentCategories.includes(cat)
        );
      });
    }

    if (selectedTopics.length > 0) {
      filtered = filtered.filter(content => {
        if (!content.topic_id) return false;
        return selectedTopics.includes(content.topic_id.toString());
      });
    }

    return filtered;
  }, [contents, searchQuery, selectedCategories, selectedTopics]);

  const renderButtons = useMemo(() => {
    if (authLoading) {
      return <div className={styles.loader}></div>;
    }

    if (!authToken) {
      return null;
    }

    return (
      <div className={styles.buttonContainer}>
        <button
          className={styles.secondaryButton}
          onClick={() => router.push('/create-live-class')}
        >
          <FaVideo className={styles.buttonIcon} />
          <span>Schedule Class</span>
        </button>

        <button
          className={styles.primaryButton}
          onClick={() => router.push('/create-content')}
        >
          <FaEdit className={styles.buttonIcon} />
          <span>Create Content</span>
        </button>

        <button
          className={styles.myContentButton}
          onClick={() => router.push('/my-content')}
        >
          <FaFolderOpen className={styles.buttonIcon} />
          <span>My Content</span>
        </button>
      </div>
    );
  }, [authLoading, authToken, router]);

  const ContentCard = useCallback(({ content }) => (
    <div className={styles.card}>
      <div 
        className={styles.thumbnailContainer}
        onClick={() => router.push(`/content/${content.slug}`)}
      >
        <img
          src={
            content.content_thumbnail
              ? `https://tbooke.net/storage/${content.content_thumbnail}`
              : '/images/default-bg.jpg'
          }
          className={styles.thumbnail}
          alt={content.content_title || 'Content thumbnail'}
          onError={(e) => {
            e.target.src = '/images/default-bg.jpg';
          }}
        />
      </div>

      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <div className={styles.authorSection}>
            <div className={styles.profileContainer}>
              <img
                className={styles.avatar}
                src={
                  content.user?.profile_picture && typeof content.user.profile_picture === 'string'
                    ? `https://tbooke.net/storage/${content.user.profile_picture}`
                    : '/images/avatar.png'
                }
                alt="Profile"
                onError={(e) => {
                  e.target.src = '/images/avatar.png';
                }}
              />
            </div>
            <div 
              className={styles.author}
              onClick={() => content.user && handleProfileNavigation(content.user)}
            >
              {content?.user?.profile_type === 'institution'
                ? content?.user?.institutionDetails?.institution_name || 'Institution Name Unavailable'
                : `${content?.user?.first_name || ''} ${content?.user?.surname || ''}`.trim() || 'Unknown Author'}
            </div>
          </div>
          
          <div 
            className={styles.contentTitle}
            onClick={() => router.push(`/content/${content.slug}`)}
          >
            {content.content_title || 'Untitled Content'}
          </div>

          {content.content_category && (
            <div className={styles.tagsContainer}>
              {content.content_category.split(',').map((category, index) => (
                <div key={index} className={styles.tagPill}>
                  <span className={styles.tagText}>{category.trim()}</span>
                </div>
              ))}
            </div>
          )}

          <div className={styles.contentStats}>
            <div className={styles.statItem}>
              <FaCalendar className={styles.statIcon} />
              <span className={styles.statText}>{content.created_at ? formatDate(content.created_at) : 'Unknown'}</span>
            </div>
            <div className={styles.statItem}>
              <FaEye className={styles.statIcon} />
              <span className={styles.statText}>{content?.visits ?? 0}</span>
            </div>
          </div>
        </div>
        
        <div className={styles.cardBody}>
          <p className={styles.description}>
            {cleanContent(content.content)
              ? `${cleanContent(content.content).substring(0, 100)}..`
              : 'No description available.'}
          </p>

          <button
            className={styles.startButton}
            onClick={() => router.push(`/content/${content.slug}`)}
          >
            Start Learning
          </button>
        </div>
      </div>
    </div>
  ), [cleanContent, formatDate, router, handleProfileNavigation]);

  const FilterModal = useCallback(() => (
    <div className={`${styles.modal} ${showFilters ? styles.modalVisible : ''}`}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Filter Options</h2>
          <button 
            className={styles.modalClose}
            onClick={() => setShowFilters(false)}
          >
            <FaTimes />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.filterSection}>
            <h3 className={styles.filterSectionTitle}>Education Level</h3>
            {availableCategories.length > 0 ? (
              <div className={styles.categoriesContainer}>
                {availableCategories.map(category => (
                  <button
                    key={category.id}
                    className={`${styles.categoryPill} ${selectedCategories.includes(category.id) ? styles.selectedCategoryPill : ''}`}
                    onClick={() => toggleCategory(category.id)}
                  >
                    <span className={`${styles.categoryText} ${selectedCategories.includes(category.id) ? styles.selectedCategoryText : ''}`}>
                      {category.name}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className={styles.noFiltersText}>No education levels available</p>
            )}
          </div>

          <div className={styles.filterSection}>
            <h3 className={styles.filterSectionTitle}>Topics</h3>
            {availableTopics.length > 0 ? (
              <div className={styles.categoriesContainer}>
                {availableTopics.map(topic => (
                  <button
                    key={topic.id}
                    className={`${styles.categoryPill} ${selectedTopics.includes(topic.id) ? styles.selectedCategoryPill : ''}`}
                    onClick={() => toggleTopic(topic.id)}
                  >
                    <span className={`${styles.categoryText} ${selectedTopics.includes(topic.id) ? styles.selectedCategoryText : ''}`}>
                      {topic.name}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className={styles.noFiltersText}>No topics available</p>
            )}
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button
            className={styles.clearFiltersButton}
            onClick={clearFilters}
          >
            Clear All Filters
          </button>
          <button
            className={styles.applyFiltersButton}
            onClick={() => setShowFilters(false)}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  ), [availableCategories, availableTopics, clearFilters, selectedCategories, selectedTopics, showFilters, toggleCategory, toggleTopic]);

  // Add loading state for better UX - moved to the end after all hooks
  if (authLoading) {
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Navbar />
      
      {/* Main grid layout */}
      <div className={styles.gridContainer}>
        {/* Left sidebar (3 columns) - LinkedIn style */}
        <div className={styles.gridColumn}>
          {/* Profile Card - Added above Learning Resources */}
          {authToken && profileData && (
            <div className={styles.profileCard}>
              <div className={styles.profileBackground}>
                <img 
                  src="/images/avatar.png" 
                  alt="Background" 
                  className={styles.profileBackgroundImage}
                />
              </div>
              <div className={styles.profileInfo}>
                <div className={styles.profileImageContainer}>
                  <img
                    src={
                      profileData.profile_picture && typeof profileData.profile_picture === 'string'
                        ? `https://tbooke.net/storage/${profileData.profile_picture}`
                        : '/images/avatar.png'
                    }
                    alt="Profile"
                    className={styles.profileImage}
                    onError={(e) => {
                      e.target.src = '/images/avatar.png';
                    }}
                  />
                </div>
                <h3 className={styles.profileName}>
                  {profileData.profile_type === 'institution'
                    ? profileData.institutionDetails?.institution_name || 'Institution Name'
                    : `${profileData.first_name || ''} ${profileData.surname || ''}`.trim() || 'User Name'}
                </h3>
                <p className={styles.profileTitle}>
                  {profileData.profile_type === 'institution' ? 'Educational Institution' : 'Educator/Student'}
                </p>
              </div>
            </div>
          )}
          
          <div className={styles.sidebarCard}>
            <div className={styles.sidebarHeader}>
              <h3 className={styles.sidebarTitle}>Learning Resources</h3>
            </div>
            <div className={styles.sidebarContent}>
              <button className={styles.sidebarItem} onClick={() => router.push('/my-content')}>
                <FaBook className={styles.sidebarIcon} />
                <span>My Content</span>
              </button>
              
              <button className={styles.sidebarItem} onClick={() => router.push('/saved-content')}>
                <FaBookmark className={styles.sidebarIcon} />
                <span>Saved Content</span>
              </button>
              
              <button className={styles.sidebarItem} onClick={() => router.push('/learning-history')}>
                <FaHistory className={styles.sidebarIcon} />
                <span>Learning History</span>
              </button>
              
              <button className={styles.sidebarItem} onClick={() => router.push('/live-classes')}>
                <FaVideo className={styles.sidebarIcon} />
                <span>Live Classes</span>
              </button>
              
              <button className={styles.sidebarItem} onClick={() => router.push('/educators')}>
                <FaGraduationCap className={styles.sidebarIcon} />
                <span>Top Educators</span>
              </button>
            </div>
          </div>
          
          <div className={styles.sidebarCard}>
            <div className={styles.sidebarHeader}>
              <h3 className={styles.sidebarTitle}>My Network</h3>
            </div>
            <div className={styles.sidebarContent}>
              <button className={styles.sidebarItem} onClick={() => router.push('/connections')}>
                <FaUserFriends className={styles.sidebarIcon} />
                <span>Connections</span>
                <span className={styles.sidebarBadge}>123</span>
              </button>
              
              <button className={styles.sidebarItem} onClick={() => router.push('/groups')}>
                <FaUsers className={styles.sidebarIcon} />
                <span>Groups</span>
                <span className={styles.sidebarBadge}>5</span>
              </button>
              
              <button className={styles.sidebarItem} onClick={() => router.push('/followed-topics')}>
                <FaNewspaper className={styles.sidebarIcon} />
                <span>Followed Topics</span>
                <span className={styles.sidebarBadge}>8</span>
              </button>
            </div>
          </div>
          
          <div className={styles.sidebarCard}>
            <div className={styles.sidebarHeader}>
              <h3 className={styles.sidebarTitle}>Recent Activities</h3>
            </div>
            <div className={styles.sidebarContent}>
              <div className={styles.activityItem}>
                <div className={styles.activityText}>You completed "Advanced Calculus"</div>
                <div className={styles.activityTime}>2 hours ago</div>
              </div>
              
              <div className={styles.activityItem}>
                <div className={styles.activityText}>You saved "Introduction to AI"</div>
                <div className={styles.activityTime}>1 day ago</div>
              </div>
              
              <div className={styles.activityItem}>
                <div className={styles.activityText}>You joined "Physics Enthusiasts" group</div>
                <div className={styles.activityTime}>3 days ago</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Middle div (6 columns) - contains search and buttons */}
        <div className={styles.gridColumnMiddle}>
          <div className={styles.searchSection}>
            <div className={styles.searchContainer}>
              <div className={styles.searchInputContainer}>
                <FaSearch className={styles.searchIcon} />
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Search by title, creator, or categories"
                  defaultValue={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
                <button
                  className={styles.filterButton}
                  onClick={() => setShowFilters(true)}
                >
                  <FaSlidersH />
                  {(selectedCategories.length > 0 || selectedTopics.length > 0) && (
                    <span className={styles.filterBadge}>
                      {selectedCategories.length + selectedTopics.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
            
            {renderButtons}
          </div>

          {loading ? (
            <div className={styles.loaderContainer}>
              <div className={styles.loader}></div>
            </div>
          ) : filteredContents.length === 0 ? (
            <div className={styles.noResultsContainer}>
              <FaExclamationCircle className={styles.noResultsIcon} />
              <p className={styles.noContentText}>No contents found matching your criteria.</p>
              <button onClick={clearFilters} className={styles.clearFiltersLink}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className={styles.contentList}>
              {filteredContents.map(content => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          )}
        </div>
        
        {/* Right empty div (3 columns) */}
        <div className={styles.gridColumn}></div>
      </div>

      {/* Floating LiveClasses Button */}
      <button
        className={`${styles.chatbotButton} ${styles.liveClassesButton}`}
        onClick={() => router.push('/live-classes')}
      >
        <div className={`${styles.chatbotIconContainer} ${styles.liveClassesIconContainer}`}>
          <FaVideo />
        </div>
      </button>
      
      {/* Floating Chatbot Button */}
      <button
        className={`${styles.chatbotButton} ${styles.assistanceButton}`}
        onClick={() => router.push('/chatbot')}
      >
        <div className={styles.chatbotIconContainer}>
          <FaComments />
        </div>
      </button>
      
      <FilterModal />
    </div>
  );
};

export default TbookeLearning;