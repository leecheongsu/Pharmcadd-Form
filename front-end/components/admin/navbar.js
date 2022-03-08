import { MenuIcon } from '@heroicons/react/solid'
import Button from '../Button'

const Navbar = ({ onClickMenu }) => {
    return (
        <header className="navbar container-fluid flex items-center bg-white">
            <Button icon onClick={onClickMenu} className="p-5 -ml-5">
                <MenuIcon className="h-6 w-6 text-gray-700" />
            </Button>
            <span className="text-base text-gray-700">PharmCADD FORM</span>
        </header>
    )
}

export default Navbar
