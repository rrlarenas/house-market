import { useNavigate, useLocation } from 'react-router-dom'
import { ReactComponent as OfferIcon } from '../assets/svg/localOfferIcon.svg'
import { ReactComponent as Explore } from '../assets/svg/exploreIcon.svg'
import { ReactComponent as PersonOutlineIcon } from '../assets/svg/personOutlineIcon.svg'
import React from 'react'

function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()

    const pathMatchRoute = (route) => {
        if (route === location.pathname) {
            return true
        }
    }
    return (
        <footer className="navbar">
            <nav className="navbarNav">
                <ul className="navbarListItems">
                    <li className="navbarListItem" onClick={() => navigate('/')}>
                        <Explore fill={pathMatchRoute('/') ? '#2c2c2c' : '#e8e8e8'} width='36px' height='36px' />
                        <p className=
                            {pathMatchRoute('/') ?
                                'navbarListItemNameActive' :
                                'navbarListItemName'}>
                            Búscar
                        </p>
                    </li>
                    <li className="navbarListItem" onClick={() => navigate('/offers')}>
                        <OfferIcon fill={pathMatchRoute('/offers') ? '#2c2c2c' : '#e8e8e8'} width='36px' height='36px' />
                        <p className=
                            {pathMatchRoute('/offers') ?
                                'navbarListItemNameActive' :
                                'navbarListItemName'}>
                            Ofertas
                        </p>
                    </li>
                    <li className="navbarListItem" onClick={() => navigate('/profile')}>
                        <PersonOutlineIcon fill={pathMatchRoute('/profile') ? '#2c2c2c' : '#e8e8e8'} width='36px' height='36px' />
                        <p className=
                            {pathMatchRoute('/profile') ?
                                'navbarListItemNameActive' :
                                'navbarListItemName'}>
                            Mi Perfil
                        </p>
                    </li>
                </ul>
            </nav>
        </footer>

    )
}

export default Navbar