/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import PropTypes from 'prop-types';
import DefaultImage from '../../assets/images/components/Loader/LoaderPrueba.gif';

class GifLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { imageSrc, overlayBackground, loading } = this.props;
    const imageStyle = {
      width: '200px',
      top: '100%'
      // 'paddingTop': '400px',
      // 'marginLeft': '80px'
    };

    const overlayBlockStyle = {
      zIndex: '99999',
      height: '100%',
      width: '100%',
      textAlign: 'center',
      position: 'absolute',
      top: '0',
      left: '0',
      display: loading ? 'flex' : 'none',
      backgroundColor: overlayBackground,
      overflowY: 'hidden',
      overflowX: 'hidden'
    };
    return (
      <div
        className="row justify-content-center"
        style={overlayBlockStyle}
      >
        <img
          className="align-self-center"
          style={imageStyle}
          src={imageSrc}
        />
      </div>
    );
  }
}
GifLoader.propTypes = {
  imageSrc: PropTypes.string,
  overlayBackground: PropTypes.string,
  imageStyle: PropTypes.object,
  loading: PropTypes.bool.isRequired
};
GifLoader.defaultProps = {
  imageSrc: { DefaultImage },
  imageStyle: { marginTop: '20%' },
  overlayBackground: 'rgba(0,0,0,0.4)'
};
export default GifLoader;
