import React from 'react';
import LinkItem from './LinkItem';
import ProfileMenu from './ProfileMenu';


const NavLinks = ({user}) => {
    const links = [
        { title: 'Home', href: '/', visibility: true },
        { title: 'Login/Register', href: '/auth/signin', visibility: !Boolean(user) },
        { 
          title: 'Profile', 
        //   href: '/profile', 
          visibility: Boolean(user),
          innerComponent: <ProfileMenu  user={ user }/>
        },
        { title: 'About', href: '/about', visibility: true },
        { title: 'Contact', href: '/contact', visibility: true },
      ];
      return (
        <>
          {links.map((link, index) =>
            link.visibility  ? (
              <LinkItem key={index} link={link} />
            ) : null
          )}
        </>
      );
}

export default NavLinks
