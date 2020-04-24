import React from 'react';
import './ExploreContainer.css';
import {Link} from 'react-router-dom'

interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  return (
    <div className="container">
      <strong>{name}</strong>
      <p>About project <Link to="/about">here</Link>!</p>
    </div>
  );
};

export default ExploreContainer;
