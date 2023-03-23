import React from 'react';
const Homepagetable: React.FC<{ name: string }> = ({ name }) => {
  return <div className=""></div>;
};
const HomePage = () => {
  const Components: { [index: string]: any } = {
    Homepagetable: Homepagetable,
  };
  const j = {
    Component: 'Homepagetable',
    props: {
      name: 'Home Page',
    },
    children: [],
  };

  return React.createElement(Components[j.Component], { ...j.props });
};

export default HomePage;
