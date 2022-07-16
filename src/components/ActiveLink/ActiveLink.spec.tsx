import { render,screen} from '@testing-library/react'
import {ActiveLink} from '.'


jest.mock('next/router' , ()=>{
    return {
        useRouter(){
            return{
                asPath:'/'
            }
        }
    }
})

describe('Activelink component', ()=>{ 

    it('renders correctly', () =>{
        const {debug,getByText} = render(
            <ActiveLink href="/" activeClassName="active">
                <a>Home</a>
            </ActiveLink>
        ) 
        debug()
        expect(getByText('Home')).toBeInTheDocument()
    })
    
    it('adds active class if the link as currently active', () =>{
        const {debug} = render(
            <ActiveLink href="/" activeClassName="active">
                <a>Home</a>
            </ActiveLink>
        )
        debug()
        expect(screen.getByText('Home')).toHaveClass('active')
    })

})