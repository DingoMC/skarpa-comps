export const cardHeaderTheme = {
  defaultProps: {
    variant: 'filled',
    color: 'main',
    shadow: false,
    floated: false,
    className: '',
  },
  valid: {
    variants: ['filled'],
    colors: [
      'main',
      'test',
    ],
  },
  styles: {
    base: {
      initial: {
        position: 'static',
        mt: 'mt-0',
        mx: 'mx-0',
        // Very interesting case where rounded-t-md doesn't work, only classes that apply to all sides
        borderRadius: 'rounded-md',
      },
      shadow: {
        boxShadow: 'shadow-lg',
      },
      floated: {
        mt: '-mt-6',
      },
    },
    variants: {
      filled: {
        main: {
          background: 'bg-main',
          color: 'text-white',
          shadow: 'shadow-main-500/40',
        },
        test: {
          background: 'bg-test',
          color: 'text-white',
          shadow: 'shadow-test-500/40',
        },
      },
    },
  },
};
