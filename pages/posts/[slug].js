import { useRouter } from 'next/router';
import Link from 'next/link';

export default function PostPage({ post, menuItems }) {
  const router = useRouter();

  if (router.isFallback) return <p>Loading...</p>;
  if (!post) return <p>Post not found.</p>;

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

      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}

export async function getStaticPaths() {
  const endpoint = 'http://blog.good-essays.com/graphql';

  const query = `
    query {
      posts(first: 50) {
        nodes {
          slug
        }
      }
    }
  `;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();

  const paths =
    json.data?.posts?.nodes.map((post) => ({
      params: { slug: post.slug },
    })) || [];

  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const endpoint = 'http://blog.good-essays.com/graphql';

  // Query for the single post
  const postQuery = `
    query ($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        title
        content
        slug
      }
    }
  `;

  // Query for the WordPress menu
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
    // Fetch post
    const postRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: postQuery,
        variables: { slug: params.slug },
      }),
    });
    const postJson = await postRes.json();
    const post = postJson.data?.post || null;

    // Fetch menu
    const menuRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: menuQuery }),
    });
    const menuJson = await menuRes.json();
    const menuItems = menuJson.data?.menu?.menuItems?.nodes || [];

    return {
      props: { post, menuItems },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error fetching post or menu:', error);
    return { props: { post: null, menuItems: [] } };
  }
}

