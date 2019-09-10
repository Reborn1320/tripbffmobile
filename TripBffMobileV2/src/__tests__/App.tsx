import 'react-native';
import React from 'react';
import Loading from '../_atoms/Loading/Loading';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(
    // <Loading message="aaa" />
  );
});