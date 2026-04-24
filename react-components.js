// React Components for CCB Cycling Website

// Menu Component
function NavigationMenu() {
  const menuItems = [
    { text: 'Home', href: '#' },
    { text: 'Roster', href: '#roster' },
    { text: 'Quiz', href: '#quiz' },
    { text: 'Schedule', href: '#schedule' },
    { text: 'Media', href: '#media' },
    { text: 'Map', href: '#map' },
    { text: 'Contact', href: '#contact' },
    { text: 'Blog', href: '#blog' }
  ];

  return (
    <nav>
      <ul className="menu-bar">
        {menuItems.map((item, index) => (
          <li key={index}>
            <a href={item.href}>{item.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Blog Updates Component
function BlogSection() {
  // Load updates from localStorage or use default
  const [updates, setUpdates] = React.useState(() => {
    const saved = localStorage.getItem('blogUpdates');
    if (saved) {
      try {
        return JSON.parse(saved).map(u => ({
          ...u,
          cheers: typeof u.cheers === 'number' ? u.cheers : 0,
          date: new Date(u.date)
        }));
      } catch (e) {
        return [{ id: 1, text: 'New team practice scheduled for tomorrow!', cheers: 0, date: new Date() }];
      }
    }
    return [{ id: 1, text: 'New team practice scheduled for tomorrow!', cheers: 0, date: new Date() }];
  });

  const [cheeredPosts, setCheeredPosts] = React.useState(() => {
    const saved = localStorage.getItem('blogCheeredPosts');
    if (!saved) return {};
    try {
      return JSON.parse(saved);
    } catch {
      return {};
    }
  });

  const pollQuestion = 'Which race are you most excited for this month?';
  const pollOptions = ['Redlands', 'Sea Otter', 'Tulsa Tough', 'Road Nationals'];
  const [pollVotes, setPollVotes] = React.useState(() => {
    const saved = localStorage.getItem('teamPollVotes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {};
      }
    }
    return {};
  });

  const [selectedPollOption, setSelectedPollOption] = React.useState(() => {
    return localStorage.getItem('teamPollChoice') || '';
  });
  
  const [newUpdate, setNewUpdate] = React.useState('');

  // Save updates to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('blogUpdates', JSON.stringify(updates));
  }, [updates]);

  React.useEffect(() => {
    localStorage.setItem('blogCheeredPosts', JSON.stringify(cheeredPosts));
  }, [cheeredPosts]);

  React.useEffect(() => {
    localStorage.setItem('teamPollVotes', JSON.stringify(pollVotes));
  }, [pollVotes]);

  React.useEffect(() => {
    localStorage.setItem('teamPollChoice', selectedPollOption);
  }, [selectedPollOption]);

  React.useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [updates]);

  const addUpdate = () => {
    if (newUpdate.trim()) {
      const newPost = {
        id: updates.length > 0 ? Math.max(...updates.map(u => u.id)) + 1 : 1,
        text: newUpdate,
        cheers: 0,
        date: new Date()
      };
      setUpdates([newPost, ...updates]);
      setNewUpdate('');
    }
  };

  const toggleCheer = (postId) => {
    const alreadyCheered = !!cheeredPosts[postId];

    setUpdates((prev) => prev.map((post) => {
      if (post.id !== postId) return post;
      return {
        ...post,
        cheers: Math.max(0, (post.cheers || 0) + (alreadyCheered ? -1 : 1))
      };
    }));

    setCheeredPosts((prev) => ({
      ...prev,
      [postId]: !alreadyCheered
    }));
  };

  const totalVotes = pollOptions.reduce((sum, option) => sum + (pollVotes[option] || 0), 0);

  const votePoll = (option) => {
    setPollVotes((prev) => {
      const next = { ...prev };
      if (selectedPollOption && next[selectedPollOption] > 0) {
        next[selectedPollOption] -= 1;
      }
      next[option] = (next[option] || 0) + 1;
      return next;
    });
    setSelectedPollOption(option);
  };

  return (
    <>
      <h2><i data-lucide="megaphone" className="icon section-icon" aria-hidden="true"></i>Live Updates</h2>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="poll-card" role="group" aria-label="Weekly team poll">
          <h3><i data-lucide="bar-chart-3" className="icon section-icon" aria-hidden="true"></i>Weekly Team Poll</h3>
          <p>{pollQuestion}</p>
          <div className="poll-options">
            {pollOptions.map((option) => {
              const votes = pollVotes[option] || 0;
              const percent = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
              const isSelected = selectedPollOption === option;
              return (
                <button
                  key={option}
                  type="button"
                  className={`poll-option ${isSelected ? 'active' : ''}`}
                  onClick={() => votePoll(option)}
                  aria-pressed={isSelected}
                >
                  <span>{option}</span>
                  <span>{votes} votes ({percent}%)</span>
                </button>
              );
            })}
          </div>
          <small>Total votes: {totalVotes}</small>
        </div>

        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={newUpdate}
            onChange={(e) => setNewUpdate(e.target.value)}
            placeholder="Add a new update..."
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '2px solid #6f8fd6',
              borderRadius: '8px',
              fontSize: '1rem',
              color: '#0b1f5a'
            }}
            onKeyPress={(e) => e.key === 'Enter' && addUpdate()}
          />
          <button
            onClick={addUpdate}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#b0005a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Post
          </button>
        </div>

        <div>
          {updates.length === 0 ? (
            <div className="blog-empty"><i data-lucide="notebook-text" className="icon section-icon" aria-hidden="true"></i>No updates yet. Check back after our next race!</div>
          ) : (
            updates.map((update) => (
              <div key={update.id} className="blog-update">
                <p>{update.text}</p>
                <small>{update.date.toLocaleString()}</small>
                <div className="blog-reactions">
                  <button
                    type="button"
                    className={`cheer-button ${cheeredPosts[update.id] ? 'active' : ''}`}
                    onClick={() => toggleCheer(update.id)}
                    aria-pressed={!!cheeredPosts[update.id]}
                    aria-label={`Cheer for post ${update.id}`}
                  >
                    <i data-lucide="party-popper" className="icon icon-inline" aria-hidden="true"></i>
                    {cheeredPosts[update.id] ? 'Cheered' : 'Cheer'} · {update.cheers || 0}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

// Render Menu
const menuContainer = document.getElementById('react-menu');
if (menuContainer) {
  ReactDOM.createRoot(menuContainer).render(<NavigationMenu />);
}

// Render Blog
const blogContainer = document.getElementById('react-blog');
if (blogContainer) {
  ReactDOM.createRoot(blogContainer).render(<BlogSection />);
}
