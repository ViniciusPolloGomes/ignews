import { SigInButton } from '../SignInButton';
import {useRouter} from 'next/router';
import { ActiveLink } from '../ActiveLink';

import styles from './styles.module.scss';

export function Header(){
    const {asPath} = useRouter();
    console.log(asPath);

    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src="/images/logo.svg" alt=""/>
                <nav>
                    <ActiveLink activeClassName ={styles.active} href="/">
                        <a>Home</a>
                    </ActiveLink>
                    <ActiveLink activeClassName ={styles.active} href="/posts" >
                        <a>Posts</a>
                    </ActiveLink>
                </nav>
                <SigInButton/>
            </div>
        </header>
    );
}