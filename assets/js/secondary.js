
// ======================= Home page functions ==========================
async function fetchRecentPosts() {
    try {
        const response = await fetch('assets/js/posts.json');
        const data = await response.json();
        // Take first 3 posts (9,8,7) without reversing
        const recentPosts = data.posts.slice(0, 3);
        displayRecentPosts(recentPosts);
    } catch (error) {
        console.error('Error fetching recent posts:', error);
    }
}

function createRecentPostCard(post) {
    // Split categories if it's a string
    const categories = typeof post.category === 'string' 
        ? post.category.split(', ') 
        : post.category;
    
    const mainCategory = categories[0]; // Display first category as main

    return `
        <article class="new-post-card glass-morphism rounded-2xl overflow-hidden shadow-sm scroll-reveal">
            <div class="relative overflow-hidden aspect-video">
                <img src="${post.thumbnail}" alt="${post.title}" class="w-full h-full object-cover transition-transform duration-300 hover:scale-110">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">

                    <span class="absolute bottom-4 left-4 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-full">
                        ${mainCategory}
                    </span>
                    <span class="absolute bottom-4 right-3 px-3 py-1 text-white text-sm rounded-full">
                        ${new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>
            </div>
            <div class="p-6">
                <h3 class="text-xl font-bold mb-3 hover:text-blue-500 transition-colors line-clamp-2">
                    <a href="/post/${post.slug}">${post.title}</a>
                </h3>
                <p class="text-gray-600 mb-4 line-clamp-3">${post.description}</p>
                <div class="flex flex-wrap gap-2">
                    ${categories
                        .filter(cat => cat !== mainCategory)
                        .map(cat => `
                            <span class="text-sm text-gray-500">#${cat}</span>
                        `).join('')}
                </div>
            </div>
        </article>
    `;
}

function displayRecentPosts(posts) {
    const recentPostsGrid = document.getElementById('recentPostsGrid');
    if (!recentPostsGrid) return;

    recentPostsGrid.innerHTML = posts.map(post => createRecentPostCard(post)).join('');
    
    // Initialize scroll reveal for new elements
    scrollReveal();
}

// Add this to your DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    fetchRecentPosts();
});


// ============================ Contact Page ======================
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitButton = document.getElementById('submitButton');
    const submitText = document.getElementById('submitText');
    const submitSpinner = document.getElementById('submitSpinner');
    const submitIcon = document.getElementById('submitIcon');
    const alertContainer = document.getElementById('formAlert');

    // Form validation
    function validateForm() {
        let isValid = true;
        const errors = {};

        // Reset previous errors
        document.querySelectorAll('.error-message').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));

        // Validate name
        const name = document.getElementById('name');
        if (!name.value.trim()) {
            errors.name = 'Name is required';
            isValid = false;
        }

        // Validate email
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            errors.email = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(email.value.trim())) {
            errors.email = 'Please enter a valid email address';
            isValid = false;
        }

        // Validate message
        const message = document.getElementById('message');
        if (!message.value.trim()) {
            errors.message = 'Message is required';
            isValid = false;
        }

        // Show errors if any
        Object.keys(errors).forEach(field => {
            const input = document.getElementById(field);
            const errorElement = input.parentElement.querySelector('.error-message');
            input.classList.add('error');
            errorElement.textContent = errors[field];
            errorElement.classList.remove('hidden');
        });

        return isValid;
    }

    // Show alert message
    function showAlert(message, type) {
        alertContainer.className = `rounded-lg p-4 mb-6 text-sm ${type === 'success' ? 'alert-success' : 'alert-error'}`;
        alertContainer.textContent = message;
        alertContainer.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            alertContainer.classList.add('hidden');
        }, 5000);
    }

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (!validateForm()) {
            showAlert('Please fill in all required fields correctly.', 'error');
            return;
        }

        // Show loading state
        submitButton.disabled = true;
        submitText.textContent = 'Sending...';
        submitSpinner.classList.remove('hidden');
        submitIcon.classList.add('hidden');

        try {
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                social: document.getElementById('social').value,
                message: document.getElementById('message').value
            };

            // Construct email body
            const emailBody = `
Name: ${formData.name}
Email: ${formData.email}
Social Media: ${formData.social}
Message:

${formData.message}
            `.trim();

            // Open email client
            window.location.href = `mailto:invizher@gmail.com?subject=Contact From ${formData.name}&body=${encodeURIComponent(emailBody)}`;

            // Show success message
            showAlert('Sending message...', 'success');
            form.reset();

        } catch (error) {
            showAlert('An error occurred. Please try again later.', 'error');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitText.textContent = 'Send Message';
            submitSpinner.classList.add('hidden');
            submitIcon.classList.remove('hidden');
        }
    });

    // Add input animation for better user experience
    document.querySelectorAll('.form-input').forEach(input => {
        // Ensure proper label position on page load if input has value
        if (input.value) {
            input.classList.add('has-value');
        }

        // Handle input changes
        input.addEventListener('input', function() {
            if (this.value) {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
    });
});


// ======================= FAQ Page =================
// FAQ Interaction
document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
        // Close other items
        document.querySelectorAll('.faq-item').forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle current item
        item.classList.toggle('active');
    });
});


//===================== ARTICLE PAGE =====================

//share section
document.addEventListener('DOMContentLoaded', () => {
    const shareBtn = document.getElementById('shareBtn');
    const shareDropdown = document.getElementById('shareDropdown');
    const chevron = document.getElementById('chevron');
    const shareOptions = document.querySelectorAll('.share-option');
    const shareUrl = document.getElementById('shareUrl');
    const copyBtn = document.getElementById('copyBtn');
    const shareAlert = document.getElementById('shareAlert');
    
    // Get the current URL and article title
    const currentUrl = window.location.href;
    const articleTitle = document.querySelector('h1')?.textContent || 'Article';
    
    // Set the URL in the input field
    shareUrl.value = currentUrl;
    
    let isOpen = false;

    function toggleDropdown() {
        isOpen = !isOpen;
        
        if (isOpen) {
            shareDropdown.classList.remove('opacity-0', '-translate-y-2', 'invisible');
            shareDropdown.classList.add('opacity-100', 'translate-y-0');
            chevron.classList.add('rotate-180');
        } else {
            shareDropdown.classList.add('opacity-0', '-translate-y-2', 'invisible');
            shareDropdown.classList.remove('opacity-100', 'translate-y-0');
            chevron.classList.remove('rotate-180');
        }
    }

    // Toggle dropdown
    shareBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (isOpen && !shareDropdown.contains(e.target) && !shareBtn.contains(e.target)) {
            toggleDropdown();
        }
    });

    // Copy URL functionality
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(currentUrl);
            
            // Show success state
            copyBtn.innerHTML = '<i class="fas fa-check"></i><span>Copied!</span>';
            shareAlert.classList.remove('hidden');
            
            // Reset after 2 seconds
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="far fa-copy"></i><span>Copy</span>';
                shareAlert.classList.add('hidden');
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    });

    // Share functionality
    shareOptions.forEach(option => {
        option.addEventListener('click', () => {
            const platform = option.getAttribute('data-platform');
            let shareUrl;

            switch(platform) {
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=${encodeURIComponent(`${articleTitle}\n${currentUrl}`)}`;
                    break;
                case 'telegram':
                    shareUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(articleTitle)}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(articleTitle)}`;
                    break;
                case 'email':
                    shareUrl = `mailto:?subject=${encodeURIComponent(articleTitle)}&body=${encodeURIComponent(`Check out this article:\n${currentUrl}`)}`;
                    break;
            }

            if (shareUrl) {
                window.open(shareUrl, '_blank');
                toggleDropdown();
            }
        });
    });
});
        
        // table of content
    // Updated JavaScript for improved TOC visibility timing
document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const tocLinks = document.querySelectorAll('.toc-link');
    const sections = document.querySelectorAll('section[id]');
    const progressBar = document.getElementById('progress-indicator');
    const readingProgress = document.getElementById('reading-progress');
    const currentSection = document.getElementById('current-section');
    const mobileToc = document.getElementById('mobile-toc');
    const articleHeader = document.querySelector('header.container'); // Article header
    const article = document.querySelector('article'); // Main article
    const articleFooter = document.querySelector('article footer'); // Article footer

    // Calculate article boundaries
    function getArticleBoundaries() {
        const headerRect = articleHeader.getBoundingClientRect();
        const footerRect = articleFooter.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        return {
            headerTop: headerRect.top,
            headerBottom: headerRect.bottom,
            footerTop: footerRect.top,
            footerBottom: footerRect.bottom,
            windowHeight: windowHeight
        };
    }

    // Update mobile TOC visibility
    function updateMobileTocVisibility() {
        const boundaries = getArticleBoundaries();

        // Show TOC when article header is in view or has been scrolled past
        // Hide TOC when footer comes into view
        if (boundaries.headerTop <= boundaries.windowHeight && boundaries.footerTop > boundaries.windowHeight) {
            mobileToc.classList.add('visible');
        } else {
            mobileToc.classList.remove('visible');
        }
    }

    // Calculate reading progress based on article position
    function updateReadingProgress() {
        const articleRect = article.getBoundingClientRect();
        const headerRect = articleHeader.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate total scrollable distance of the article
        const totalDistance = article.offsetHeight;
        
        // Calculate how far we've scrolled through the article
        const scrolled = window.pageYOffset + windowHeight - article.offsetTop;
        
        // Calculate progress percentage
        const progress = Math.max(0, Math.min(100, (scrolled / totalDistance) * 100));
        
        // Update progress bar and text
        progressBar.style.width = `${progress}%`;
        readingProgress.textContent = `${Math.round(progress)}% read`;
    }

    // Track active section
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                tocLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    if (link.getAttribute('href') === `#${id}`) {
                        currentSection.textContent = link.textContent;
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-20% 0px -35% 0px'
    });

    // Observe all sections
    sections.forEach(section => sectionObserver.observe(section));

    // Smooth scroll to section
    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Throttle function
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Event listeners with throttling
    const handleScroll = throttle(() => {
        updateMobileTocVisibility();
        updateReadingProgress();
    }, 100);

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    // Initial call to set initial state
    handleScroll();
});
       

document.addEventListener('DOMContentLoaded', () => {
    // Fetch posts data from posts.json
    fetch('posts.json')
        .then(response => response.json())
        .then(data => {
            const posts = data.posts;
            
            // Get current article URL to exclude it from recommendations
            const currentPath = window.location.pathname;
            
            // Filter out current article and get two random articles
            const otherPosts = posts.filter(post => '/' + post.slug !== currentPath);
            const randomPosts = [];
            
            // Get two random posts
            for (let i = 0; i < 2 && otherPosts.length > 0; i++) {
                const randomIndex = Math.floor(Math.random() * otherPosts.length);
                randomPosts.push(otherPosts.splice(randomIndex, 1)[0]);
            }
            
            // Get container and clear existing content
            const container = document.getElementById('random-articles');
            container.innerHTML = '';
            
            // Create and append article cards
            randomPosts.forEach(post => {
                const articleCard = `
                    <div class="group">
                        <a href="/${post.slug}" class="block">
                            <div class="relative overflow-hidden rounded-xl">
                                <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10"></div>
                                <img 
                                    src="${post.thumbnail}" 
                                    alt="${post.title}" 
                                    class="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    onerror="this.src='/api/placeholder/400/320'"
                                >
                                <div class="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
                                    <div class="flex items-center gap-2 mb-2">
                                        <span class="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                                            ${post.category.split(',')[0].trim()}
                                        </span>
                                        <span class="text-sm">${post.readTime}</span>
                                    </div>
                                    <h4 class="text-lg font-semibold leading-snug group-hover:text-blue-300 transition-colors">
                                        ${post.title}
                                    </h4>
                                </div>
                            </div>
                        </a>
                    </div>
                `;
                
                container.insertAdjacentHTML('beforeend', articleCard);
            });
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
            document.getElementById('random-articles').innerHTML = `
                <div class="col-span-full text-center text-gray-500">
                    Unable to load recommended articles
                </div>
            `;
        });
});