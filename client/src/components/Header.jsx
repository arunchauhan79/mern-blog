import { Link, useLocation } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { Navbar, TextInput, Button, Dropdown, Avatar, DropdownHeader, DropdownDivider } from 'flowbite-react'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';

const Header = () => {
  const dispatch = useDispatch();
  const path = useLocation().pathname;
  const currentUser = useSelector(state => state.user.currentUser);
  const { theme } = useSelector(state => state.theme)
  const handleTheme = () => {
    dispatch(toggleTheme());
  }
  return (
    <Navbar className='border-b-2'>
      <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Arun's</span> Blog
      </Link>
      <form>
        <TextInput className='hidden lg:inline' placeholder='Search' text='text' rightIcon={AiOutlineSearch} />
      </form>
      <Button className='w-12 h-10 lg:hidden' color='gray' pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button className='w-12 h-10 hidden sm:inline' color='gray' pill onClick={handleTheme}>
          {theme == 'light' ? <FaMoon /> : <FaSun />}
        </Button>
        {
          currentUser ? (<Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt='user' img={currentUser.profilePicture}
                rounded />
            }
          >
            <Dropdown.Header>
              <span className='block text-sm'>@{currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>@{currentUser.email}</span>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item>Profile</Dropdown.Item>
              <DropdownDivider />
            </Link>
            <Dropdown.Item>Sign out</Dropdown.Item>
          </Dropdown>) : (<Link to='/sign-in'>
            <Button gradientDuoTone='purpleToBlue' outline>
              Sign In
            </Button>
          </Link>)
        }

        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as={'div'}>
          <Link to='/'>Home</Link>
        </Navbar.Link >
        <Navbar.Link active={path === '/about'} as={'div'}>
          <Link to='/about'>About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/projects'} as={'div'}>
          <Link to='/projects'>Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>


    </Navbar>
  )
}

export default Header