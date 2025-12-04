const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(bodyParser.json());

const resources = [
  {
    resourceId: 'LIB_001',
    title: 'Calculus: Early Transcendentals',
    author: 'James Stewart',
    type: 'BOOK',
    subject: 'Mathematics',
    isbn: '978-1285741550',
    publishYear: 2015,
    availableOnline: true,
    downloadUrl: 'https://library.hcmut.edu.vn/download/LIB_001',
    description: 'Comprehensive calculus textbook covering limits, derivatives, integrals, and more.',
    tags: ['calculus', 'mathematics', 'derivatives', 'integrals']
  },
  {
    resourceId: 'LIB_002',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen, Charles E. Leiserson',
    type: 'BOOK',
    subject: 'Computer Science',
    isbn: '978-0262033848',
    publishYear: 2009,
    availableOnline: true,
    downloadUrl: 'https://library.hcmut.edu.vn/download/LIB_002',
    description: 'The most comprehensive book on algorithms.',
    tags: ['algorithms', 'computer science', 'data structures', 'sorting']
  },
  {
    resourceId: 'LIB_003',
    title: 'Physics for Scientists and Engineers',
    author: 'Raymond A. Serway, John W. Jewett',
    type: 'BOOK',
    subject: 'Physics',
    isbn: '978-1133947271',
    publishYear: 2013,
    availableOnline: false,
    downloadUrl: null,
    description: 'A comprehensive physics textbook.',
    tags: ['physics', 'mechanics', 'thermodynamics', 'electromagnetism']
  },
  {
    resourceId: 'LIB_004',
    title: 'Linear Algebra and Its Applications',
    author: 'David C. Lay',
    type: 'BOOK',
    subject: 'Mathematics',
    isbn: '978-0321982384',
    publishYear: 2015,
    availableOnline: true,
    downloadUrl: 'https://library.hcmut.edu.vn/download/LIB_004',
    description: 'Introduction to linear algebra with applications.',
    tags: ['linear algebra', 'mathematics', 'matrices', 'vectors']
  },
  {
    resourceId: 'LIB_005',
    title: 'Database System Concepts',
    author: 'Abraham Silberschatz, Henry F. Korth',
    type: 'BOOK',
    subject: 'Computer Science',
    isbn: '978-0073523323',
    publishYear: 2010,
    availableOnline: true,
    downloadUrl: 'https://library.hcmut.edu.vn/download/LIB_005',
    description: 'Comprehensive database systems textbook.',
    tags: ['database', 'sql', 'relational', 'computer science']
  },
  {
    resourceId: 'VID_001',
    title: 'MIT OpenCourseWare - Linear Algebra',
    author: 'Gilbert Strang',
    type: 'VIDEO',
    subject: 'Mathematics',
    publishYear: 2005,
    availableOnline: true,
    downloadUrl: 'https://ocw.mit.edu/courses/mathematics/18-06-linear-algebra-spring-2010/',
    description: 'Complete video lectures on linear algebra.',
    tags: ['linear algebra', 'video', 'mit', 'mathematics']
  },
  {
    resourceId: 'JOU_001',
    title: 'Nature - Machine Learning Applications',
    author: 'Various',
    type: 'JOURNAL',
    subject: 'Computer Science',
    publishYear: 2024,
    availableOnline: true,
    downloadUrl: 'https://library.hcmut.edu.vn/journals/nature-ml',
    description: 'Recent journal articles on machine learning.',
    tags: ['machine learning', 'ai', 'journal', 'research']
  },
  {
    resourceId: 'DOC_001',
    title: 'HCMUT Course Catalog 2024',
    author: 'HCMUT',
    type: 'DOCUMENT',
    subject: 'General',
    publishYear: 2024,
    availableOnline: true,
    downloadUrl: 'https://library.hcmut.edu.vn/docs/catalog-2024.pdf',
    description: 'Official course catalog for HCMUT.',
    tags: ['course', 'catalog', 'hcmut']
  }
];

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'HCMUT Library Mock' });
});

app.get('/api/resources/search', (req, res) => {
  const { query, subject, type, page = 1, limit = 10 } = req.query;
  
  let filtered = [...resources];
  
  if (query) {
    const searchLower = query.toLowerCase();
    filtered = filtered.filter(r => 
      r.title.toLowerCase().includes(searchLower) ||
      r.author.toLowerCase().includes(searchLower) ||
      r.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      r.description.toLowerCase().includes(searchLower)
    );
  }
  
  // Filter by subject
  if (subject) {
    filtered = filtered.filter(r => 
      r.subject.toLowerCase() === subject.toLowerCase()
    );
  }
  
  // Filter by type
  if (type) {
    filtered = filtered.filter(r => r.type === type.toUpperCase());
  }
  
  // Pagination
  const startIndex = (parseInt(page) - 1) * parseInt(limit);
  const endIndex = startIndex + parseInt(limit);
  const paginatedResults = filtered.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: paginatedResults,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / parseInt(limit))
    }
  });
});

app.get('/api/resources/:id', (req, res) => {
  const { id } = req.params;
  
  const resource = resources.find(r => r.resourceId === id);
  
  if (!resource) {
    return res.status(404).json({
      success: false,
      message: 'Resource not found'
    });
  }
  
  res.json({
    success: true,
    data: resource
  });
});

app.get('/api/resources', (req, res) => {
  res.json({
    success: true,
    data: resources,
    total: resources.length
  });
});

// Get subjects
app.get('/api/subjects', (req, res) => {
  const subjects = [...new Set(resources.map(r => r.subject))];
  
  res.json({
    success: true,
    data: subjects
  });
});

app.get('/api/types', (req, res) => {
  const types = [...new Set(resources.map(r => r.type))];
  
  res.json({
    success: true,
    data: types
  });
});

app.get('/api/resources/popular', (req, res) => {
  const popular = resources
    .filter(r => r.availableOnline)
    .slice(0, 5);
  
  res.json({
    success: true,
    data: popular
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`📚 Mock HCMUT Library running on port ${PORT}`);
  console.log(`📖 Mock resources loaded: ${resources.length}`);
  console.log(`   - Books: ${resources.filter(r => r.type === 'BOOK').length}`);
  console.log(`   - Videos: ${resources.filter(r => r.type === 'VIDEO').length}`);
  console.log(`   - Journals: ${resources.filter(r => r.type === 'JOURNAL').length}`);
  console.log(`   - Documents: ${resources.filter(r => r.type === 'DOCUMENT').length}`);
});
