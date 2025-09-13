export const cardTheme = {
  defaultProps: {
    variant: 'filled',
    color: 'white',
    shadow: true,
    className: '',
  },
  valid: {
    variants: ['filled'],
    colors: [
      'white',
    ],
  },
  styles: {
    base: {
      initial: {
        position: 'static',
        display: 'flex',
        flexDirection: 'flex-col',
        backgroundClip: 'bg-clip-border',
        borderRadius: 'rounded-md',
      },
      shadow: {
        boxShadow: 'shadow-md',
      },
    },
    variants: {
      filled: {
        white: {
          backgroud: 'bg-white',
          color: 'text-gray-700',
        },
      },
    },
  },
};
