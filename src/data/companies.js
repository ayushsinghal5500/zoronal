export const companies = [
  {
    id: '1',
    name: 'Graffersid Web and App Development',
    address: '816, Shekhar Central, Manorama Ganj, AB road, New Palasia, Indore (M.P.)',
    rating: 4.5,
    reviews: 41,
    foundedDate: '01-01-2016',
    logo: 'G',
  },
];

export const companyReviews = {
  '1': [
    {
      id: 1,
      user: 'Jorgue Watson',
      date: '01-01-2022, 14:33',
      rating: 4,
      comment:
        'Graffersid one of the best Company dolor sit amet, consectetur adipiscing elit. Congue netus feugiat elit suspendisse commodo. Pellentesque risus suspendisse mattis et massa. Ultrices ac at nibh et. Aliquam aliquam ultricies ac pulvinar eleifend duis. Eget congue fringilla quam ut mattis tortor posuere semper ac. Sem egestas vestibulum faucibus montes. Gravida sit non arcu consequat.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jorgue',
    },
    {
      id: 2,
      user: 'Jenny kole',
      date: '12-01-2022, 15:00',
      rating: 4,
      comment:
        'Graffersid one of the best Company dolor sit amet, consectetur adipiscing elit. Congue netus feugiat elit suspendisse commodo. Pellentesque risus suspendisse mattis et massa. Ultrices ac at nibh et.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jenny',
    },
    {
      id: 3,
      user: 'Ayush Patel',
      date: '12-01-2022, 15:00',
      rating: 4,
      comment: 'Graffersid one of the best Company in App Development',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ayush',
    },
  ],
};

export const getCompanyById = (companyId) =>
  companies.find((company) => company.id === companyId) ?? companies[0];

export const getCompanyReviewsById = (companyId) => companyReviews[companyId] ?? [];
