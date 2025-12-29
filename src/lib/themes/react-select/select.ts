import { StylesConfig } from 'react-select';

export function defaultStyle<T>({
  width,
  minWidth,
  menuHeight,
}: {
  width?: string;
  minWidth?: string;
  menuHeight?: string;
}): StylesConfig<T> {
  return {
    control: (styles, props) => ({
      ...styles,
      fontSize: '0.9rem',
      borderRadius: '0px',
      borderBottom: '1px solid',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      borderColor: props.selectProps.menuIsOpen ? 'rgb(33,33,33)' : 'rgb(176,190,197)',
      boxShadow: 'none',
      padding: '1px 0 1px 0',
      ':hover': {
        borderColor: props.selectProps.menuIsOpen ? 'rgb(33,33,33)' : 'rgb(176,190,197)',
      },
      cursor: 'pointer',
      minHeight: '26px',
      fontWeight: 'bold',
      width,
      minWidth,
    }),
    indicatorSeparator: (styles) => ({
      ...styles,
      display: 'none',
    }),
    singleValue: (styles) => ({
      ...styles,
      color: 'rgb(69,90,100)',
      fontSize: '0.785rem',
    }),
    dropdownIndicator: (styles, props) => ({
      ...styles,
      display: props.selectProps.isDisabled ? 'none' : 'block',
      color: 'rgb(120,144,156)',
      transition: 'transform 0.3s ease',
      transform: props.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      padding: '0 8px',
      marginBottom: '2px',
    }),
    menu: (styles) => ({
      ...styles,
      padding: '0.75rem',
      borderRadius: '0.375rem',
      borderColor: 'rgb(236,239,241)',
      zIndex: 30,
      width,
      minWidth,
      height: menuHeight,
    }),
    menuList: (styles) => ({
      ...styles,
      height: menuHeight !== undefined ? '100%' : undefined,
    }),
    option: (styles, props) => ({
      ...styles,
      backgroundColor: props.isSelected ? 'rgb(236,239,241,0.8)' : 'transparent',
      color: 'rgb(38,50,56)',
      cursor: 'pointer',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      ':hover': {
        backgroundColor: props.isSelected ? 'rgb(236,239,241,0.8)' : 'rgba(0,0,0,0.05)',
      },
    }),
    input: (styles) => ({
      ...styles,
      margin: 0,
      padding: 0,
    }),
  };
}

export function defaultStyleOutlined<T>({
  width,
  minWidth,
  maxWidth,
  height,
  menuHeight,
}: {
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  height?: string;
  menuHeight?: string;
}): StylesConfig<T> {
  return {
    control: (styles, props) => ({
      ...styles,
      fontSize: '0.9rem',
      borderRadius: '8px',
      border: '1px solid #b0bec5',
      borderColor: props.selectProps.menuIsOpen ? 'rgb(33,33,33)' : '#b0bec5',
      boxShadow: 'none',
      padding: '6px 1px 5px 1px',
      ':hover': {
        borderColor: props.selectProps.menuIsOpen ? 'rgb(33,33,33)' : '#b0bec5',
      },
      cursor: 'pointer',
      minHeight: '26px',
      fontWeight: 'semibold',
      width,
      minWidth,
      maxWidth,
      height,
    }),
    indicatorSeparator: (styles) => ({
      ...styles,
      display: 'none',
    }),
    singleValue: (styles) => ({
      ...styles,
      color: 'rgb(69,90,100)',
      fontSize: '0.785rem',
    }),
    dropdownIndicator: (styles, props) => ({
      ...styles,
      display: props.selectProps.isDisabled ? 'none' : 'block',
      color: 'rgb(120,144,156)',
      transition: 'transform 0.3s ease',
      transform: props.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      padding: '0 8px',
      marginBottom: '2px',
    }),
    menu: (styles) => ({
      ...styles,
      padding: '0.75rem',
      borderRadius: '0.375rem',
      borderColor: 'rgb(236,239,241)',
      zIndex: 30,
      width,
      height: menuHeight,
      minWidth,
      maxWidth,
    }),
    menuList: (styles) => ({
      ...styles,
      height: menuHeight !== undefined ? '100%' : undefined,
    }),
    option: (styles, props) => ({
      ...styles,
      backgroundColor: props.isSelected ? 'rgb(236,239,241,0.8)' : 'transparent',
      color: 'rgb(38,50,56)',
      cursor: 'pointer',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      ':hover': {
        backgroundColor: props.isSelected ? 'rgb(236,239,241,0.8)' : 'rgba(0,0,0,0.05)',
      },
    }),
    input: (styles) => ({
      ...styles,
      margin: 0,
      padding: 0,
    }),
    clearIndicator: (styles) => ({
      ...styles,
      padding: '4px',
    }),
  };
}

export function styleWhite<T>(width?: string): StylesConfig<T> {
  return {
    control: (styles, props) => ({
      ...styles,
      fontSize: '0.9rem',
      borderRadius: '0px',
      borderBottom: '1px solid',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      borderColor: props.selectProps.menuIsOpen ? 'rgb(255,255,255)' : 'rgb(176,190,197)',
      boxShadow: 'none',
      padding: '1px 0 1px 0',
      ':hover': {
        borderColor: props.selectProps.menuIsOpen ? 'rgb(255,255,255)' : 'rgb(176,190,197)',
      },
      cursor: 'pointer',
      minHeight: '26px',
      fontWeight: 'bold',
      background: 'none',
      width,
    }),
    indicatorSeparator: (styles) => ({
      ...styles,
      display: 'none',
    }),
    singleValue: (styles) => ({
      ...styles,
      color: 'white',
      fontSize: '0.785rem',
    }),
    dropdownIndicator: (styles, props) => ({
      ...styles,
      display: props.selectProps.isDisabled ? 'none' : 'block',
      color: 'rgb(224,224,224)',
      transition: 'transform 0.3s ease',
      transform: props.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      padding: '0 8px',
      marginBottom: '2px',
    }),
    menu: (styles) => ({
      ...styles,
      padding: '0.75rem',
      borderRadius: '0.375rem',
      borderColor: 'rgb(236,239,241)',
    }),
    option: (styles, props) => ({
      ...styles,
      backgroundColor: props.isSelected ? 'rgb(236,239,241,0.8)' : 'transparent',
      color: 'rgb(38,50,56)',
      cursor: 'pointer',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      ':hover': {
        backgroundColor: props.isSelected ? 'rgb(236,239,241,0.8)' : 'rgba(0,0,0,0.05)',
      },
    }),
    input: (styles) => ({
      ...styles,
      margin: 0,
      padding: 0,
    }),
  };
}
