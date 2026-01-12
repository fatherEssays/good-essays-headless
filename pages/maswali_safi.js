import client from '../../lib/graphql-client';
import { gql } from '@apollo/client';

export default function Post({ post }) {
  return (
    <div>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}

export async function getStaticPaths() {
  const { data } = await client.query({
    query: gql`
      query {
        posts(first: 100) {
          nodes {
            slug
          }
        }
      }
    `,
  });

  const paths = data.posts.nodes.map(post => ({
    params: { slug: post.slug },
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const { data } = await client.query({
    query: gql`
      query($slug: ID!) {
        post(id: $slug, idType: SLUG) {
          title
          content
        }
      }
    `,
    variables: { slug: params.slug },
  });

  return { props: { post: data.post }, revalidate: 60 };
}
