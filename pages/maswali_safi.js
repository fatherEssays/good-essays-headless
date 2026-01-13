// pages/maswali_safi.js
import client from '../lib/graphql-client';
import { gql } from '@apollo/client';

export async function getStaticProps() {
  try {
    const { data } = await client.query({
      query: gql`
        query GetPosts {
          posts {
            nodes {
              id
              title
              content
            }
          }
        }
      `,
    });

    return {
      props: {
        posts: data.posts?.nodes || [],
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error('GraphQL query error:', error);
    return {
      props: { posts: [] },
    };
  }
}

export default function MaswaliSafi({ posts }) {
  if (!posts || posts.length === 0) return <p>No posts found.</p>;

  return (
    <div>
      <h1>Posts from WordPress</h1>
      {posts.map((post) => (
        <div key={post.id} style={{ marginBottom: '2rem' }}>
          <h2>{post.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      ))}
    </div>
  );
}
