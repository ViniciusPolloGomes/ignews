import {GetServerSideProps} from "next";
import {getSession} from "next-auth/client";
import { getPrismicClient } from "../../services/prismic";
import { RichText } from "prismic-dom";
import Head from "next/head";
import styles from './post.module.scss';

interface PostProps{
    post: {
        slug: string;
        title: string;
        content: string;
        updatedAt: string; 
    }
}

export default function Post({post} : PostProps ){
    return(
        <>
            <Head>
                <title>{post.title} | Ignews</title>
            </Head>

            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div 
                        className={styles.postContent}
                        dangerouslySetInnerHTML={{__html: post.content}}
                    />
                </article>
            </main>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({req, params}) =>{
    const session = await getSession({req})
    const {slug} = params;
    console.log(session.expires)
    console.log(session.user)
    console.log(session.activeSubscription)

    if(!session?.activeSubscription){    
        return{
            redirect:{
               destination:`/`,
               permanent: false,
            }
        }
    }

    const prismic = getPrismicClient(req)

    const response = await prismic.getByUID('publication',String(slug),{})
    
    const post ={ 
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-br', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }) 
    };
    if(!session?.activeSubscription){    
        return{
            redirect:{
               destination:`/posts/preview/${post.slug}`,
               permanent: false,
            }
        }
    }
    return{
        props: {
            post,
        }
    }

}