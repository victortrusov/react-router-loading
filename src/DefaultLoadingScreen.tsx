import React from 'react';
import { Location } from 'react-router-dom';

export type LoadingScreenProps = {
    location?: Location;
};

const DefaultLoadingScreen: React.FC<LoadingScreenProps> = () => (
    <div
        style={{
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'white',
        }}
    />
);

export default DefaultLoadingScreen;
