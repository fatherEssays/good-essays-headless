import { useRouter } from 'next/router';

export default function PostPage({ post }) {
  const router = useRouter();

  if (router.isFallback) return <p>Loading...</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <div style={{ padding: '20px' }}>
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

  const query = `
    query ($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        title
        content
        slug
      }
    }
  `;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables: { slug: params.slug },
    }),
  });

  const json = await res.json();

  return {
    props: {
      post: json.data?.post || null,
    },
    revalidate: 60,
  };
}
