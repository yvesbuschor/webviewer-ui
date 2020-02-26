import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Tooltip from 'components/Tooltip';
import Icon from 'components/Icon';

import selectors from 'selectors';

import './Button.scss';

const propTypes = {
  isActive: PropTypes.bool,
  mediaQueryClassName: PropTypes.string,
  img: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  color: PropTypes.string,
  dataElement: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

const Button = props => {
  const [removeElement, customOverrides = {}] = useSelector(
    state => [
      selectors.isElementDisabled(state, props.dataElement),
      selectors.getCustomElementOverrides(state, props.dataElement),
    ],
    shallowEqual,
  );

  const {
    disable,
    isActive,
    mediaQueryClassName,
    img,
    label,
    color,
    dataElement,
    onClick,
    className,
    title,
    style,
  } = { ...props, ...customOverrides };

  const isBase64 = img?.trim().startsWith('data:');
  // if there is no file extension then assume that this is a glyph
  const isGlyph =
    img && !isBase64 && (!img.includes('.') || img.startsWith('<svg'));
  const shouldRenderTooltip = title && !disable;

  const children = (
    <button
      className={classNames({
        Button: true,
        active: isActive,
        disable,
        [mediaQueryClassName]: mediaQueryClassName,
        [className]: className,
      })}
      style={style}
      data-element={dataElement}
      onClick={disable ? undefined : onClick}
    >
      {isGlyph && <Icon glyph={img} color={color} />}
      {img && !isGlyph && <img src={img} alt="" />}
      {label && <p>{label}</p>}
    </button>
  );

  return removeElement ? null : shouldRenderTooltip ? (
    <Tooltip content={title}>{children}</Tooltip>
  ) : (
    children
  );
};

Button.propTypes = propTypes;

export default React.memo(Button);
