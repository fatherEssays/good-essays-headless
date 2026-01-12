import Link from 'next/link';

// React component for the homepage
export default function Home({ posts }) {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Good Essays Blog</h1>

      {posts.length === 0 && <p>No posts found.</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts.map((post) => (
          <li key={post.id} style={{ marginBottom: '30px' }}>
            <Link href={`/posts/${post.slug}`}>
              <h2>{post.title}</h2>
            </Link>
            <div
              dangerouslySetInnerHTML={{
                __html: post.content
                  ? post.content.slice(0, 200) + '...'
                  : 'No content available',
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

// Fetch posts at build time
export async function getStaticProps() {
  const endpoint = 'http://blog.good-essays.com/graphql'; // use HTTP or HTTPS depending on your site

  const query = `
    query {
      posts(first: 10) {
        nodes {
          id
          title
          slug
          content
        }
      }
    }
  `;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const json = await res.json();

    const posts = json.data?.posts?.nodes || [];

    return {
      props: { posts },
      revalidate: 60, // Rebuild every 60 seconds
    };
  } catch (error) {
    console.error('Error fetching posts:', error); // ✅ fixed syntax
    return { props: { posts: [] } };
  }
}
