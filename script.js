document.addEventListener('DOMContentLoaded', () => {
    const fetchPostsButton = document.getElementById('fetch-posts-button');
    const postsContainer = document.getElementById('posts');
    const loadingIndicator = document.getElementById('loading');
    const errorMessage = document.getElementById('error');

    function showLoading() {
        loadingIndicator.style.display = 'block';
    }

    function hideLoading() {
        loadingIndicator.style.display = 'none';
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    function hideError() {
        errorMessage.style.display = 'none';
    }

    async function fetchPosts() {
        showLoading();
        hideError();
        try {
            const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
            const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users');
            if (!postsResponse.ok || !usersResponse.ok) {
                throw new Error('Failed to fetch data');
            }
            const posts = await postsResponse.json();
            const users = await usersResponse.json();
            displayPosts(posts, users);
        } catch (error) {
            showError(error.message);
        } finally {
            hideLoading();
        }
    }

    function displayPosts(posts, users) {
        postsContainer.innerHTML = '';
        posts.forEach(post => {
            const user = users.find(user => user.id === post.userId);
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.body}</p>
                <div class="user-info">
                    <p>Posted by: ${user.name} (${user.email})</p>
                </div>
            `;
            postElement.addEventListener('click', () => fetchPostDetails(post.id));
            postsContainer.appendChild(postElement);
        });
    }

    async function fetchPostDetails(postId) {
        showLoading();
        hideError();
        try {
            const postResponse = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
            const commentsResponse = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
            if (!postResponse.ok || !commentsResponse.ok) {
                throw new Error('Failed to fetch post details');
            }
            const post = await postResponse.json();
            const comments = await commentsResponse.json();
            displayPostDetails(post, comments);
        } catch (error) {
            showError(error.message);
        } finally {
            hideLoading();
        }
    }

    function displayPostDetails(post, comments) {
        postsContainer.innerHTML = '';
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.body}</p>
            <h3>Comments</h3>
        `;
        const commentsContainer = document.createElement('div');
        commentsContainer.className = 'comments';
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.innerHTML = `
                <p><strong>${comment.name}</strong> (${comment.email})</p>
                <p>${comment.body}</p>
            `;
            commentsContainer.appendChild(commentElement);
        });
        postElement.appendChild(commentsContainer);
        postsContainer.appendChild(postElement);
    }

    fetchPostsButton.addEventListener('click', fetchPosts);
});


