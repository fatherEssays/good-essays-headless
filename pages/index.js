import Link from 'next/link';

// Blog index page
export default function Blog({ posts, menuItems }) {
  return (
    <div style={{ padding: '20px' }}>
      {/* WordPress menu on top */}
      <nav style={{ marginBottom: '40px' }}>
        {menuItems?.map((item) => (
          <Link
            key={item.id}
            href={item.path}
            style={{ marginRight: '20px', textDecoration: 'none', color: 'blue' }}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <h1>Good Essays Blog</h1>

      {posts.length === 0 && <p>No posts found.</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts.map((post) => (
          <li key={post.id} style={{ marginBottom: '20px' }}>
            {/* Link to the single blog page */}
            <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'black' }}>
              <h2>{post.title}</h2>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Fetch posts and menu at build time
export async function getStaticProps() {
  const endpoint = 'http://blog.good-essays.com/graphql';

  const postsQuery = `
    query {
      posts(first: 10) {
        nodes {
          id
          title
          slug
        }
      }
    }
  `;

  const menuQuery = `
    query {
      menu(id: "PRIMARY", idType: NAME) {
        menuItems {
          nodes {
            id
            label
            path
          }
        }
      }
    }
  `;

  try {
    // Fetch posts
    const postRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: postsQuery }),
    });
    const postJson = await postRes.json();
    const posts = postJson.data?.posts?.nodes || [];

    // Fetch menu
    const menuRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: menuQuery }),
    });
    const menuJson = await menuRes.json();
    const menuItems = menuJson.data?.menu?.menuItems?.nodes || [];

    return {
      props: { posts, menuItems },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error fetching posts or menu:', error);
    return { props: { posts: [], menuItems: [] } };
  }
}
