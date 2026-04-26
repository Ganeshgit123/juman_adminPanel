import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    label: 'Header Links',
    icon: 'mdi mdi-link',
    link: '/header_link'
  },
  {
    label: 'Banners',
    icon: 'mdi mdi-image-area',
    link: '/banners'
  },
  {
    label: 'Home',
    icon: 'mdi mdi-home',
    subItems: [
      {
        label: 'Sections',
        link: '/home',
      },
      {
        label: 'Operating Companies',
        link: '/operating_companies',
      },
      // {
      //   label: 'Successful Partner',
      //   link: '/successful-partner',
      // },
      {
        label: 'Clients',
        link: '/our-clients',
      },
      {
        label: 'Testimonials',
        link: '/our-testimonial',
      },
      {
        label: 'Latest News',
        link: '/latest-news',
      },
    ]
  },
  {
    label: 'Who we are',
    icon: 'mdi mdi-account-multiple',
    subItems: [
      {
        label: 'Sections',
        link: '/who-we-are',
      },
      {
        label: 'Investment Strategy',
        link: '/investment-strategy',
      },
    ]
  },
  {
    label: 'Operating Companies',
    icon: 'mdi mdi-office-building',
    link: '/operating-companies'
  },
  {
    label: 'Board Of Director',
    icon: 'mdi mdi-account-settings',
    link: '/board-of-director'
  },
  {
    label: 'Services',
    icon: 'mdi mdi-ungroup',
    subItems: [
      {
        label: 'Gcc Installation',
        link: '/gcc-installation',
      },
      {
        label: 'Market Place',
        link: '/marketplace',
      },
    ]
  },
  {
    label: 'Projects',
    icon: 'mdi mdi-bitbucket',
    link: '/projects'
  },
  {
    label: 'Contact Us',
    icon: 'mdi mdi-contacts',
    link: '/contact-us'
  },
  {
    label: 'Career',
    icon: 'mdi mdi-account-network',
    subItems: [
      {
        label: 'Departments',
        link: '/departments',
      },
      {
        label: 'Career List',
        link: '/career',
      },
    ]
  },
  {
    label: 'Footer',
    icon: 'mdi mdi-format-list-bulleted',
    link: '/footer'
  },
];
